'use strict';

const Plex = require('./plexauthentication');
const Users = require('./users').module;
const Bcrypt = require('bcryptjs');
const Boom = require('boom');
const secret = 'mDflZg6o3iWHYmbHLZ2V8YuU5YlbJ8YCLxo9kLAMmGNTIVfB95';

const checkPassword = (password, hash) => {

    return new Promise((resolve, reject) => {

        Bcrypt.compare(password, hash, (err, res) => {

            if (res === true) {
                return resolve(true);
            }

            const message = (err) ? err.message : 'Incorrect password!';
            return reject(new Error(message));
        });
    });
};

const validate = (decoded, request, callback) => {

    Users.findOne({ username: decoded.username }, (err, result) => {

        if (err) {
            return callback(err. null);
        }

        if (result) {
            checkPassword(decoded.password, result.password)
                .then(() => {

                    return callback(null, true);
                })
                .catch((err) => {

                    return callback(err);
                });
        }
        else {
            return callback(null, false);
        }
    });
};

const generatetoken = (username, password, email, callback) => {

    const JWT = require('jsonwebtoken');
    const obj = {
        'username': username,
        'password': password
    };
    const token = JWT.sign(obj, secret, { expiresIn: '14d' });

    Bcrypt.genSalt(10, (err, salt) => {

        if (err) {
            return callback(err, null);
        }

        Bcrypt.hash(password, salt, (err, hash) => {

            if (err) {
                throw new Error(err);
            }

            if (email) {
                Users.insert({
                    username: username,
                    password: hash,
                    email: email,
                    role: 'user',
                    created: Date.now()
                }, (err, doc) => {

                    if (err) {
                        return callback(err, null);
                    }
                    return callback(null, token);
                });
            }
            else {
                return callback(null, token);
            }
        });
    });
};

const login = (auth, callback) => {

    const username = auth.split(':')[0];
    const password = auth.split(':')[1];

    if (!username | !password) {
        return callback(new Error('Error generating token, missing a username/password'), null);
    }

    Users.findOne({ username: username }, (err, user) => {

        if (err) {
            return callback(err, null);
        }
        else if (user) {
            checkPassword(password, user.password)
                .then((valid) => {

                    generatetoken(username, password, false, (err, token) => {

                        if (err) {
                            return callback(err, null);
                        }
                        return callback(null, token);
                    });
                })
                .catch((err) => {

                    return callback(err);
                });
        }
        else {
            Plex.checkPlexLogin(auth, (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                const email = result;
                Plex.verifyPlexUser(username, (err, valid) => {

                    if (err | !valid) {
                        const message = (err) ? err.message : 'Incorrect password!';
                        return callback(new Error(message), null);
                    }

                    generatetoken(username, password, email, (error, token) => {

                        if (error) {
                            return callback(error, null);
                        }
                        return callback(null, token);
                    });
                });
            });
        }
    });
};

exports.login = login;

// To shut the linter up
exports.generatetoken = generatetoken;

exports.register = (server, options, next) => {

    server.auth.strategy('jwt', 'jwt', {
        key: secret,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.route({
        method: 'POST', path: '/api/v1/login', config: { auth: false },
        handler: (request, reply) => {

            if (request.headers.authorization) {
                const auth = new Buffer(request.headers.authorization.substring(6), 'base64').toString('ascii');

                login(auth, (err, token) => {

                    if (err) {
                        reply(Boom.unauthorized(err.message));
                    }
                    else {
                        reply({ token: token });
                    }
                });
            }
            else {
                reply(Boom.badRequest('No authorization credentials provided'));
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

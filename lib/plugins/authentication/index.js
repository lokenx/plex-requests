'use strict';

const Plex = require('./plexauthentication');
const Users = require('./users').module;
const Bcrypt = require('bcryptjs');
const secret = 'mDflZg6o3iWHYmbHLZ2V8YuU5YlbJ8YCLxo9kLAMmGNTIVfB95';

const checkPassword = (password, hash, callback) => {

    Bcrypt.compare(password, hash, (err, res) => {

        if (err) {
            return callback(err, null);
        }
        else if (res === true) {
            return callback(null, true);
        }

        return callback(null, false);
    });
};

const validate = (decoded, request, callback) => {

    Users.findOne({ username: decoded.username }, (err, result) => {

        if (err) {
            return callback(err. null);
        }

        if (result) {
            checkPassword(decoded.password, result.password, (err, res) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, res);
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

exports.login = (auth, callback) => {

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
            checkPassword(password, user.password, (err, res) => {

                if (err) {
                    return callback(err, null);
                }
                else if (res) {
                    generatetoken(username, password, false, (err, token) => {

                        if (err) {
                            return callback(err, null);
                        }
                        return callback(null, token);
                    });
                }
                else {
                    return callback(new Error('Incorrect password'), null);
                }
            });
        }
        else {
            Plex.checkPlexLogin(auth, (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                const email = result;
                Plex.verifyPlexUser(username, (err, valid) => {

                    if (err) {
                        return callback(err, null);
                    }
                    if (!valid) {
                        return callback(new Error('Permission denied'), null);
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

// To shut the linter up
exports.generatetoken = generatetoken;

exports.register = (plugin, options, next) => {

    plugin.auth.strategy('jwt', 'jwt', {
        key: secret,
        validateFunc: validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

'use strict';

const Plex = require('./plexauthentication');
const Boom = require('boom');
const Helpers = require('./helpers');
const secret = require('./secret.json').secret;

const validate = (decoded, request, callback) => {

    Helpers.findUser(decoded.username)
    .then((user) => {

        Helpers.checkPassword(decoded.password, user.password);
    })
    .then((result) => {

        return callback(null, true);
    })
    .catch((err) => {

        return callback(err);
    });
};

const login = (auth, callback) => {

    const username = auth.split(':')[0];
    const password = auth.split(':')[1];

    if (!username | !password) {
        return callback(new Error('Error generating token, missing a username/password'), null);
    }

    Helpers.findUser(username)
    .then((user) => {

        return Helpers.checkPassword(password, user.password);
    })
    .then((valid) => {

        return Helpers.generatetoken(username, password);
    })
    .then((token) => {

        return callback(null, token);
    })
    .catch((err) => {

        if (err.message === 'No user found!') {
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

                    Helpers.hashPassword(password)
                    .then((hash) => {

                        const user = {
                            username: username,
                            password: hash,
                            email: email
                        };
                        return Helpers.addUser(user);
                    })
                    .then(() => {

                        return Helpers.generatetoken(username, password);
                    })
                    .then((token) => {

                        return callback(null, token);
                    })
                    .catch((err) => {

                        console.log(err);
                        return callback(err);
                    });
                });
            });
        }
        else {
            return callback(err);
        }
    });
};

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

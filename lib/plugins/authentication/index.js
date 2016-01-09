'use strict';

const Plex = require('./plexauthentication');
const Boom = require('boom');
const Calibrate = require('calibrate');
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

        const temp = {};

        if (err.message === 'No user found!') {
            Plex.checkPlexLogin(auth)
            .then((email) => {

                temp.email = email;
                return Plex.verifyPlexUser(username);
            })
            .then((allowed) => {

                return Helpers.hashPassword(password);
            })
            .then((hash) => {

                const user = {
                    username: username,
                    password: hash,
                    email: temp.email
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

                return callback(err);
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
        method: 'POST', path: '/login', config: { auth: false },
        handler: (request, reply) => {

            if (request.headers.authorization) {
                const auth = new Buffer(request.headers.authorization.substring(6), 'base64').toString('ascii');

                login(auth, (err, token) => {

                    if (err) {
                        return reply(Calibrate.error(Boom.unauthorized(err.message)));
                    }
                    return reply(Calibrate.response({ token: token }));
                });
            }
            else {
                reply(Boom.badRequest('No authorization credentials provided'));
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/refresh-token',
        config: {
            auth: 'jwt',
            handler: (request, reply) => {

                Helpers.generatetoken(request.auth.credentials.username, request.auth.credentials.password)
                .then((token) => {

                    return reply(Calibrate.response({ token: token }));
                });
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

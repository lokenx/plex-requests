'use strict';

// const Plex = require('./plex');
const Users = require('./users').module;
const Bcrypt = require('bcryptjs');
const secret = 'SECRET';

const validate = (decoded, request, callback) => {

    Users.findOne({ username: decoded.username }, (err, result) => {

        if (err) {
            return callback(err. null);
        }

        if (result) {
            Bcrypt.compare(decoded.password, result.password, (err, res) => {

                if (err) {
                    return callback(err, null);
                }
                else if (res === true) {
                    return callback(null, true);
                }

                return callback(null, false);
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

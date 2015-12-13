'use strict';

const Users = require('./users').module;
const Bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const secret = require('./secret.json').secret;

exports.checkPassword = (password, hash) => {

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

exports.findUser = (username) => {

    return new Promise((resolve, reject) => {

        Users.findOne({ username: username }, (err, result) => {

            if (result) {
                return resolve(result);
            }

            const message = (err) ? err.message : 'No user found!';
            return reject(new Error(message));
        });
    });
};

exports.addUser = (user) => {

    return new Promise((resolve, reject) => {

        if (user.email) {
            Users.insert({
                username: user.username,
                password: user.password,
                email: user.email,
                role: 'user',
                created: Date.now()
            }, (err, doc) => {

                if (err) {
                    return reject(err);
                }
                return resolve(true);
            });
        }
        else {
            return resolve(true);
        }
    });
};

const hashPassword = (password) => {

    return new Promise((resolve, reject) => {

        Bcrypt.genSalt(10, (err, salt) => {

            if (err) {
                return reject(err);
            }

            Bcrypt.hash(password, salt, (err, hash) => {

                if (err) {
                    return reject(err);
                }

                return resolve(hash);
            });
        });
    });
};

exports.hashPassword = hashPassword;

exports.generatetoken = (username, password) => {

    return new Promise((resolve, reject) => {

        const user = {
            'username': username,
            'password': password
        };
        const token = JWT.sign(user, secret, { expiresIn: '14d' });
        return resolve(token);
    });
};

exports.isAdmin = (username) => {

    return new Promise((resolve, reject) => {

        Users.findOne({ username: username }, (err, result) => {

            if (result) {
                if (result.role === 'admin') {
                    return resolve(true);
                }
            }

            const message = (err) ? err.message : 'Not an admin';
            return reject(new Error(message));
        });
    });
};

(function () {

    Users.find({}).count((err, count) => {

        if (err) {
            throw err;
        }
        if (count === 0) {
            hashPassword('password')
            .then((hash) => {

                Users.insert({
                    username: 'admin',
                    password: hash,
                    role: 'admin'
                });
                console.log('Created user admin:password');
            });
        }
    });
}());

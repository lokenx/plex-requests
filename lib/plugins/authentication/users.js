'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');
const Bcrypt = require('bcryptjs');

LinvoDB.dbPath = Path.resolve('databases');

const Users = new LinvoDB('users', {
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    email: {
        type: String,
        default: ''
    },
    role: String,
    created: Date
}, {});

Users.count({}, (err, count) => {

    if (err) {
        throw new Error(err);
    }
    else if (count === 0) {
        Bcrypt.genSalt(10, (err, salt) => {

            Bcrypt.hash('password', salt, (err, hash) => {

                if (err) {
                    throw new Error(err);
                }
                Users.insert({
                    username: 'admin',
                    password: hash,
                    email: 'admin@you.me',
                    role: 'admin',
                    created: Date.now()
                });
                console.log('Created default admin user admin:password');
            });
        });
    }
});

exports.module = Users;

'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');
// const Helpers = require('./helpers');

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

// (function () {
    // Users.find({}).count((err, count) => {
    //
    //     if (err) {
    //         throw err;
    //     }
    //     if (count === 0) {
    //         Helpers.hashPassword('password')
    //         .then((hash) => {
    //
    //             Users.insert({
    //                 username: 'admin',
    //                 password: hash,
    //                 role: 'admin'
    //             });
    //             console.log('Created user admin:password');
    //         });
    //     }
    // });
// });
exports.module = Users;

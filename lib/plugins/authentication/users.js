'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');

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

exports.module = Users;

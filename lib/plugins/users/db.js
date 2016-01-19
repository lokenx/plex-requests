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
    email: String,
    created: {
        type: Date,
        default: Date.now()
    }
}, {});

exports.module = Users;

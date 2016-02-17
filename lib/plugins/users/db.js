'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');
const env = process.env.TESTING_ENV;

LinvoDB.dbPath = (env) ? Path.resolve('databases_test') : Path.resolve('databases');

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

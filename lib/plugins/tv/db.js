'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');
const env = process.env.TESTING_ENV;

LinvoDB.dbPath = (env) ? Path.resolve('databases_test') : Path.resolve('databases');

const TV = new LinvoDB('tv', {
    title: String,
    tvdb: {
        type: String,
        index: true,
        unique: true
    },
    released: Date,
    approved: Boolean,
    status: {
        downloaded: Number,
        available: Number
    },
    user: String,
    poster_path: String,
    created: {
        type: Date,
        default: Date.now()
    }
}, {});

exports.module = TV;

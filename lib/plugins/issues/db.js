'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');
const env = process.env.TESTING_ENV;

LinvoDB.dbPath = (env) ? Path.resolve('databases_test') : Path.resolve('databases');

const Issues = new LinvoDB('issues', {
    title: String,
    user: String,
    message: String,
    season: Number,
    episode: Number,
    resolved: Boolean,
    created: {
        type: Date,
        default: Date.now()
    }
}, {});

exports.module = Issues;

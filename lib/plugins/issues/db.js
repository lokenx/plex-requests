'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');

LinvoDB.dbPath = Path.resolve('databases');

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

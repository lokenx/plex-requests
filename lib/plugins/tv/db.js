'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');

LinvoDB.dbPath = Path.resolve('databases');

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

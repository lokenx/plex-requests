'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');

LinvoDB.dbPath = Path.resolve('databases');

const Movies = new LinvoDB('movies', {
    title: String,
    imdb: {
        type: String,
        index: true,
        unique: true
    },
    tmdb: {
        type: Number,
        index: true,
        unique: true
    },
    released: Date,
    approved: Boolean,
    downloaded: Boolean,
    user: String,
    poster_path: String,
    created: {
        type: Date,
        default: Date.now()
    }
}, {});

exports.module = Movies;

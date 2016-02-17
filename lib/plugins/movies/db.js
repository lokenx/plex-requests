'use strict';

const LinvoDB = require('linvodb3');
const Path = require('path');
const env = process.env.TESTING_ENV;

LinvoDB.dbPath = (env) ? Path.resolve('databases_test') : Path.resolve('databases');

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

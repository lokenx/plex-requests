'use strict';

const Movies = require('./db').module;
const AuthHelper = require('../authentication/helpers');

exports.allMovies = (start) => {

    return new Promise((resolve, reject) => {

        Movies.find({}).sort({ created: -1 }).skip(start).limit(10).exec((err, result) => {

            if (result.length !== 0) {
                return resolve(result);
            }

            const message = (err) ? err.message : 'No movies found!';
            return reject(new Error(message));
        });
    });
};

exports.addMovie = (movie) => {

    return new Promise((resolve, reject) => {

        Movies.insert(movie, (err, doc) => {

            if (doc) {
                return resolve(doc);
            }

            const message = (err) ? err.message : 'Error adding movie!';
            return reject(new Error(message));
        });
    });
};

exports.removeMovie = (movie, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        .then((admin) => {

            Movies.remove({ tmdb: movie.tmdb }, (err, doc) => {

                if (doc) {
                    return resolve(movie);
                }

                const message = (err) ? err.message : 'Movie not found to remove!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

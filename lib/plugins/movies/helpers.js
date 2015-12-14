'use strict';

const Movies = require('./db').module;

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

    return new new Promise((resolve, reject) => {

        Movies.insert(movie, (err, doc) => {

            if (doc) {
                return resolve(doc);
            }

            const message = (err) ? err.message : 'Error adding movie!';
            return reject(new Error(message));
        });
    });
};

'use strict';

const Boom = require('boom');
const Helpers = require('./helpers');

// TODO: Use the Calibrate package to send data back in a uniform manner. Refer to search plugin.

exports.get = {
    handler: (request, reply) => {

        Helpers.getMovies()
        .then((movies) => {

            reply(movies);
        })
        .catch((err) => {

            reply(Boom.notFound(err.message));
        });
    },
    auth: 'jwt'
};

exports.add = {
    handler: (request, reply) => {

        Helpers.addMovie(request.payload)
        .then((movie) => {

            reply(movie);
        })
        .catch((err) => {

            reply(Boom.forbidden(err.message));
        });
    },
    auth: 'jwt'
};

exports.remove = {
    handler: (request, reply) => {

        Helpers.removeMovie(request.payload, request.auth.credentials.username)
        .then((removed) => {

            reply(removed);
        })
        .catch((err) => {

            reply(Boom.forbidden(err.message));
        });
    },
    auth: 'jwt'
};

exports.update = {
    handler: (request, reply) => {

        Helpers.updateMovie(request.payload, request.auth.credentials.username)
        .then((removed) => {

            reply(removed);
        })
        .catch((err) => {

            reply(Boom.forbidden(err.message));
        });
    },
    auth: 'jwt'
};

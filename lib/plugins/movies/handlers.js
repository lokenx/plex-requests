'use strict';

const Boom = require('boom');
const Helpers = require('./helpers');

exports.getAll = (request, reply) => {

    Helpers.allMovies(request.params.start)
    .then((movies) => {

        reply(movies);
    })
    .catch((err) => {

        reply(Boom.notFound(err.message));
    });
};

exports.add = (request, reply) => {

    Helpers.addMovie(request.payload)
    .then((movie) => {

        reply(movie);
    })
    .catch((err) => {

        reply(Boom.forbidden(err.message));
    });
};

exports.remove = (request, reply) => {

    Helpers.removeMovie(request.payload, request.auth.credentials.username)
    .then((removed) => {

        reply(removed);
    })
    .catch((err) => {

        reply(Boom.forbidden(err.message));
    });
};

exports.update = (request, reply) => {

    Helpers.updateMovie(request.payload, request.auth.credentials.username)
    .then((removed) => {

        reply(removed);
    })
    .catch((err) => {

        reply(Boom.forbidden(err.message));
    });
};

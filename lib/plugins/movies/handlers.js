'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Helpers = require('./helpers');

exports.getAll = {
    handler: (request, reply) => {

        Helpers.allMovies(request.query.page)
        .then((movies) => {

            reply(movies);
        })
        .catch((err) => {

            reply(Boom.notFound(err.message));
        });
    },
    validate: {
        query: {
            page: Joi.number().default(1)
        }
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

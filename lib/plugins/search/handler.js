'use strict';

const Boom = require('boom');
const Calibrate = require('calibrate');
const Joi = require('joi');
const MovieDB = require('moviedb')('95a281fbdbc2d2b7db59680dade828a6');
const TVDB = require('./tvdb');

const internals = {
    token: ''
};

TVDB.getToken((err, token) => {

    if (token) {
        internals.token = token;
        return;
    }
    throw err;
});


const search = (type, value) => {

    return new Promise((resolve, reject) => {

        switch (type) {
            case 'movie':
                MovieDB.searchMovie({ query: value }, (err, response) => {

                    if (err) {
                        return reject(err);
                    }
                    return resolve(response.results);
                });
                break;
            case 'tv':
                TVDB.search(value, internals.token, (err, response) => {

                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
                break;
            default:
                return reject(Boom.badRequest('Search API: Invalid search type'));
        }
    });
};

module.exports = {
    auth: 'jwt',
    validate: {
        params: {
            type: Joi.string().min(2).max(7),
            value: Joi.string().min(2)
        }
    },
    handler: (request, reply) => {

        const promise = search(request.params.type, request.params.value)
        .then(Calibrate.response)
        .catch(Calibrate.error);

        return reply(promise);
    }
};

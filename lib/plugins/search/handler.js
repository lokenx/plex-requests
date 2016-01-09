'use strict';

const Boom = require('boom');
const Calibrate = require('calibrate');
const Joi = require('joi');
const TVDB = require('./tvdb');
const OMDB = require('omdb');

const internals = {
    token: ''
};

// Retrieves TVDB API Token for searches
TVDB.getToken()
.then((token) => {

    internals.token = token;
    return;
})
.catch((err) => {

    throw err;
});

// Setting refresh interval to get a new token before it expires
setInterval(() => {

    TVDB.refreshToken()
    .then((token) => {

        internals.token = token;
        return;
    })
    .catch((err) => {

        throw err;
    });
}, 1000 * 60 * 60 * 24);


const search = (type, value) => {

    return new Promise((resolve, reject) => {

        switch (type) {
            case 'movie':
                OMDB.search(value, (err, movies) => {

                    if (movies.length > 0) {
                        return resolve(movies);
                    }

                    const message = (err) ? err.message : 'No movies found!';
                    return reject(new Error(message));
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

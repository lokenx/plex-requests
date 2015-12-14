'use strict';

const Boom = require('boom');
const Calibrate = require('calibrate');
const MovieDB = require('moviedb')('95a281fbdbc2d2b7db59680dade828a6');
const TVDB = require('./tvdb');

const internals = {
    token: ''
};

const init = () => {

    return new Promise((resolve, reject) => {

        TVDB.getToken((err, token) => {

            if (token) {
                internals.token = token;
                return resolve(token);
            }
            return reject(err);
        });
    });
};

init().catch((err) => {

    throw err;
});

const search = (type, query) => {

    return new Promise((resolve, reject) => {

        switch (type) {
            case 'movie':
                MovieDB.searchMovie({ query: query }, (err, response) => {

                    if (err) {
                        return reject(err);
                    }
                    return resolve(response.results);
                });
                break;
            case 'tv':
                TVDB.search(query, internals.token, (err, response) => {

                    if (err) {
                        return reject(err);
                    }
                    return resolve(response);
                });
                break;
            default:
                return reject('Search API: Invalid search type');
        }
    });
};

module.exports = (request, reply) => {

    search(request.params.type, request.params.query)
    .then(Calibrate.response)
    .catch((err) => {

        request.server.log(['error'], err.message);
        reply(Boom.badRequest(err.message));
    })
    .then(reply);
};

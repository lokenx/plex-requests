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

module.exports = (request, reply) => {

    search(request.params.type, request.params.value)
    .then(Calibrate.response)
    .catch(Calibrate.error)
    .then(reply);
};

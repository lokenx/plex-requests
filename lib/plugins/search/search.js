'use strict';

const Boom = require('boom');
const MovieDB = require('moviedb')('95a281fbdbc2d2b7db59680dade828a6');
const TVDB = require('./tvdb');

const internals = {
    token: ''
};

TVDB.getToken((err, token) => {

    if (token) {
        internals.token = token;
    }
    else {
        throw err;
    }
});

// setInterval( () => {
//
//     TVDB.refreshToken();
// }, 3600000);

const search = (type, query, callback) => {

    if (type === 'movie') {
        MovieDB.searchMovie({ query: query }, (err, response) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, response);
        });
    }
    else if (type === 'tv') {
        TVDB.search(query, internals.token, (err, response) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, response);
        });
    }
    else {
        return callback(new Error('Search API: Invalid search type'), null);
    }
};

module.exports = (request, reply) => {

    search(request.params.type, request.params.query, (err, results) => {

        if (err) {
            request.server.log(['error'], err.message);
            reply(Boom.badRequest(err.message));
        }
        else {
            reply(results);
        }
    });
};

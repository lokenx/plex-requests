'use strict';

const Boom = require('boom');
const MovieDB = require('moviedb')('95a281fbdbc2d2b7db59680dade828a6');

const search = function (type, query, callback) {

    if (type === 'movie') {
        MovieDB.searchMovie({ query: query }, (err, res) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, res);
        });
    }
    else {
        return callback(new Error('Search API: Invalid search type'), null);
    }
};

module.exports = function (request, reply) {

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

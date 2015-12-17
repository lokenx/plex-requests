'use strict';

const Movies = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/api/v1/movies', config: Movies.getAll
    });

    server.route({
        method: 'POST', path: '/api/v1/movies', config: Movies.add
    });

    server.route({
        method: 'DELETE', path: '/api/v1/movies', config: Movies.remove
    });

    server.route({
        method: 'PUT', path: '/api/v1/movies', config: Movies.update
    });
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

'use strict';

const Movies = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/movies', config: Movies.getAll
    });

    server.route({
        method: 'POST', path: '/movies', config: Movies.add
    });

    server.route({
        method: 'DELETE', path: '/movies', config: Movies.remove
    });

    server.route({
        method: 'PUT', path: '/movies', config: Movies.update
    });
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

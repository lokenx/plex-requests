'use strict';

const Movies = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/api/v1/movies/{start}', config: { auth: 'jwt' },
        handler: Movies.getAll
    });

    server.route({
        method: 'POST', path: '/api/v1/movies', config: { auth: 'jwt' },
        handler: Movies.add
    });

    server.route({
        method: 'DELETE', path: '/api/v1/movies', config: { auth: 'jwt' },
        handler: Movies.remove
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

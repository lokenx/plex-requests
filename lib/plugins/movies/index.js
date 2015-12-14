'use strict';

const Movies = require('./movies');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/api/v1/movies', config: { auth: 'jwt' },
        handler: Movies.getAll
    });

    server.route({
        method: 'POST', path: '/api/v1/movies', config: { auth: 'jwt' },
        handler: Movies.add
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

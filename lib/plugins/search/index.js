'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/api/v1/search/{type}&query={query}', config: { auth: 'jwt' },
        handler: require('./search')
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

'use strict';

const TV = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/tv', config: TV.get
    });

    server.route({
        method: 'POST', path: '/tv', config: TV.add
    });

    server.route({
        method: 'DELETE', path: '/tv', config: TV.remove
    });

    server.route({
        method: 'PUT', path: '/tv', config: TV.update
    });
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

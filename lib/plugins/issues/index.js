'use strict';

const Issues = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/issues', config: Issues.get
    });

    server.route({
        method: 'POST', path: '/issues', config: Issues.add
    });

    server.route({
        method: 'DELETE', path: '/issues', config: Issues.remove
    });

    server.route({
        method: 'PUT', path: '/issues', config: Issues.update
    });
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

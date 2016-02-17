'use strict';

const Users = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/users', config: Users.get
    });

    server.route({
        method: 'DELETE', path: '/users', config: Users.remove
    });

    server.route({
        method: 'PUT', path: '/users/{user}', config: Users.update
    });
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

'use strict';

const Settings = require('./handlers');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/settings', config: Settings.get
    });

    server.route({
        method: 'PUT', path: '/settings', config: Settings.update
    });
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            file: 'index.html'
        }
    });

    server.route({
        method: 'GET',
        path: '/bundle.js',
        handler: {
            file: 'bundle.js'
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

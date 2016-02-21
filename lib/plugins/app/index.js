'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public',
                listing: true
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'dist'
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

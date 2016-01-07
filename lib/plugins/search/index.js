'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/api/v1/search/{type}&query={value}',
        config: require('./handler')
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

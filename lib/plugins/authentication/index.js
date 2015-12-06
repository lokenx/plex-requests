'use strict';

// const Plex = require('./plex');

const secret = 'SECRET';

const validate = (decoded, request, callback) => {

    return callback(null, true);
};

exports.register = (plugin, options, next) => {

    plugin.register({ register: require('hapi-auth-jwt2') }, (err) => {

        plugin.auth.strategy('jwt', 'jwt', {
            key: secret,
            validateFunc: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

        next();
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};

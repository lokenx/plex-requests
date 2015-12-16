'use strict';

const Joi = require('joi');

exports.register = (server, options, next) => {

    server.route({
        method: 'GET', path: '/api/v1/search/{type}&query={value}',
        handler: require('./search'),
        config: {
            auth: 'jwt',
            validate: {
                params: {
                    type: Joi.string().min(2).max(7),
                    value: Joi.string().min(2)
                }
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};

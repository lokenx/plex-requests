'use strict';

const Config = require('./config');

const internals = {};

const composer = module.exports = {};
const Port = process.env.PORT || 8000;

composer.manifest = {
    server: {
        debug: false
    },
    connections: [
        {
            host: 'localhost',
            port: Port
        }
    ],
    plugins: {
        'hapi-auth-jwt2': {},
        './plugins/authentication': Config.path,
        './version': {},
        './plugins/search': Config.path,
        './plugins/movies': Config.path,
        'good': Config.monitor
    }
};

composer.options = {
    relativeTo: __dirname
};

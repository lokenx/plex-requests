'use strict';

const Config = require('./config');

const internals = {};

const composer = module.exports = {};

composer.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 8000
        }
    ],
    plugins: {
        './version': {},
        './plugins/search': {},
        'good': Config.monitor
    }
};

composer.options = {
    relativeTo: __dirname
};

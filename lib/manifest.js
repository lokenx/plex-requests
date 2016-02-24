'use strict';

const Path = require('path');
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
            port: 3000,
            labels: ['api']
        },
        {
            host: 'localhost',
            port: Port,
            labels: ['web'],
            routes: {
                files: {
                    relativeTo: Path.join(__dirname, '../dist')
                }
            }
        }
    ],
    registrations: [
        {
            plugin: 'hapi-auth-jwt2'
        },
        {
            plugin: {
                register: 'good',
                options: Config.monitor
            }
        },
        {
            plugin: './plugins/authentication',
            options: Config.api
        },
        {
            plugin: './plugins/search',
            options: Config.api
        },
        {
            plugin: './plugins/movies',
            options: Config.api
        },
        {
            plugin: './plugins/tv',
            options: Config.api
        },
        {
            plugin: './plugins/issues',
            options: Config.api
        },
        {
            plugin: './plugins/users',
            options: Config.api
        },
        {
            plugin: 'inert'
        },
        {
            plugin: './plugins/app',
            options: {
                select: ['web']
            }
        },
        {
            plugin: './version',
            options: {
                select: ['web']
            }
        }
    ]
};

composer.options = {
    relativeTo: __dirname
};

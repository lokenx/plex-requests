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
            port: Port,
            labels: ['api']
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
            options: Config.path
        },
        {
            plugin: './plugins/search',
            options: Config.path
        },
        {
            plugin: './plugins/movies',
            options: Config.path
        },
        {
            plugin: './plugins/tv',
            options: Config.path
        },
        {
            plugin: './plugins/issues',
            options: Config.path
        },
        {
            plugin: './plugins/users',
            options: Config.path
        },
        {
            plugin: './version'
        }
    ]
};

composer.options = {
    relativeTo: __dirname
};

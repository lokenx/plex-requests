'use strict';

const config = module.exports = {};

config.monitor = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*' }
    }, {
        reporter: require('good-file'),
        events: { log: '*' },
        config: './good.log'
    }]
};

config.path = {
    routes: {
        prefix: '/api/v1'
    }
};

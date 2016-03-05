'use strict';

const config = module.exports = {};
const Url = process.env.URL || '';

console.log(Url);

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

config.api = {
    routes: {
        prefix: '/api/v1' + Url
    }
};

config.web = {
    routes: {
        prefix: Url
    }
};

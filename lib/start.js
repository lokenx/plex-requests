'use strict';

const Hoek = require('hoek');
const Server = require('./index');
const Composer = require('./manifest');

const internals = {};

Server.init(Composer.manifest, Composer.options, (err, server) => {

    Hoek.assert(!err, err);
    console.log(`Hapi times at ${server.info.uri}`);

    // server.on('request-error', (request, err) => {

        // good logging here ?
        // console.log('Error response (500) sent for request: ' + request.id + ' because: ' + err.message);
    // });
});

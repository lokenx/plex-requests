'use strict';

const Hoek = require('hoek');
const Server = require('./index');
const Composer = require('./manifest');
const Settings = require('./settings');

const internals = {};

Settings.init((err, done) => {

    Hoek.assert(!err, err);

    Server.init(Composer.manifest, Composer.options, (err, server) => {

        Hoek.assert(!err, err);
        // console.log(`Hapi times at ${server.info.uri}`);
        const info = server.info.uri;
        console.log('Hapi times at ' + info);

    });
});

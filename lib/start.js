'use strict';

const Hoek = require('hoek');
const Server = require('./index');
const Composer = require('./manifest');
const Settings = require('./settings');

const internals = {};

Settings.init();

Server.init(Composer.manifest, Composer.options, (err, server) => {

    Hoek.assert(!err, err);

    // Logging started server
    console.log(`Hapi times at ${server.info.uri}`);

});

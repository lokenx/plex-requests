'use strict';

const Glue = require('glue');
const Settings = require('./settings');
const Hoek = require('hoek');

const internals = {};

exports.init = function (manifest, options, next) {

    Settings.init((err, done) => {

        Hoek.assert(!err, err);

        Glue.compose(manifest, options, (err, server) => {

            if (err) {
                return next(err, null);
            }

            server.start((err) => {

                return next(err, server);
            });
        });
    });
};

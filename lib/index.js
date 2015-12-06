'use strict';

const Glue = require('glue');

const internals = {};

exports.init = function (manifest, options, next) {

    Glue.compose(manifest, options, (err, server) => {

        if (err) {
            return next(err, null);
        }

        server.start((err) => {

            return next(err, server);
        });
    });
};

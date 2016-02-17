'use strict';

const Boom = require('boom');
const Calibrate = require('calibrate');
const Path = require('path');
const FS = require('fs');
const AuthHelper = require('../authentication/helpers');
const env = process.env.TESTING_ENV;
let Settings = (!env) ? require(Path.resolve('config/settings.json')) : require(Path.resolve('config/testing.settings.json'));

exports.get = {
    handler: (request, reply) => {

        const promise = AuthHelper.isAdmin(request.auth.credentials.username)
        .then(() => {

            return Calibrate.response(Settings);
        })
        .catch(() => {

            return Calibrate.response(Settings.searching);
        });

        return reply(promise);
    },
    auth: 'jwt'
};

exports.update = {
    handler: (request, reply) => {

        const promise = AuthHelper.isAdmin(request.auth.credentials.username)
        .then(() => {

            Settings = request.payload;
            FS.writeFileSync(Path.resolve('config/settings.json'), JSON.stringify(Settings, null, 4));

            return Calibrate.response(Settings);
        })
        .catch((err) => {

            return Calibrate.error(Boom.forbidden(err.message));
        });

        return reply(promise);
    },
    auth: 'jwt'
};

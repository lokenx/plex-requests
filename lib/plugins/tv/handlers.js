'use strict';

const Boom = require('boom');
const Calibrate = require('calibrate');
const Helpers = require('./helpers');

exports.get = {
    handler: (request, reply) => {

        const promise = Helpers.getTV()
        .then(Calibrate.response)
        .catch((err) => {

            return Calibrate.error(Boom.notFound(err.message));
        });

        return reply(promise);
    },
    auth: 'jwt'
};

exports.add = {
    handler: (request, reply) => {

        const promise = Helpers.addTV(request.payload)
        .then(Calibrate.response)
        .catch((err) => {

            return Calibrate.error(Boom.forbidden(err.message));
        });

        return reply(promise);
    },
    auth: 'jwt'
};

exports.remove = {
    handler: (request, reply) => {

        const promise = Helpers.removeTV(request.payload, request.auth.credentials.username)
        .then(Calibrate.response)
        .catch((err) => {

            return Calibrate.error(Boom.forbidden(err.message));
        });

        return reply(promise);
    },
    auth: 'jwt'
};

exports.update = {
    handler: (request, reply) => {

        const promise = Helpers.updateTV(request.payload, request.auth.credentials.username)
        .then(Calibrate.response)
        .catch((err) => {

            return Calibrate.error(Boom.forbidden(err.message));
        });

        return reply(promise);
    },
    auth: 'jwt'
};

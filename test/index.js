'use strict';

const Hapi = require('hapi');
const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Version = require('../lib/version');
const Path = require('path');

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;

describe('/index', () => {

    it('starts server and returns hapi server object', (done) => {

        App.init(internals.manifest, internals.options, (err, server) => {

            expect(err).to.not.exist();
            expect(server).to.be.instanceof(Hapi.Server);

            server.stop(done);
        });
    });

    it('starts server on provided port', (done) => {

        App.init({ connections: [{ port: 5000 }] }, {}, (err, server) => {

            expect(err).to.not.exist();
            expect(server.info.port).to.equal(5000);

            server.stop(done);
        });
    });

    it('handles register plugin errors', { parallel: false }, (done) => {

        const orig = Version.register;
        Version.register = (server, options, next) => {

            Version.register = orig;
            return next(new Error('register version failed'));
        };

        Version.register.attributes = {
            name: 'fake version'
        };

        App.init(internals.manifest, internals.options, (err, server) => {

            expect(err).to.exist();
            expect(err.message).to.equal('register version failed');

            done();
        });
    });
});

internals.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 0
        }
    ],
    plugins: {
        './version': {}
    }
};

internals.options = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Nock = require('nock');

// Declare internals

const internals = {};

// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/search', () => {

    it('returns array of movies', (done) => {

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/movie&query=the', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.results).to.be.an.array();

                server.stop(done);
            });
        });
    });

    it('searches for incorrect media type', (done) => {

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/sports&query=the', (res) => {

                expect(res.statusCode).to.equal(400);

                server.stop(done);
            });
        });
    });

    it('returns error without API key', (done) => {


        Nock('https://api.themoviedb.org')
            .filteringPath(/.*/, 'query')
            .get('query')
            .replyWithError('Something fake awful happened');


        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/movie&query=the', (res) => {

                expect(res.statusCode).to.equal(400);

                server.stop(done);
            });
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
        './plugins/search': {}
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

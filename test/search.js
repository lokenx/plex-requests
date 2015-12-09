'use strict';

const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Nock = require('nock');
const Rewire = require('rewire');

const Search = Rewire('../lib/plugins/search/search');
const Init = Search.__get__('init');

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/search', () => {

    it('returns array of movies', (done) => {

        Nock('https://api.themoviedb.org')
            .filteringPath(/.*/, 'query')
            .get('query')
            .reply(200, {
                results: [
                    { movie: 1 },
                    { movie: 2 }
                ]
            });

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/movie&query=the', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.results).to.be.an.array();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns array of tv shows', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .get('/search/series?name=the')
            .reply(200, {
                data: [
                    { tv: 1 },
                    { tv: 2 }
                ]
            });

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/tv&query=the', (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.array();

                Nock.cleanAll();
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

    it('returns error without API key for movie searches', (done) => {


        Nock('https://api.themoviedb.org')
            .filteringPath(/.*/, 'query')
            .get('query')
            .replyWithError('Something fake awful happened');


        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/movie&query=the', (res) => {

                expect(res.statusCode).to.equal(400);

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns error with tv show search', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .get('/search/series?name=the')
            .replyWithError('Something fake awful happened');

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject('/api/v1/search/tv&query=the', (res) => {

                expect(res.statusCode).to.equal(400);

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .post('/login')
            .reply(200, {
                token: 'abcd1234'
            });

        Init((err, token) => {

            expect(err).to.not.exist();
            expect(token).to.be.an.string();

            Nock.cleanAll();
            done();
        });
    });

    it('returns error getting TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .post('/login')
            .replyWithError('Something fake awful happened');

        Init((err, token) => {

            expect(err).to.exist();
            expect(token).to.not.exist();

            Nock.cleanAll();
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
        './plugins/search': {}
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

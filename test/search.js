'use strict';

const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Nock = require('nock');
const Users = require('../lib/plugins/authentication/users').module;
const TVDB = require('../lib/plugins/search/tvdb');

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;
const before = lab.before;
const after = lab.after;

describe('/search', () => {

    before((done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDE6dGVzdDE='
            }
        };

        Nock('https://plex.tv')
            .post('/users/sign_in.json')
            .reply(201, {
                user: { email: 'test1' }
            });

        Nock('https://plex.tv/')
            .filteringPath(/\/pms\/friends\/all\?X-Plex-Token=.*/, 'url')
            .get('url')
            .reply(200, {
                MediaContainer: { User: [{ $: { username: 'test1' } },{ $: { username: 'test2' } },{ $: { username: 'test3' } }]
                }
            });

        Nock('https://plex.tv/')
            .filteringPath(/\/users\/account\?X-Plex-Token=.*/, 'url')
            .get('url')
            .reply(200, {
                user: { username: 'test0' }
            });

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                internals.token = res.result.data.token;
                expect(res.statusCode).to.equal(200);

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns array of movies', (done) => {

        const options = {
            url: '/api/v1/search/movie&query=the',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

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

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.data).to.be.an.array();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns array of tv shows', (done) => {

        const options = {
            url: '/api/v1/search/tv&query=the',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

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

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.data).to.be.an.array();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('searches for incorrect media type', (done) => {

        const options = {
            url: '/api/v1/search/sports&query=the',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(400);

                server.stop(done);
            });
        });
    });

    it('returns error without API key for movie searches', (done) => {

        const options = {
            url: '/api/v1/search/movie&query=the',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

        Nock('https://api.themoviedb.org')
            .filteringPath(/.*/, 'query')
            .get('query')
            .replyWithError('Something fake awful happened');


        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(500);

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns error with tv show search', (done) => {

        const options = {
            url: '/api/v1/search/tv&query=the',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

        Nock('https://api-beta.thetvdb.com')
            .get('/search/series?name=the')
            .replyWithError('Something fake awful happened');

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(500);

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

        TVDB.getToken()
        .then((token) => {

            expect(token).to.be.a.string();

            Nock.cleanAll();
            done();
        })
        .catch((err) => {

            console.error(err);
        });
    });

    it('returns error getting TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .post('/login')
            .replyWithError('Something fake awful happened');

        TVDB.getToken()
        .catch((err) => {

            expect(err).to.exist();

            Nock.cleanAll();
            done();
        });
    });

    after((done) => {

        Users.remove({ username: 'test1' }, (err, doc) => {

            if (err) {
                throw new Error(err.message);
            }
            done();
        });
    });
});

internals.manifest = {
    server: {
        debug: false
    },
    connections: [
        {
            host: 'localhost',
            port: 0
        }
    ],
    plugins: {
        'hapi-auth-jwt2': {},
        './plugins/authentication': {},
        './plugins/search': {}
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

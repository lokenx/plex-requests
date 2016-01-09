'use strict';

const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Nock = require('nock');
const Helpers = require('../lib/plugins/authentication/helpers');

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;
const before = lab.before;
// const after = lab.after;

describe('/movies', () => {

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

    it('returns error due to no movies', (done) => {

        const options = {
            url: '/api/v1/movies?page=1',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(404);

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('adds new movies', (done) => {

        const options = {
            url: '/api/v1/movies',
            method: 'POST',
            headers: {
                Authorization: internals.token
            },
            payload: {
                'title': 'TestMovie',
                'tmdb': '01234567890',
                'imdb': 'tt01234567890',
                'released': 'Thu Nov 26 2010 21:34:39 GMT-0500 (EST)',
                'user': 'admin',
                'downloaded': false,
                'approved': true,
                'poster_path': '/'
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns array of movies', (done) => {

        const options = {
            url: '/api/v1/movies?page=1',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

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

    it('updates existing movies', (done) => {

        const options = {
            url: '/api/v1/movies',
            method: 'PUT',
            headers: {
                Authorization: internals.token
            },
            payload: {
                'imdb': 'tt01234567890',
                'update': {
                    'downloaded': false
                }
            }
        };

        Helpers.isAdmin = (username) => {

            return new Promise((resolve, reject) => {

                return resolve(true);
            });
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns error updating movie', (done) => {

        const options = {
            url: '/api/v1/movies',
            method: 'PUT',
            headers: {
                Authorization: internals.token
            },
            payload: {
                'imdb': 'tt',
                'update': {
                    'downloaded': false
                }
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(403);

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('removes a movies', (done) => {

        const options = {
            url: '/api/v1/movies',
            method: 'DELETE',
            headers: {
                Authorization: internals.token
            },
            payload: {
                'imdb': 'tt01234567890',
                'title': 'Demo Removal'
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns error removing non-existent movie', (done) => {

        const options = {
            url: '/api/v1/movies',
            method: 'DELETE',
            headers: {
                Authorization: internals.token
            },
            payload: {
                'imdb': 'tt01234567890'
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(403);

                Nock.cleanAll();
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
        'hapi-auth-jwt2': {},
        './plugins/authentication': require('../lib/config').path,
        './plugins/movies': require('../lib/config').path
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

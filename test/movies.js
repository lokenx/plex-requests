'use strict';

const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Nock = require('nock');
const Helpers = require('../lib/plugins/authentication/helpers');
const Users = require('../lib/plugins/users/db').module;

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;
const before = lab.before;

describe('/movies', () => {

    before((done) => {

        Users.insert({
            username: 'testmovies',
            password: 'password',
            email: 'user@email.com',
            role: 'admin',
            created: Date.now()
        }, (err, doc) => {

            if (err) {
                throw err;
            }
            done();
        });
    });

    it('returns error due to no movies', (done) => {

        const options = {
            url: '/api/v1/movies',
            method: 'GET',
            credentials: {
                username: 'testmovies'
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
            credentials: {
                username: 'testmovies'
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
            url: '/api/v1/movies',
            method: 'GET',
            credentials: {
                username: 'testmovies'
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
            credentials: {
                username: 'testmovies'
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
            credentials: {
                username: 'testmovies'
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
            credentials: {
                username: 'testmovies'
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
            credentials: {
                username: 'testmovies'
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
    registrations: [
        {
            plugin: {
                register: 'hapi-auth-jwt2'
            }
        },
        {
            plugin: {
                register: './plugins/authentication'
            },
            options: require('../lib/config').path
        },
        {
            plugin: {
                register: './plugins/movies'
            },
            options: require('../lib/config').path
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

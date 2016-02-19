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

describe('/tv', () => {

    before((done) => {

        Users.insert({
            username: 'testtv',
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

    it('returns error due to no tv shows', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'GET',
            credentials: {
                username: 'testtv'
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

    it('adds new tv show', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'POST',
            credentials: {
                username: 'testtv'
            },
            payload: {
                'title': 'Test TV',
                'tvdb': '01234567890',
                'released': 'Thu Nov 26 2010 21:34:39 GMT-0500 (EST)',
                'user': 'admin',
                'status': {
                    'downloaded': 0,
                    'available': 0
                },
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

    it('returns array of tv shows', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'GET',
            credentials: {
                username: 'testtv'
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

    it('updates existing tv show', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'PUT',
            credentials: {
                username: 'testtv'
            },
            payload: {
                'tvdb': '01234567890',
                'update': {
                    'status': {
                        'downloaded': 10,
                        'available': 10
                    }
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

    it('returns error updating tv show', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'PUT',
            credentials: {
                username: 'testtv'
            },
            payload: {
                'tvdb': '0',
                'update': {
                    'status': {
                        'downloaded': 10,
                        'available': 10
                    }
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

    it('removes a tv show', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'DELETE',
            credentials: {
                username: 'testtv'
            },
            payload: {
                'tvdb': '01234567890',
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

    it('returns error removing non-existent tv show', (done) => {

        const options = {
            url: '/api/v1/tv',
            method: 'DELETE',
            credentials: {
                username: 'testtv'
            },
            payload: {
                'tvdb': '01234567890'
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
                register: './plugins/tv'
            },
            options: require('../lib/config').path
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

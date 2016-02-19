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

describe('/issues', () => {

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
    it('returns error due to no issues', (done) => {

        const options = {
            url: '/api/v1/issues',
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

    it('adds new issue', (done) => {

        const options = {
            url: '/api/v1/issues',
            method: 'POST',
            headers: {
                Authorization: internals.token
            },
            payload: {
                'title': 'Sample Issue Title',
                'message': 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'user': 'plexuser',
                'season': 1,
                'episode': 2,
                'created': '2016-01-07T01:06:03.860Z',
                'number': 23,
                'related': 'tt123',
                'resolved': false
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result).to.be.an.object();

                internals.id = res.result.data._id;

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns array of issues', (done) => {

        const options = {
            url: '/api/v1/issues',
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

    it('updates existing issue', (done) => {

        const options = {
            url: '/api/v1/issues',
            method: 'PUT',
            headers: {
                Authorization: internals.token
            },
            payload: {
                '_id': internals.id,
                'update': {
                    'resolved': true
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

    it('returns error updating issue', (done) => {

        const options = {
            url: '/api/v1/issues',
            method: 'PUT',
            headers: {
                Authorization: internals.token
            },
            payload: {
                '_id': '0',
                'update': {
                    'resolved': true
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

    it('removes an issue', (done) => {

        const options = {
            url: '/api/v1/issues',
            method: 'DELETE',
            headers: {
                Authorization: internals.token
            },
            payload: {
                '_id': internals.id,
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

    it('returns error removing non-existent issue', (done) => {

        const options = {
            url: '/api/v1/issues',
            method: 'DELETE',
            headers: {
                Authorization: internals.token
            },
            payload: {
                '_id': internals.id
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
                register: './plugins/issues'
            },
            options: require('../lib/config').path
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

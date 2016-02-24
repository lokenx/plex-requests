'use strict';

const Code = require('code');
const Lab = require('lab');
const Path = require('path');
const Users = require('../lib/plugins/users/db').module;
const Nock = require('nock');
const App = require('../lib');

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;
const before = lab.before;
const after = lab.after;

describe('/authentication', () => {

    before((done) => {

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();
            internals.server = server;
            done();
        });
    });

    it('successfully login and create user with new Plex account', (done) => {

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

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);

            Nock.cleanAll();
            done();
        });
    });

    it('successfully logins to an existing account', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDE6dGVzdDE='
            }
        };

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);
            internals.token = res.result.data.token;

            done();
        });
    });

    it('successfully refresh user token', (done) => {

        const options = {
            url: '/api/v1/refresh-token',
            method: 'GET',
            headers: {
                Authorization: internals.token
            }
        };

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(200);

            done();
        });
    });

    it('handles login failure due to incorrect password', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDE6dGVzdDI='
            }
        };

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Users.remove({ username: 'test1' }, (err, doc) => {

                if (err) {
                    throw new Error(err.message);
                }
                done();
            });
        });
    });

    it('handles login failure against Plex', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDU6dGVzdDU='
            }
        };

        Nock('https://plex.tv')
            .post('/users/sign_in.json')
            .replyWithError('Something fake awful happened');

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    it('handles login failure against Plex', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDU6dGVzdDU='
            }
        };

        Nock('https://plex.tv')
            .post('/users/sign_in.json')
            .reply(400, {
                error: 'Something fake awful happened'
            });

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    it('handles error retrieving friends list', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDM6dGVzdDM='
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
            .replyWithError('Something fake awful happened');

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    it('handles error retrieving friends list', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDM6dGVzdDM='
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
            .reply(400, {
                errors:  { error: 'Something fake awful happened' }
            });

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    it('handles error retrieving admin user', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDM6dGVzdDM='
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
            .reply(400, {
                errors:  { error: 'Something fake awful happened' }
            });

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    it('handles error retrieving admin user', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDM6dGVzdDM='
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
            .replyWithError('Something fake awful happened');

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    it('handles login failure without authorization', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST'
        };

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(400);

            Nock.cleanAll();
            done();
        });
    });

    it('handles login failure with incorrect formatting', (done) => {

        const options = {
            url: '/api/v1/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic dGVzdDI6'
            }
        };

        internals.server.inject(options, (res) => {

            expect(res.statusCode).to.equal(401);

            Nock.cleanAll();
            done();
        });
    });

    after((done) => {

        internals.server.stop(done);
    });
});

internals.manifest = {
    connections: [
        {
            host: 'localhost',
            port: 0,
            labels: ['api']
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
            options: require('../lib/config').api
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

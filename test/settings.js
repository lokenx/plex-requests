'use strict';

const Code = require('code');
const Lab = require('lab');
const App = require('../lib');
const Path = require('path');
const Nock = require('nock');
const Users = require('../lib/plugins/users/db').module;

const internals = {};

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;
const before = lab.before;

describe('/settings', () => {

    before((done) => {

        Users.insert([{
            username: 'test1',
            password: 'password',
            email: 'user@email.com',
            role: 'admin',
            created: Date.now()
        },{
            username: 'test2',
            password: 'password',
            email: 'user@email.com',
            role: 'user',
            created: Date.now()
        }], (err, doc) => {

            if (err) {
                throw err;
            }
            done();
        });
    });

    it('returns settings', (done) => {

        const options = {
            url: '/api/v1/settings',
            method: 'GET',
            credentials: {
                username: 'test1',
                password: 'password'
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.data).to.be.an.object();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('returns app settings', (done) => {

        const options = {
            url: '/api/v1/settings',
            method: 'GET',
            credentials: {
                username: 'test2',
                password: 'password'
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.data).to.be.an.object();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('updates settings', (done) => {

        const options = {
            url: '/api/v1/settings',
            method: 'PUT',
            credentials: {
                username: 'test1',
                password: 'password'
            },
            payload:  {
                authentication: {
                    'enabled': true,
                    'passwordrequired': false,
                    'plextoken': 'abcd123',
                    'blockedusers': []
                }
            }
        };

        App.init(internals.manifest, internals.composeOptions, (err, server) => {

            expect(err).to.not.exist();

            server.inject(options, (res) => {

                expect(res.statusCode).to.equal(200);
                expect(res.result.data.authentication.enabled).to.true();

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
            plugin: './plugins/authentication',
            options: require('../lib/config').api
        },
        {
            plugin: './plugins/settings',
            options: require('../lib/config').api
        }
    ]
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

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

describe('/users', () => {

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

    it('returns array of users', (done) => {

        const options = {
            url: '/api/v1/users',
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
                expect(res.result.data).to.be.an.array();

                Nock.cleanAll();
                server.stop(done);
            });
        });
    });

    it('updates existing user as admin', (done) => {

        const options = {
            url: '/api/v1/users',
            method: 'PUT',
            credentials: {
                username: 'test1',
                password: 'password'
            },
            payload: {
                'username': 'test1',
                'update': {
                    'email': 'updated@email.com'
                }
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

    it('updates existing user as user', (done) => {

        const options = {
            url: '/api/v1/users',
            method: 'PUT',
            credentials: {
                username: 'test2',
                password: 'password'
            },
            payload: {
                'username': 'test2',
                'update': {
                    'email': 'updated@email.com'
                }
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

    it('returns error updating user', (done) => {

        const options = {
            url: '/api/v1/users',
            method: 'PUT',
            credentials: {
                username: 'test2',
                password: 'password'
            },
            payload: {
                'username': 'admin',
                'update': {
                    'email': 'false@example.com'
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

    it('removes a user', (done) => {

        const options = {
            url: '/api/v1/users',
            method: 'DELETE',
            credentials: {
                username: 'test1',
                password: 'password'
            },
            payload: {
                'username': 'test2'
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

    it('returns error removing non-existent user', (done) => {

        const options = {
            url: '/api/v1/users',
            method: 'DELETE',
            credentials: {
                username: 'test1',
                password: 'password'
            },
            payload: {
                'username': 'test3'
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
        './plugins/users': require('../lib/config').path
    }
};

internals.composeOptions = {
    relativeTo: Path.resolve(__dirname, '../lib')
};

// Testing is messed up due to having to create accounts on fly and overriding of authentication methods to test other things

// 'use strict';
//
// const Code = require('code');
// const Lab = require('lab');
// const App = require('../lib');
// const Path = require('path');
// const Nock = require('nock');
// // const Helpers = require('../lib/plugins/authentication/helpers');
//
// const internals = {};
//
// const lab = exports.lab = Lab.script();
// const describe = lab.experiment;
// const expect = Code.expect;
// const it = lab.test;
// const before = lab.before;
//
// describe('/users', () => {
//
//     before((done) => {
//
//         const options = {
//             url: '/api/v1/login',
//             method: 'POST',
//             headers: {
//                 Authorization: 'Basic dGVzdDE6dGVzdDE='
//             }
//         };
//
//         Nock('https://plex.tv')
//             .post('/users/sign_in.json')
//             .reply(201, {
//                 user: { email: 'test1' }
//             });
//
//         Nock('https://plex.tv/')
//             .filteringPath(/\/pms\/friends\/all\?X-Plex-Token=.*/, 'url')
//             .get('url')
//             .reply(200, {
//                 MediaContainer: { User: [{ $: { username: 'test1' } },{ $: { username: 'test2' } },{ $: { username: 'test3' } }]
//                 }
//             });
//
//         Nock('https://plex.tv/')
//             .filteringPath(/\/users\/account\?X-Plex-Token=.*/, 'url')
//             .get('url')
//             .reply(200, {
//                 user: { username: 'test0' }
//             });
//
//         App.init(internals.manifest, internals.composeOptions, (err, server) => {
//
//             expect(err).to.not.exist();
//
//             server.inject(options, (res) => {
//
//                 internals.token = res.result.data.token;
//                 expect(res.statusCode).to.equal(200);
//
//                 Nock.cleanAll();
//                 server.stop(done);
//             });
//         });
//     });
//
//     // Default user is still currently made, but looking to remove this and rely on the Plex token for admin account
//
//     // it('returns error due to no users', (done) => {
//     //
//     //     const options = {
//     //         url: '/api/v1/users',
//     //         method: 'GET',
//     //         headers: {
//     //             Authorization: internals.token
//     //         }
//     //     };
//     //
//     //     App.init(internals.manifest, internals.composeOptions, (err, server) => {
//     //
//     //         expect(err).to.not.exist();
//     //
//     //         server.inject(options, (res) => {
//     //
//     //             expect(res.statusCode).to.equal(404);
//     //
//     //             Nock.cleanAll();
//     //             server.stop(done);
//     //         });
//     //     });
//     // });
//
//     it('returns array of users', (done) => {
//
//         const options = {
//             url: '/api/v1/users',
//             method: 'GET',
//             headers: {
//                 Authorization: internals.token
//             }
//         };
//
//         App.init(internals.manifest, internals.composeOptions, (err, server) => {
//
//             expect(err).to.not.exist();
//
//             server.inject(options, (res) => {
//
//                 expect(res.statusCode).to.equal(200);
//                 expect(res.result.data).to.be.an.array();
//
//                 Nock.cleanAll();
//                 server.stop(done);
//             });
//         });
//     });
//
//     it('updates existing user', (done) => {
//
//         const options = {
//             url: '/api/v1/users',
//             method: 'PUT',
//             headers: {
//                 Authorization: internals.token
//             },
//             payload: {
//                 'username': 'test1',
//                 'update': {
//                     'email': 'updated@email.com'
//                 }
//             }
//         };
//
//         // Helpers.isAdmin = (username) => {
//         //
//         //     return new Promise((resolve, reject) => {
//         //
//         //         return resolve(true);
//         //     });
//         // };
//
//         App.init(internals.manifest, internals.composeOptions, (err, server) => {
//
//             expect(err).to.not.exist();
//
//             server.inject(options, (res) => {
//
//                 expect(res.statusCode).to.equal(200);
//                 expect(res.result).to.be.an.object();
//
//                 Nock.cleanAll();
//                 server.stop(done);
//             });
//         });
//     });
//
//     it('returns error updating user', (done) => {
//
//         const options = {
//             url: '/api/v1/users',
//             method: 'PUT',
//             headers: {
//                 Authorization: internals.token
//             },
//             payload: {
//                 'username': 'admin',
//                 'update': {
//                     'email': 'false@example.com'
//                 }
//             }
//         };
//
//         App.init(internals.manifest, internals.composeOptions, (err, server) => {
//
//             expect(err).to.not.exist();
//
//             server.inject(options, (res) => {
//
//                 expect(res.statusCode).to.equal(403);
//
//                 Nock.cleanAll();
//                 server.stop(done);
//             });
//         });
//     });
//
//
//     // TODO Look into creating test databases as it may simplify testing
//
//
//     // it('removes a user', (done) => {
//     //
//     //     const options = {
//     //         url: '/api/v1/movies',
//     //         method: 'DELETE',
//     //         headers: {
//     //             Authorization: internals.token
//     //         },
//     //         payload: {
//     //             'username': 'test2'
//     //         }
//     //     };
//     //
//     //     Helpers.isAdmin = (username) => {
//     //
//     //         return new Promise((resolve, reject) => {
//     //
//     //             return resolve(true);
//     //         });
//     //     };
//     //
//     //     App.init(internals.manifest, internals.composeOptions, (err, server) => {
//     //
//     //         expect(err).to.not.exist();
//     //
//     //         server.inject(options, (res) => {
//     //
//     //             expect(res.statusCode).to.equal(200);
//     //             expect(res.result).to.be.an.object();
//     //
//     //             Nock.cleanAll();
//     //             server.stop(done);
//     //         });
//     //     });
//     // });
//     //
//     // it('returns error removing non-existent user', (done) => {
//     //
//     //     const options = {
//     //         url: '/api/v1/movies',
//     //         method: 'DELETE',
//     //         headers: {
//     //             Authorization: internals.token
//     //         },
//     //         payload: {
//     //             'imdb': 'tt01234567890'
//     //         }
//     //     };
//     //
//     //     App.init(internals.manifest, internals.composeOptions, (err, server) => {
//     //
//     //         expect(err).to.not.exist();
//     //
//     //         server.inject(options, (res) => {
//     //
//     //             expect(res.statusCode).to.equal(403);
//     //
//     //             Nock.cleanAll();
//     //             server.stop(done);
//     //         });
//     //     });
//     // });
//
// });
//
// internals.manifest = {
//     connections: [
//         {
//             host: 'localhost',
//             port: 0
//         }
//     ],
//     plugins: {
//         'hapi-auth-jwt2': {},
//         './plugins/authentication': require('../lib/config').path,
//         './plugins/users': require('../lib/config').path
//     }
// };
//
// internals.composeOptions = {
//     relativeTo: Path.resolve(__dirname, '../lib')
// };

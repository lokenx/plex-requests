'use strict';

const Code = require('code');
const Lab = require('lab');
const Nock = require('nock');
const Rewire = require('rewire');
const Settings = require('../config/settings.json');

const internals = {};
const Plex = Rewire('../lib/plugins/authentication/plexauthentication.js');
const PlexGetFriends = Plex.__get__('getFriends');
const PlexGetAdmin = Plex.__get__('getAdmin');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/plexauthentication', () => {

    it('handles response error when getting friends', (done) => {

        Nock('https://plex.tv')
            .filteringPath(/.*/, 'query')
            .get('query')
            .reply(401, {
                errors: { error: 'Something fake awful happened' }
            });

        PlexGetFriends((err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            Nock.cleanAll();
            done();
        });
    });

    it('handles error when getting admin user', (done) => {

        Nock('https://plex.tv')
            .filteringPath(/.*/, 'query')
            .get('query')
            .replyWithError('Something fake awful happened');

        PlexGetAdmin((err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            Nock.cleanAll();
            done();
        });
    });

    it('handles response error when getting admin user', (done) => {

        Nock('https://plex.tv')
            .filteringPath(/.*/, 'query')
            .post('query')
            .reply(401, {
                errors: { error: 'Something fake awful happened' }
            });

        Plex.checkPlexLogin('auth', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            Nock.cleanAll();
            done();
        });
    });

    it('handles friends list response error for verifying plex user', (done) => {

        Nock('https://plex.tv/')
            .get('/pms/friends/all?X-Plex-Token=' + Settings.authentication.plextoken)
            .reply(401, {
                errors: { error: 'Something fake awful happened' }
            });

        Nock('https://plex.tv/')
            .get('/users/account?X-Plex-Token=' + Settings.authentication.plextoken)
            .reply(200, {
                user: { username: 'test1' }
            });

        Plex.verifyPlexUser('test1', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            Nock.cleanAll();
            done();
        });
    });

    it('handles admin user response error for verifying plex user', (done) => {

        Nock('https://plex.tv/')
            .get('/pms/friends/all?X-Plex-Token=' + Settings.authentication.plextoken)
            .reply(200, {
                MediaContainer: { User: [{ $: { username: 'test1' } },{ $: { username: 'test2' } },{ $: { username: 'test3' } }]
                }
            });

        Nock('https://plex.tv/')
            .get('/users/account?X-Plex-Token=' + Settings.authentication.plextoken)
            .reply(401, {
                errors: { error: 'Something fake awful happened' }
            });

        Plex.verifyPlexUser('test2', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            Nock.cleanAll();
            done();
        });
    });

    it('denies a blocked plex user', (done) => {

        Nock('https://plex.tv/')
            .get('/pms/friends/all?X-Plex-Token=' + Settings.authentication.plextoken)
            .reply(200, {
                MediaContainer: { User: [{ $: { username: 'test2' } },{ $: { username: 'test3' } },{ $: { username: 'test4' } }]
                }
            });

        Nock('https://plex.tv/')
            .get('/users/account?X-Plex-Token=' + Settings.authentication.plextoken)
            .reply(200, {
                user: { username: 'test1' }
            });

        const oldBlockedUsers = Settings.authentication.blockedusers;
        Settings.authentication.blockedusers = ['test4'];

        Plex.verifyPlexUser('test4', (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.false();
            Nock.cleanAll();
            Settings.authentication.blockedusers = oldBlockedUsers;
            done();
        });
    });
});

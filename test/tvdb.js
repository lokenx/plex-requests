'use strict';

const Code = require('code');
const Lab = require('lab');
const Nock = require('nock');

const TVDB = require('../lib/plugins/search/tvdb');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;

describe('/tvdb', () => {

    it('returns error getting TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .post('/login')
            .replyWithError('Fake error returned');

        TVDB.getToken((err, token) => {

            expect(err).to.exist();
            expect(token).to.not.exist();

            Nock.cleanAll();
            done();
        });
    });

    it('returns reponse error getting TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .post('/login')
            .reply(400, {
                Error: 'Fake error returned'
            });

        TVDB.getToken((err, token) => {

            expect(err).to.exist();
            expect(token).to.not.exist();

            Nock.cleanAll();
            done();
        });
    });

    it('refreshes TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .get('/refresh_token')
            .reply(200, {
                token: 'abcd1234'
            });

        TVDB.refreshToken((err, token) => {

            expect(err).to.not.exist();
            expect(token).to.be.an.string();

            Nock.cleanAll();
            done();
        });
    });

    it('returns error when refreshing TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .get('/refresh_token')
            .replyWithError('Fake error returned');

        TVDB.refreshToken((err, token) => {

            expect(err).to.exist();
            expect(token).to.not.exist();

            Nock.cleanAll();
            done();
        });
    });

    it('returns reponse rror when refreshing TVDB token', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .get('/refresh_token')
            .reply(400, {
                Error: 'Fake error returned'
            });

        TVDB.refreshToken((err, token) => {

            expect(err).to.exist();
            expect(token).to.not.exist();

            Nock.cleanAll();
            done();
        });
    });

    it('returns reponse rror when searching TVDB', (done) => {

        Nock('https://api-beta.thetvdb.com')
            .get('/search/series?name=the')
            .reply(400, {
                Error: 'Fake error returned'
            });

        TVDB.search('the', 'toke', (err, token) => {

            expect(err).to.exist();
            expect(token).to.not.exist();

            Nock.cleanAll();
            done();
        });
    });
});

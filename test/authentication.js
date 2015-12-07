'use strict';

const Code = require('code');
const Lab = require('lab');
const Rewire = require('rewire');
const Authentication = Rewire('../lib/plugins/authentication');
const Users = require('../lib/plugins/authentication/users').module;

const internals = {};
const validate = Authentication.__get__('validate');
const generatetoken = Authentication.__get__('generatetoken');
// const checkPassword = Authentication.__get__('checkPassword');
const Bcrypt = Authentication.__get__('Bcrypt');
const UsersInternal = Authentication.__get__('Users');

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
const expect = Code.expect;
const it = lab.test;
const after = lab.after;

describe('/authentication', () => {

    it('successfully generates token and user account', (done) => {

        generatetoken('testadminuser', 'testadminuser', 'test@admin.com', (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.a.string();
            done();
        });
    });

    it('successfully login to created user account', (done) => {

        Authentication.login('testadminuser:testadminuser', (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.a.string();
            done();
        });
    });

    it('handles logging in with wrong password', (done) => {

        Authentication.login('testadminuser:testadminuser2', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    after((done) => {

        Users.remove({ username: 'testadminuser' }, (err, doc) => {

            if (err) {
                throw new Error(err.message);
            }
            done();
        });
    });

    it('handles login with incorrect credential formatting', (done) => {

        Authentication.login('testadminuser.testadminuser', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('successfully generates token without user account', (done) => {

        generatetoken('testadminuser', 'testadminuser', false, (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.a.string();
            done();
        });
    });

    it('validates valid user', (done) => {

        validate({ username: 'testadminuser', password: 'testadminuser' }, null, (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.true();
            done();
        });
    });

    it('handles non-existant user error', (done) => {

        validate({ username: 'testadminuser2', password: 'testadminuser' }, null, (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.false();
            done();
        });
    });

    it('handles wrong password error', (done) => {

        validate({ username: 'testadminuser', password: 'testadminuser2' }, null, (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.be.false();
            done();
        });
    });

    it('handles Bcrypt compare error', (done) => {

        Bcrypt.compare = (decoded, password, callback) => {

            return callback(new Error('Fake error returned'), null);
        };

        validate({ username: 'testadminuser', password: 'testadminuser' }, null, (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('handles database search error', (done) => {

        UsersInternal.findOne = (document, callback) => {

            return callback(new Error('Fake error returned'), null);
        };

        validate({ username: 'testadminuser', password: 'testadminuser' }, null, (err, res) => {

            expect(err).to.not.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('handles database insert error', (done) => {

        UsersInternal.insert = (document, callback) => {

            return callback(new Error('Fake error returned'), null);
        };

        generatetoken('testadminuser', 'testadminuser', 'test@admin.user', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    after((done) => {

        Users.remove({ username: 'testadminuser' }, (err, doc) => {

            if (err) {
                throw new Error(err.message);
            }
            done();
        });
    });

    it('handles Bcrypt hash error', (done) => {

        Bcrypt.hash = (password, salt, callback) => {

            return callback(new Error('Fake error returned'), null);
        };

        generatetoken('testadminuser', 'testadminuser', false, (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('handles Bcrypt salt error', (done) => {

        Bcrypt.genSalt = (salt, callback) => {

            return callback(new Error('Fake error returned'), null);
        };

        generatetoken('testadminuser', 'testadminuser', false, (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('handles login database search error', (done) => {

        Authentication.login('testadminuser:testadminuser', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('handles login check password error', (done) => {

        UsersInternal.findOne = (document, callback) => {

            return callback(null, { password: 'testadminuser' });
        };
        Authentication.login('testadminuser:testadminuser', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });

    it('handles login generate token error', (done) => {

        Bcrypt.compare = (decoded, password, callback) => {

            return callback(null, true);
        };

        Authentication.login('testadminuser:testadminuser', (err, res) => {

            expect(err).to.exist();
            expect(res).to.not.exist();
            done();
        });
    });
});

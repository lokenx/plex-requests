'use strict';

const Path = require('path');
const Needle = require('needle');
const Settings = require(Path.resolve('config/settings.json'));
const Token = Settings.authentication.plextoken;

const getFriends = (callback) => {

    Needle.get('https://plex.tv/pms/friends/all?X-Plex-Token=' + Token, (err, response) => {

        if (!err && response.statusCode === 200) {
            const friendsList = [];

            response.body.MediaContainer.User.forEach((user) => {

                friendsList.push(user.$.username);
            });

            return callback(null, friendsList);
        }
        const message = (err) ? err.message : response.body.errors.error;
        return callback(new Error(message), null);
    });
};

const getAdmin = (callback) => {

    Needle.get('https://plex.tv/users/account?X-Plex-Token=' + Token, (err, response) => {

        if (!err && response.statusCode === 200) {
            return callback(null, response.body.user.username);
        }
        const message = (err) ? err.message : response.body.errors.error;
        return callback(new Error(message), null);
    });

};
exports.checkPlexLogin = (auth, callback) => {

    const authString = new Buffer(auth).toString('base64');
    const options = {
        timeout: 1500,
        headers: {
            'Authorization': 'Basic ' + authString,
            'X-Plex-Client-Identifier': 'AXSHCOX3LHGYE62ZQ4DF',
            'X-Plex-Version': '0.1.0',
            'X-Plex-Platform': 'NodeJS',
            'X-Plex-Device-Name': 'Plex Requests'
        }
    };

    Needle.post('https://plex.tv/users/sign_in.json', null, options, (err, response) => {

        if (!err && response.statusCode === 201) {
            return callback(null, response.body.user.email);
        }
        const message = (err) ? err.message : response.body.error;
        return callback(new Error(message), null);
    });
};

exports.verifyPlexUser = (user, callback) => {

    getFriends((err, friends) => {

        if (err) {
            return callback(err, null);
        }

        getAdmin((err, admin) => {

            if (err) {
                return callback(err, null);
            }

            const allowedUsers = friends.filter((username) => {

                return Settings.authentication.blockedusers.indexOf(username) === -1;
            });

            allowedUsers.push(admin);

            return callback(null, (allowedUsers.indexOf(user) !== -1) ? true : false);
        });
    });
};

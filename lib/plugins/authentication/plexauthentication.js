'use strict';

const Path = require('path');
const Needle = require('needle');
const Settings = require(Path.resolve('config/settings.json'));
const Token = Settings.authentication.plextoken;

const internals = {};

const getFriends = () => {

    return new Promise((resolve, reject) => {

        Needle
        .get('https://plex.tv/pms/friends/all?X-Plex-Token=' + Token)
        .on('data', (response) => {

            if (response.errors) {
                return reject(new Error(response.errors.error));
            }

            const friendsList = [];

            response.MediaContainer.User.forEach((user) => {

                friendsList.push(user.$.username);
            });

            return resolve(friendsList);
        })
        .on('end', (err) => {

            return reject(err);
        });
    });
};

const getAdmin = () => {

    return new Promise((resolve, reject) => {

        Needle
        .get('https://plex.tv/users/account?X-Plex-Token=' + Token)
        .on('data', (response) => {

            if (response.errors) {
                return reject(new Error(response.errors.error));
            }

            return resolve(response.user.username);
        })
        .on('end', (err) => {

            return reject(err);
        });
    });
};

exports.checkPlexLogin = (auth) => {

    return new Promise((resolve, reject) => {

        const authString = new Buffer(auth).toString('base64');
        const options = {
            timeout: 2000,
            headers: {
                'Authorization': 'Basic ' + authString,
                'X-Plex-Client-Identifier': 'AXSHCOX3LHGYE62ZQ4DF',
                'X-Plex-Version': '0.1.0',
                'X-Plex-Platform': 'NodeJS',
                'X-Plex-Device-Name': 'Plex Requests'
            }
        };

        Needle
        .post('https://plex.tv/users/sign_in.json', null, options)
        .on('data', (response) => {

            if (response.error) {
                return reject(new Error(response.error));
            }

            return resolve(response.user.email);
        })
        .on('end', (err) => {

            return reject(err);
        });
    });
};

exports.verifyPlexUser = (user) => {

    return new Promise((resolve, reject) => {

        getFriends()
        .then((friends) => {

            internals.friends = friends;
            return getAdmin();
        })
        .then((admin) => {

            const allowedUsers = internals.friends.filter((username) => {

                return Settings.authentication.blockedusers.indexOf(username) === -1;
            });

            allowedUsers.push(admin);

            if (allowedUsers.indexOf(user) !== -1) {
                return resolve(true);
            }
            return reject('User not blocked');
        })
        .catch((err) => {

            return reject(err);
        });
    });

};

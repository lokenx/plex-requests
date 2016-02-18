'use strict';

const Users = require('./db').module;
const AuthHelper = require('../authentication/helpers');

exports.getUsers = () => {

    return new Promise((resolve, reject) => {

        Users.find({}, (err, result) => {

            if (result.length !== 0) {
                return resolve(result);
            }

            const message = (err) ? err.message : 'No users found!';
            return reject(new Error(message));
        });
    });
};

exports.removeUser = (user, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        .then((admin) => {

            Users.remove({ username: user }, (err, doc) => {

                if (doc) {
                    return resolve(`Removed the user ${user}!`);
                }

                const message = (err) ? err.message : 'User not found to remove!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

exports.updateUser = (user, update, username) => {

    return new Promise((resolve, reject) => {

        const updatedb = (name, changes, callback) => {

            Users.update({ username: name }, { $set: changes }, (err, doc) => {

                if (doc) {
                    return callback(null, doc);
                }

                const message = (err) ? err.message : 'User not found to update!';
                return callback(new Error(message), null);
            });
        };

        if (user === username) {

            updatedb(user, update, (err, res) => {

                if (err) {
                    return reject(err);
                }

                return resolve(res);
            });
        }
        else {
            AuthHelper.isAdmin(username)
            .then(() => {

                updatedb(user, update, (err, res) => {

                    if (err) {
                        return reject(err);
                    }

                    return resolve(res);
                });
            })
            .catch((err) => {

                return reject(err);
            });
        }
    });
};

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

            Users.remove({ username: user.username }, (err, doc) => {

                if (doc) {
                    return resolve(`Removed the user ${user.username}!`);
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

exports.updateUser = (user, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        // .catch((err) => {
        //
        //     if (user.username === username) {
        //         return true;
        //     }
        //
        //     return err;
        // })
        .then((admin) => {

            Users.update({ username: user.username }, { $set: user.update }, (err, doc) => {

                if (doc) {
                    return resolve(user);
                }

                const message = (err) ? err.message : 'User not found to update!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

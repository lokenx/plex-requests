'use strict';

const TV = require('./db').module;
const AuthHelper = require('../authentication/helpers');

exports.getTV = () => {

    return new Promise((resolve, reject) => {

        TV.find({}, (err, result) => {

            if (result.length !== 0) {
                return resolve(result);
            }

            const message = (err) ? err.message : 'No tv shows found!';
            return reject(new Error(message));
        });
    });
};

exports.addTV = (tv) => {

    return new Promise((resolve, reject) => {

        TV.insert(tv, (err, doc) => {

            if (doc) {
                return resolve(doc);
            }

            const message = (err) ? err.message : 'Error adding tv show!';
            return reject(new Error(message));
        });
    });
};

exports.removeTV = (tv, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        .then((admin) => {

            TV.remove({ tvdb: tv.tvdb }, (err, doc) => {

                if (doc) {
                    return resolve(`Removed the movie ${tv.title}!`);
                }

                const message = (err) ? err.message : 'TV show not found to remove!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

exports.updateTV = (tv, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        .then((admin) => {

            TV.update({ tvdb: tv.tvdb }, { $set: tv.update }, (err, doc) => {

                if (doc) {
                    return resolve(tv);
                }

                const message = (err) ? err.message : 'TV show not found to update!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

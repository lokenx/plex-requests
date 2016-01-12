'use strict';

const Issues = require('./db').module;
const AuthHelper = require('../authentication/helpers');

exports.getIssues = () => {

    return new Promise((resolve, reject) => {

        Issues.find({}, (err, result) => {

            if (result.length !== 0) {
                return resolve(result);
            }

            const message = (err) ? err.message : 'No issues found!';
            return reject(new Error(message));
        });
    });
};

exports.addIssues = (issues) => {

    return new Promise((resolve, reject) => {

        Issues.insert(issues, (err, doc) => {

            if (doc) {
                return resolve(doc);
            }

            const message = (err) ? err.message : 'Error adding issue!';
            return reject(new Error(message));
        });
    });
};

exports.removeIssues = (issues, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        .then((admin) => {

            Issues.remove({ _id: issues._id }, (err, doc) => {

                if (doc) {
                    return resolve(`Removed the movie ${issues.title}!`);
                }

                const message = (err) ? err.message : 'Issue not found to remove!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

exports.updateIssues = (issues, username) => {

    return new Promise((resolve, reject) => {

        AuthHelper.isAdmin(username)
        .then((admin) => {

            Issues.update({ _id: issues._id }, { $set: issues.update }, (err, doc) => {

                if (doc) {
                    return resolve(issues);
                }

                const message = (err) ? err.message : 'Issue not found to update!';
                return reject(new Error(message));
            });
        })
        .catch((err) => {

            return reject(err);
        });


    });
};

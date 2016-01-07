'use strict';

const Needle = require('needle');
const APIKey = '0182004B5448F5CD';

const internals = {
    token: ''
};

exports.getToken = () => {

    return new Promise((resolve, reject) => {

        const data = { apikey: APIKey };

        Needle
        .post('https://api-beta.thetvdb.com/login', data, { json: true })
        .on('data', (response) => {

            if (response.errors) {
                return reject(new Error(response.errors.error));
            }

            return resolve(response.token);
        })
        .on('end', (err) => {

            return reject(err);
        });
    });
};

exports.refreshToken = (callback) => {

    return new Promise((resolve, reject) => {

        const options = { headers: { Authorization: 'Bearer ' + internals.token } };

        Needle
        .get('https://api-beta.thetvdb.com/refresh_token', options)
        .on('data', (response) => {

            if (response.errors) {
                return reject(new Error(response.errors.error));
            }

            return resolve(response.token);
        })
        .on('end', (err) => {

            return reject(err);
        });
    });
};

exports.search = (query, token, callback) => {

    const options = {
        headers: {
            Authorization: 'Bearer ' + token,
            name: query
        }
    };

    Needle.get('https://api-beta.thetvdb.com/search/series?name=' + query, options, (err, response) => {

        if (!err && response.statusCode === 200) {
            return callback(null, response.body.data);
        }

        const message = (err) ? err.message : response.body.Error;
        return callback(new Error(message), null);
    });
};

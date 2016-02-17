'use strict';

const FS = require('fs-extra');
const Path = require('path');
const env = process.env.TESTING_ENV;

exports.init = (callback) => {

    if (!env) {
        FS.readFile(Path.resolve('config/settings.json'), (err, file) => {

            if (err) {
                FS.copy('config/default.settings.json', 'config/settings.json', (err) => {

                    if (err) {
                        return callback(err, null);
                    }
                    return callback(null, 'Settings file created!');
                });
            }
            else {
                return callback(null, true);
            }
        });
    }
    else {
        FS.copy('config/default.settings.json', 'config/testing.settings.json', (err) => {

            if (err) {
                return callback(err, null);
            }
            return callback(null, 'Settings file created!');
        });
    }
};

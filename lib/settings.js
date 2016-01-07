'use strict';

const FS = require('fs-extra');
const Path = require('path');

exports.init = (callback) => {

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
};

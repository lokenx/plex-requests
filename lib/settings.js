'use strict';

const fs = require('fs-extra');
const Path = require('path');

exports.init = (callback) => {

    fs.readFile(Path.resolve('config/settings.json'), (err, file) => {

        if (err) {
            fs.copy('config/default.settings.json', 'config/settings.json', (err) => {

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

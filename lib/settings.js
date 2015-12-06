'use strict';

const fs = require('fs');
const Path = require('path');

const settings = {
    authentication : {
        enabled: false,
        passwordrequire: false,
        plextoken: 'abcd123',
        blockedusers: []
    },
    searching: {
        movies: true,
        tv: true
    },
    requests: {
        movielimit: 0,
        tvlimit: 0
    },
    couchpotato: {
        url: '192.168.0.1',
        port: 5050,
        ssl: false,
        api: 'abcd123',
        directory: '',
        enabled: false
    },
    sickrage: {
        url: '192.168.0.1',
        port: 8081,
        ssl: false,
        api: 'abcd123',
        directory: '',
        enabled: false
    },
    sonarr: {
        url: '192.168.0.1',
        port: 8989,
        ssl: false,
        api: 'abcd123',
        directory: '',
        qualityprofileid: 1,
        rootfolderpath: '/path/to/root/tv/folder',
        seasonfolders: true,
        enabled: false
    },
    pushbullet: {
        token: 'abcd123',
        enabled: false
    },
    pushover: {
        token: 'abcd123',
        user: 'user',
        enabled: false
    }
};

exports.init = () => {
    // Check if settings file exists, if not create new one
    try {
        fs.readFileSync(Path.resolve('config/settings.json'));
    }
    catch (err) {
        fs.writeFileSync(Path.resolve('config/settings.json'), JSON.stringify(settings, null, 2));
        console.log('Created default settings file!');
    }

};

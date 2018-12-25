#!/usr/bin/env node

const fs = require('fs'),
    log = require('./logger'),
    bot = require('./bot'),
    configs = require('./config.json'),
    configStruct = require('./config.struct.json');

if (fs.existsSync('./config.json')) {
    configs.accounts.forEach(config => {
        if (!compareKeys(config, configStruct)) {
            log('Config file struct is invalid, please check config.struct.json');
            process.exit(1)
        }

        if (config.username === '' || config.password === '') {
            log('No provided username and password for account');
            process.exit(1)
        }
        bot.init(config)
    });
} else {
    log('Config file not present, please create one or copy it from config.example.json file');
    process.exit(0)
}


function compareKeys(a, b) {
    let aKeys = Object.keys(a).sort(),
        bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

process.on('SIGINT', function () {
    log('Shutting down');
    process.exit(0);
});
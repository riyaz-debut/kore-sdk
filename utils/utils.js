'use strict';

const Fs = require('fs-extra');

async function writeToFile(path, data) {
    const json = JSON.stringify(data, null, 2);
    path = `exports/${path}`;
    return Fs.writeFile(path, json);
}

module.exports = { writeToFile };

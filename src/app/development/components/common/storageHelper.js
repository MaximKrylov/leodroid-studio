const dropbox = window.require('node-dropbox');
const bluebird = window.require('bluebird');
const api = dropbox.api('dHP4deFWqWMAAAAAAAAJNNfjOdMDY4WAy8Fec3VQo7gDSJ22pvrvTm83eSjsW-uO');

const createFile = bluebird.promisify(api.createFile);

module.exports = {
    createFile: function (path, body) {
        return createFile(path, body);
    }
};
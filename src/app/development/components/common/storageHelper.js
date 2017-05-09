let dropbox = require('node-dropbox');
let api = dropbox.api('');

module.exports = {
    createFile: function (path, body) {
        return new Promise((resolve, reject) => {
            api.createFile(path, body, (error) => {
                if (error) {
                    reject(error);
                }

                resolve();
            });
        });
    }
};
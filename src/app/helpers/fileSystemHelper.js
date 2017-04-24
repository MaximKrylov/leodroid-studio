const fs = window.require('fs');
const path = window.require('path');
const del = window.require('del');
const copy = window.require('copy');

module.exports = {
    openFile: function (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'UTF-8', (error, content) => {
                if (error) {
                    reject(new Error(`openFile: ${error}`));
                }

                resolve(content);
            });
        });
    },

    saveFile: function (path, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (error) => {
                if (error) {
                    reject(new Error(`saveFile: ${error}`));
                }

                resolve();
            });
        });
    },

    getRootPath: function () {
        return path.resolve('./');
    },

    mkdir: function (path, callback) {
        fs.mkdir(path, callback);
    },

    del: function (pattern, callback) {
        del(pattern).then((paths) => {
            if (callback) {
                callback(paths);
            }
        });
    },

    copy: function (src, dest, callback) {
        copy(src, dest, callback);
    }
}

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

    del: function (patterns) {
        return new Promise((resolve) => {
            del(patterns).then((paths) => {
                resolve(paths);
            })
        });
    },

    mkdir: function (path) {
        return new Promise((resolve) => {
            fs.mkdir(path, () => {
                resolve();
            });
        });
    },

    copy: function (src, dest) {
        return new Promise((resolve) => {
            copy(src, dest, () => {
                resolve();
            });
        });
    },

    getRootPath: function () {
        return path.resolve('./');
    }
}

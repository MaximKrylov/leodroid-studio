const fs = window.require('fs');
const path = window.require('path');
const del = window.require('del');
const copy = window.require('copy');
const browserify = window.require('browserify');

module.exports = {
    openFile: function (path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'UTF-8', (error, content) => {
                if (error) {
                    reject(new Error(error));
                }

                resolve(content);
            });
        });
    },

    saveFile: function (path, content) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, content, (error) => {
                if (error) {
                    reject(new Error(error));
                }

                resolve();
            });
        });
    },

    mkdir: function (path) {
        return new Promise((resolve, reject) => {
            fs.mkdir(path, (error) => {
                if (error) {
                    reject(new Error(error));
                }

                resolve();
            });
        });
    },

    copy: function (src, dest) {
        return new Promise((resolve, reject) => {
            copy(src, dest, (error, files) => {
                if (error) {
                    reject(new Error(error));
                }

                resolve(files);
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

    browserify: function (entryPoint) {
        return new Promise((resolve, reject) => {
            browserify({ entries: entryPoint })
                .bundle((error, buffer) => {
                    if (error) {
                        reject(new Error(error));
                    }

                    resolve(buffer);
                });
        });
    },

    getRootPath: function () {
        return path.resolve('./');
    }
}

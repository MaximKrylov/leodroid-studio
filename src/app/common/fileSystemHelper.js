const bluebird = window.require('bluebird');
const browserify = window.require('browserify');
const del = window.require('del');

const fs = window.require('fs');
const openFile = bluebird.promisify(fs.readFile);
const saveFile = bluebird.promisify(fs.writeFile);
const copy = bluebird.promisify(window.require('copy'));

module.exports = {
    openFile: function (path) {
        return openFile(path, 'UTF-8');
    },

    saveFile: function (path, content) {
        return saveFile(path, content);
    },

    copy: function (src, dest) {
        return copy(src, dest);
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
    }
}

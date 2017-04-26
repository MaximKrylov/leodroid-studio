const bluebird = window.require('bluebird');
const browserify = window.require('browserify');

const fs = window.require('fs');
const openFile = bluebird.promisify(fs.readFile);
const saveFile = bluebird.promisify(fs.writeFile);
const copy = bluebird.promisify(window.require('copy'));
const del = window.require('del');

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

    delete: function (patterns) {
        return del(patterns);
    },

    browserify: function (entryPoint) {
        return new Promise((resolve, reject) => {
            browserify(entryPoint)
                .bundle((error, buffer) => {
                    if (error) {
                        reject(new Error(error));
                    }

                    resolve(buffer);
                });
        });
    }
}

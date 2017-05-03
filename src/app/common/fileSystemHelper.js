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

    delete: function (patterns, options) {
        return del(patterns, options);
    },

    bundle: function (entryPoint) {
        const bundler = browserify(entryPoint);
        return bluebird.promisify(bundler.bundle, {
            context: bundler
        })();
    }
}

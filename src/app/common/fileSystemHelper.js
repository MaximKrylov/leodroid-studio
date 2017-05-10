const bluebird = window.require('bluebird');
const browserify = window.require('browserify');
const fs = window.require('fs');
const jsonfile = window.require('jsonfile');

const openFile = bluebird.promisify(fs.readFile);
const saveFile = bluebird.promisify(fs.writeFile);
const copy = bluebird.promisify(window.require('copy'));
const del = window.require('del');
const zip = bluebird.promisify(window.require('zip-folder'));
const readJson = bluebird.promisify(jsonfile.readFile);

module.exports = {
    openFile: function (srcPoint, options) {
        return openFile(srcPoint, options);
    },

    saveFile: function (destPoint, content) {
        return saveFile(destPoint, content);
    },

    copy: function (src, dest) {
        return copy(src, dest);
    },

    delete: function (patterns, options) {
        return del(patterns, options);
    },

    readJson: function (srcPoint) {
        return readJson(srcPoint);
    },

    zip: function (folder, destPoint) {
        return zip(folder, destPoint);
    },

    bundle: function (entryPoint, destPoint) {
        const bundler = browserify(entryPoint);
        return bluebird.promisify(bundler.bundle, {
            context: bundler
        })().then((buffer) => saveFile(destPoint, buffer));
    }
}

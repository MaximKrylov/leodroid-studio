const bluebird = window.require('bluebird');
const jsonfile = window.require('jsonfile');

const readFile = bluebird.promisify(jsonfile.readFile);

module.exports = {
    readConfig: function (path) {
        return readFile(path);
    }
}

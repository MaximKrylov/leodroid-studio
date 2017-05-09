const dropbox = window.require('dropbox');
const fileSystemHelper = require('../../../common/fileSystemHelper');
const api = new dropbox({ accessToken: 'dHP4deFWqWMAAAAAAAAJNTbKXrDq357oOsOv6rGTLHq4lAJsaa3ZqixYJN2CgAPP' });

module.exports = {
    uploadFile: function (path) {
        fileSystemHelper.openFile(path)
            .then((contents) => api.filesUpload({ path: '/leodroid-app.zip', contents: contents }));
    },

    deleteFile: function (fileName) {
        return api.filesSearch({ path: '', query: fileName, mode: 'filename' })
            .then((result) => {
                if (result.matches.length > 0) {
                    return api.filesDelete({ path: `/${fileName}` });
                }
            });
    }
};
const dropbox = window.require('dropbox');
const fileSystemHelper = require('../../../common/fileSystemHelper');
const api = new dropbox({ accessToken: 'dHP4deFWqWMAAAAAAAAJO9RfCZfqyO6VG0i1SdZ0Qc5XgkDQdlsZmTbDOEzAVNbU' });

module.exports = {
    uploadFile: function (path, fileName) {
        fileSystemHelper.openFile(path)
            .then((contents) => api.filesUpload({ path: `/${fileName}`, contents: contents }));
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
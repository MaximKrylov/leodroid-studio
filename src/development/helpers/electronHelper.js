const electron = window.require('electron');
const { dialog } = electron.remote;

module.exports = {
    showOpenDirectoryDialog: function (callback) {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            if (directories === undefined) {
                console.log(`showOpenDirectoryDialog: Directory wasn't opened.`)
                return;
            }

            if (callback) {
                callback(directories[0]);
            }
        });
    }
}

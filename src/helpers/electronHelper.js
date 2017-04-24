const electron = window.require('electron');
const { ipcRenderer } = electron;
const { dialog } = electron.remote;

module.exports = {
    showOpenDirectoryDialog: function (callback) {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            if (directories === undefined) {
                throw new Error(`showOpenDirectoryDialog: Directory wasn't opened.`);
            }

            if (callback) {
                callback(directories[0]);
            }
        });
    },

    on: function (channel, listener) {
        ipcRenderer.on(channel, listener)
    },

    send: function (channel, args) {
        ipcRenderer.send(channel, args);
    }
}

const electron = window.require('electron');
const { ipcRenderer } = electron;
const { dialog } = electron.remote;

module.exports = {
    showOpenDirectoryDialog: function (callback) {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            if (directories === undefined) {
                console.log(`showOpenDirectoryDialog: Directory wasn't opened.`);
                return;
            }

            if (callback) {
                callback(directories[0]);
            }
        });
    },

    ipcRendererOn: function (channel, listener) {
        ipcRenderer.on(channel, listener)
    },

    ipcRendererSend: function (channel, args) {
        ipcRenderer.send(channel, args);
    }
}

const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = window.require("fs");

module.exports = {
    showOpenDirectoryDialog: function (callback) {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            callback(directories);
        });
    }
}
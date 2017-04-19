const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = window.require("fs");

module.exports = {
    showOpenDirectoryDialog: function (callback) {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            if (directories === undefined) {
                console.log(`showOpenDirectoryDialog: Directory wasn't opened.`)
                return;
            }
            callback(directories[0]);
        });
    }
}
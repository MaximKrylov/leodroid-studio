const fs = window.require('fs');

module.exports = {
    openFile: function (filePath, callback) {
        fs.readFile(filePath, 'UTF-8', (error, fileContent) => {
            if (error) {
                throw new Error(`openFile: ${error}`);
            }

            if (callback) {
                callback(filePath, fileContent);
            }
        })
    },

    saveFile: function (filePath, fileContent, callback) {
        fs.writeFile(filePath, fileContent, (error) => {
            if (error) {
                throw new Error(`saveFile: ${error}`);
            }

            if (callback) {
                callback();
            }
        });
    }
}

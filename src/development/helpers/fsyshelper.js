const fs = window.require('fs');

module.exports = {
    openFile: function (filePath, callback) {
        fs.readFile(filePath, 'UTF-8', (error, fileContent) => {
            if (error) {
                console.log(`openFile: ${error}`);
                return;
            }

            if (callback) {
                callback(filePath, fileContent);
            }
        })
    },
    
    saveFile: function (filePath, fileContent) {
        fs.writeFile(filePath, fileContent, (error) => {
            if (error) {
                console.log(`saveFile: ${error}`);
                return;
            }
        });
    }
}
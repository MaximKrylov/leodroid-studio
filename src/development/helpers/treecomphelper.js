const fs = window.require('fs');

module.exports = {
    getChildren: function (directory) {
        return fs.readdirSync(directory).map(file => {
            let child = {
                name: file,
                path: `${directory}/${file}`
            }

            let stat = fs.statSync(child.path);

            if (stat && stat.isDirectory()) {
                child.children = getChildren(child.path);
            }
            
            return child;
        });
    }
}
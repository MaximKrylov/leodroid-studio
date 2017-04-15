const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = window.require("fs");

function getChildren(directory) {
    let children = [];

    fs.readdirSync(directory).forEach((file) => {
        let child = {
            name: file,
            path: directory + '/' + file,
            type: 'File'
        }

        let stat = fs.statSync(child.path);

        if (stat && stat.isDirectory()) {
            child.type = 'Directory';
            child.children = getChildren(child.path);
        }

        children.push(child);
    });

    return children;
}

class DashboardEvents {
    constructor(context) {
        this.onOpenButtonClick = this.onOpenButtonClick.bind(context);
    }

    onOpenButtonClick() {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            if (directories === undefined) {
                return;
            }

            let data = {
                name: "Project",
                toggled: true,
                children: getChildren(directories[0])
            };

            this.setState({ treeData: data });
        });
    }
}

export default DashboardEvents;

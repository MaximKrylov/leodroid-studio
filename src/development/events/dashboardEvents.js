const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = window.require("fs");

import { getChildren } from '../helpers/treecomphelper'

class DashboardEvents {
    constructor(context) {
        this.onOpenButtonClick = this.onOpenButtonClick.bind(context);
    }

    onOpenButtonClick() {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, directories => {
            if (directories === undefined) { return; }
            let data = {
                // Get opened folder name (without full path)
                name: directories[0].match(/([^\/]*)\/*$/)[1],
                // Root node is toggled by default
                toggled: true,
                // Get all child nodes (recursive)
                children: getChildren(directories[0])
            };

            this.setState({
                treeData: data,
                isProjectOpened: true,
                isFileOpened: false,
                openedFilePath: "",
                editorValue: ""
            });
        });
    }
}

export default DashboardEvents;

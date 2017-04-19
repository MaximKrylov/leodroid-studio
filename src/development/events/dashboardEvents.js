import { getChildren } from '../helpers/treecomphelper';
import { showOpenDirectoryDialog } from '../helpers/electronhelper';

class DashboardEvents {
    constructor(context) {
        this.onOpenButtonClick = this.onOpenButtonClick.bind(context);
    }

    onOpenButtonClick() {
        showOpenDirectoryDialog((directories) => {
            if (directories === undefined) {
                console.log(`showOpenDirectoryDialog: Directory wasn't opened.`)
                return;
            }
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

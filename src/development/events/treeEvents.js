import { saveFile, openFile } from '../helpers/fsyshelper';
const brace = window.require("brace");

function toggle(context, node, toggled) {
    if (context.state.cursor) { context.state.cursor.active = false; }
    node.active = true;
    if (node.children) { node.toggled = toggled; }
    context.setState({ cursor: node });
}

class TreeEvents {
    constructor(context) {
        this.onToggle = this.onToggle.bind(context);
    }

    onToggle(node, toggled) {
        // Toggle node
        toggle(this, node, toggled);
        // If node is a folder, return 
        if (node.children) { return; }
        // If the user has opened file, save this file
        if (this.state.isFileOpened) {
            saveFile(this.state.openedFilePath, this.state.editorValue);
        }
        // Open file
        openFile(node.path, (filePath, fileContent) => {
            this.setState({
                openedFilePath: filePath,
                editorValue: fileContent,
                isFileOpened: true
            });
        });
        // Reset undo/redo manager
        brace.edit("editorComponent").getSession().getUndoManager().reset();
    }
}

export default TreeEvents;

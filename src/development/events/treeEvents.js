const fs = window.require("fs");
const brace = require("brace");

function toggle(context, node, toggled) {
    if (context.state.cursor) { context.state.cursor.active = false; }
    node.active = true;
    if (node.children) { node.toggled = toggled; }
    context.setState({ cursor: node });
}

function saveFile(context, filePath, fileContent) {
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) { return; }
    });
}

function openFile(context, filePath) {
    fs.readFile(filePath, 'UTF-8', (err, data) => {
        if (err) { return; }
        context.setState({ editorValue: data, openedFilePath: filePath }, () => {
            // Get editorComponent by name and reset undo/redo history
            brace.edit("editorComponent").getSession().getUndoManager().reset()
        });
    })
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
        if (this.state.openedFilePath !== "") {
            saveFile(this, this.state.openedFilePath, this.state.editorValue);
        }
        // Open file
        openFile(this, node.path);
    }
}

export default TreeEvents;

const brace = window.require("brace");

module.exports = {
    addCommand: function (command) {
        brace.edit('editorComponent').commands.addCommand(command);
    }
}
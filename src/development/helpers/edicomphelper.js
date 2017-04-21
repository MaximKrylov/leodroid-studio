const brace = window.require('brace');

module.exports = {
    addCommandToEditor: function (command) {
        brace.edit('editorComponent').commands.addCommand(command);
    },
    focusOnEditor: function () {
        let editor = brace.edit('editorComponent');
        editor.focus();
        let lastLine = editor.getSession().getValue().split("\n").length;
        editor.gotoLine(lastLine);
    }
}
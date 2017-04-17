const brace = require("brace");

class EditorEvents {
    constructor(context) {
        this.onChange = this.onChange.bind(context);
    }

    onChange(value) {
        // It doesn't need to update component after changing its value here,
        // that's why it doen't need to use setState(...)
        this.state.editorValue = value;
    }
}

export default EditorEvents;

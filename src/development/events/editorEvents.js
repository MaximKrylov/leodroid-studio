const brace = require("brace");

class EditorEvents {
    constructor(context) {
        this.onChange = this.onChange.bind(context);
    }

    onChange(value) {
        this.setState({ editorValue: value });
    }
}

export default EditorEvents;

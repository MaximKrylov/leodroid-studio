import React from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/twilight';

const CONFIG = {
    mode: "javascript", // Language: JavaScript
    theme: "twilight", // Color scheme: Twilight
    fontSize: "12", // Font size: 12pt
    editorProps: {
        /*
            Setting '$blockScrolling' option prevents appearing of the following warning message: 
            Automatically scrolling cursor into view after selection change this will be disabled 
            in the next version set editor.$blockScrolling = Infinity to disable this message
        */
        $blockScrolling: true
    },
    width: "100%", // Widht: 100%
    height: "100%" // Height: 100%
}

class EditorComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                < AceEditor
                    // Editor configuration
                    name="editorComponent"
                    mode={CONFIG.mode}
                    theme={CONFIG.theme}
                    fontSize={CONFIG.fontSize}
                    editorProps={CONFIG.editorProps}
                    width={CONFIG.width}
                    height={CONFIG.height}

                    // Editor properties
                    value={this.props.value}
                    onChange={this.props.onChange}
                    onLoad={this.props.onLoad}
                />
            </div>
        );
    }
}

export default EditorComponent;

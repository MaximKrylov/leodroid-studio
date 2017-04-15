import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';

import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

import injectTapEventPlugin from 'react-tap-event-plugin';

const data = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'dsakdjas' },
                { name: 'child2' }
            ]
        },
        {
            name: 'loading parent',
            loading: true,
            children: []
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }
            ]
        }
    ]
};

class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "// Write your code here..." };
        this.onTreeNodeToggle = this.onTreeNodeToggle.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
        injectTapEventPlugin();
    }

    onEditorChange(value) {
        this.setState({ value: value });
    }

    onTreeNodeToggle(node, toggled) {
        let value = this.state.value;

        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-3 no-padding">
                        <div className="row">
                            <div className="col-xs-12">
                                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                                    <Toolbar style={{ backgroundColor: "#212121" }}>
                                        <ToolbarGroup>
                                            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                                                <FlatButton label="OPEN" icon={<FileFolderOpen />} />
                                            </MuiThemeProvider>
                                            <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                                                <FlatButton label="RUN" icon={<AvPlayArrow />} />
                                            </MuiThemeProvider>
                                        </ToolbarGroup>
                                    </Toolbar>
                                </MuiThemeProvider>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TreeComponent
                                    data={data}
                                    onToggle={this.onTreeNodeToggle}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-9 no-padding">
                        <EditorComponent
                            onChange={this.onEditorChange}
                            value={this.state.value}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

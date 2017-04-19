import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';
import DashboardComponent from './dboardcomp';

import { saveFile, openFile } from '../helpers/fsyshelper';
import { getChildren } from '../helpers/treecomphelper';
import { showOpenDirectoryDialog } from '../helpers/electronhelper';

import brace from 'brace';


class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorValue: '',
            isFileOpened: false,
            openedFilePath: '',
            treeData: null,
            isProjectOpened: false
        };

        this.onTreeComponentToggle = this.onTreeComponentToggle.bind(this);
        this.onEditorComponentChange = this.onEditorComponentChange.bind(this);
        this.onDashboardComponentOpenButtonClick = this.onDashboardComponentOpenButtonClick.bind(this);
        this.onEditorComponentLoad = this.onEditorComponentLoad.bind(this);
    }

    onTreeComponentToggle(node, toggled) {
        // Toggle node
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }

        node.active = true;

        if (node.children) {
            node.toggled = toggled;
        }

        this.setState({ cursor: node });

        // If node is a folder, return 
        if (node.children) {
            return;
        }

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
    }

    onEditorComponentChange(value) {
        // It doesn't need to update component after changing its value here,
        // that's why it doen't need to use setState(...)
        this.state.editorValue = value;
    }

    onEditorComponentLoad() {
        brace.edit('editorComponent').commands.addCommand({
            name: 'save',
            bindKey: { 'win': 'Ctrl-S', 'mac': 'Cmd-S' },
            exec: () => {
                saveFile(this.state.openedFilePath, this.state.editorValue);
            }
        });
    }

    onDashboardComponentOpenButtonClick() {
        showOpenDirectoryDialog((directory) => {
            let data = {
                // Get opened folder name (without full path)
                name: directory.match(/([^\/]*)\/*$/)[1],
                // Root node is toggled by default
                toggled: true,
                // Get all child nodes (recursive)
                children: getChildren(directory)
            };
            this.setState({
                treeData: data,
                isProjectOpened: true,
                isFileOpened: false,
                openedFilePath: '',
                editorValue: ''
            });
        });
    }

    render() {
        let treeComponent = null;

        if (this.state.treeData) {
            treeComponent =
                <TreeComponent
                    data={this.state.treeData}
                    onToggle={this.onTreeComponentToggle}
                />;
        } else {
            treeComponent = <div></div>;
        }

        const dashboardComponent =
            <DashboardComponent
                onOpenButtonClick={this.onDashboardComponentOpenButtonClick}
                isProjectOpened={this.state.isProjectOpened}
            />;

        const editorComponent =
            <EditorComponent
                value={this.state.editorValue}
                isFileOpened={this.state.isFileOpened}
                onChange={this.onEditorComponentChange}
                onLoad={this.onEditorComponentLoad}
            />;

        return (
            <section id='layout'>
                <aside id='left-side'>
                    <section id='dashboard'>{dashboardComponent}</section>
                    <section id='tree'>{treeComponent}</section>
                </aside>
                <section id='right-side'>
                    <section id='editor'>{editorComponent}</section>
                    <section id='airline'></section>
                </section>
            </section>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

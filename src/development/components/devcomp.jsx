import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';
import DashboardComponent from './dboardcomp';

import fileSystemHelper from '../helpers/fsyshelper';
import electronHelper from '../helpers/electronhelper';
import editorComponentHelper from '../helpers/edicomphelper';
import treeComponentHelper from '../helpers/treecomphelper';


class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileContent: '',
            filePath: '',
            isFileOpened: false,
            isFileChanged: false,

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

        // If the user has opened file and the file is changed, save this file
        if (this.state.isFileOpened && this.state.isFileChanged) {
            fileSystemHelper.saveFile(this.state.filePath, this.state.fileContent, () => {
                this.setState({ isFileChanged: false });
            });
        }

        // Open file
        fileSystemHelper.openFile(node.path, (filePath, fileContent) => {
            this.setState({
                filePath: filePath,
                fileContent: fileContent,
                isFileOpened: true
            });
        });
    }

    onEditorComponentChange(value) {
        this.setState({
            fileContent: value,
            isFileChanged: true
        });
    }

    onEditorComponentLoad() {
        editorComponentHelper.addCommand({
            name: 'save',
            bindKey: { 'win': 'Ctrl-S', 'mac': 'Cmd-S' },
            exec: () => {
                fileSystemHelper.saveFile(this.state.filePath, this.state.fileContent, () => {
                    this.setState({ isFileChanged: false });
                });
            }
        });
    }

    onDashboardComponentOpenButtonClick() {
        electronHelper.showOpenDirectoryDialog((directory) => {
            let data = {
                // Get opened folder name (without full path)
                name: directory.match(/([^\/]*)\/*$/)[1],
                // Root node is toggled by default
                toggled: true,
                // Get all child nodes (recursive)
                children: treeComponentHelper.getChildren(directory)
            };

            this.setState({
                filePath: '',
                fileContent: '',
                isFileOpened: false,
                isFileChanged: false,

                treeData: data,
                isProjectOpened: true
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
                value={this.state.fileContent}
                readOnly={!this.state.isFileOpened}
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

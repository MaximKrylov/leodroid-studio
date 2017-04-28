import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './EditorComponent';
import TreeComponent from './TreeComponent';
import TopDashboardComponent from './TopDashboardComponent';
import BottomDashboardComponent from './BottomDashboardComponent';
import ErrorComponent from './ErrorComponent';

import electronHelper from '../../common/electronHelper';
import fileSystemHelper from '../../common/fileSystemHelper';
import editorComponentHelper from './common/editorHelper';
import treeComponentHelper from './common/treeHelper';

import injectTapEventPlugin from 'react-tap-event-plugin';

class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileContent: '',
            filePath: '',
            fileOpened: false,
            fileChanged: false,

            projectPath: '',
            projectOpened: false,

            emulatorWindowOpened: false,

            treeData: null,

            errorMessage: '',
            errorComponentOpened: false
        };

        this.onTreeComponentToggle = this.onTreeComponentToggle.bind(this);

        this.onEditorComponentChange = this.onEditorComponentChange.bind(this);
        this.onEditorComponentLoad = this.onEditorComponentLoad.bind(this);

        this.onTopDashboardComponentOpenButtonTouchTap = this.onTopDashboardComponentOpenButtonTouchTap.bind(this);
        this.onTopDashboardComponentRunButtonTouchTap = this.onTopDashboardComponentRunButtonTouchTap.bind(this);

        this.onErrorComponentRequestClose = this.onErrorComponentRequestClose.bind(this);

        injectTapEventPlugin();

        electronHelper.on('emulator-window-did-closed', (event, args) => {
            this.setState({
                emulatorWindowOpened: false
            });
        });
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
        if (this.state.fileOpened && this.state.fileChanged) {
            fileSystemHelper.saveFile(this.state.filePath, this.state.fileContent)
                .then(() => {
                    this.setState({
                        fileChanged: false
                    });
                })
                .catch((error) => {
                    throw new Error(error);
                });
        }

        // Open file
        fileSystemHelper.openFile(node.path)
            .then((content) => {
                this.setState({
                    filePath: node.path,
                    fileContent: content,
                    fileOpened: true
                });

                editorComponentHelper.focusOnEditor();
            })
            .catch((error) => {
                throw new Error(error);
            });
    }

    onEditorComponentChange(value) {
        this.setState({
            fileContent: value,
            fileChanged: true
        });
    }

    onEditorComponentLoad() {
        editorComponentHelper.addCommandToEditor({
            name: 'save',
            bindKey: {
                win: 'Ctrl-S',
                mac: 'Command-S'
            },
            exec: (editor) => {
                // If the user has opened file and the file is changed, save this file
                if (this.state.fileOpened && this.state.fileChanged) {
                    fileSystemHelper.saveFile(this.state.filePath, this.state.fileContent)
                        .then(() => {
                            this.setState({
                                fileChanged: false
                            });
                        })
                        .catch((error) => {
                            throw new Error(error);
                        });
                }
            }
        });

        editorComponentHelper.addCommandToEditor({
            name: "unfind",
            bindKey: {
                win: "Ctrl-F",
                mac: "Command-F"
            },
            exec: (editor, line) => {
                return false;
            }
        });
    }

    onTopDashboardComponentOpenButtonTouchTap() {
        electronHelper.showOpenDirectoryDialog((directory) => {
            let treeData = {
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
                projectPath: directory,
                fileOpened: false,
                fileChanged: false,
                treeData: treeData,
                projectOpened: true
            });
        });
    }

    onTopDashboardComponentRunButtonTouchTap() {
        // Async function
        this.setState({
            emulatorWindowOpened: true
        });

        // Delete ./tmp
        fileSystemHelper.delete(['./tmp'])
            // Copy 'project'
            .then(() => fileSystemHelper.copy(`${this.state.projectPath}/**/*.js`, './tmp'))
            // Copy ./edison-api/edison.js
            .then(() => fileSystemHelper.copy(`./edison-api/edison.js`, './tmp'))
            // Bundle ./tmp/**/*.js, using 'main.js' as entry point
            .then(() => fileSystemHelper.bundle('./tmp/main.js'))
            // Save file as 'bundle.js' and put it to ./build/app/emulator/
            .then((buffer) => fileSystemHelper.saveFile('./build/app/emulator/bundle.js', buffer))
            // Send signal to main process, that emulator window has to be opened
            .then(() => {
                electronHelper.send('open-emulator-window');
            })
            .catch((error) => {
                this.setState({
                    errorMessage: error.message,
                    errorComponentOpened: true,
                    emulatorWindowOpened: false
                });
            })
            // Delete ./tmp
            .then(() => fileSystemHelper.delete('./tmp'))
            .catch((error) => {
                this.setState({
                    errorMessage: error.message,
                    errorComponentOpened: true,
                });
            })
    }

    onErrorComponentRequestClose() {
        this.setState({
            errorMessage: '',
            errorComponentOpened: false
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

        let topDashboardComponent =
            <TopDashboardComponent
                onOpenButtonTouchTap={this.onTopDashboardComponentOpenButtonTouchTap}
                onRunButtonTouchTap={this.onTopDashboardComponentRunButtonTouchTap}

                newProjectButtonDisabled={!this.state.projectOpened}
                runButtonDisabled={!this.state.projectOpened || this.state.emulatorWindowOpened}
            />;

        let bottomDashboardComponent =
            <BottomDashboardComponent
                compileProjectButtonDisabled={!this.state.projectOpened}
                settingsButtonDisabled={!this.state.projectOpened}
            />;

        let editorComponent =
            <EditorComponent
                value={this.state.fileContent}
                readOnly={!this.state.fileOpened}
                onChange={this.onEditorComponentChange}
                onLoad={this.onEditorComponentLoad}
            />;

        let errorComponent =
            <ErrorComponent
                message={this.state.errorMessage}
                open={this.state.errorComponentOpened}
                onRequestClose={this.onErrorComponentRequestClose}
            />;

        return (
            <section id='layout'>
                <aside id='left-side'>
                    <section id='top-dashboard'>{topDashboardComponent}</section>
                    <section id='tree'>{treeComponent}</section>
                    <section id='bottom-dashboard'>{bottomDashboardComponent}</section>
                </aside>
                <section id='right-side'>
                    <section id='editor'>{editorComponent}</section>
                </section>
                {errorComponent}
            </section>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

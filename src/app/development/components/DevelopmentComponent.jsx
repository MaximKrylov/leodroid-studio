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
            errorComponentOpened: false,

            emulatorComponentDevToolsOpened: false,

            topDashboardComponentNewProjectDialogOpened: false,

            bottomDashboardComponentSettingsDrawerOpened: false
        };

        this.onTreeComponentToggle = this.onTreeComponentToggle.bind(this);

        this.onEditorComponentChange = this.onEditorComponentChange.bind(this);
        this.onEditorComponentLoad = this.onEditorComponentLoad.bind(this);

        this.onErrorComponentRequestClose = this.onErrorComponentRequestClose.bind(this);

        this.onTopDashboardComponentOpenButtonTouchTap = this.onTopDashboardComponentOpenButtonTouchTap.bind(this);
        this.onTopDashboardComponentRunButtonTouchTap = this.onTopDashboardComponentRunButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectButtonTouchTap = this.onTopDashboardComponentNewProjectButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectDialogCancelButtonTouchTapp = this.onTopDashboardComponentNewProjectDialogCancelButtonTouchTapp.bind(this);
        this.onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap = this.onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectDialogRequestClose = this.onTopDashboardComponentNewProjectDialogRequestClose.bind(this);

        this.onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle = this.onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle.bind(this);
        this.onBottomDashboardComponentSettingsButtonTouchTap = this.onBottomDashboardComponentSettingsButtonTouchTap.bind(this);
        this.onBottomDashboardComponentSettingsDrawerRequestChange = this.onBottomDashboardComponentSettingsDrawerRequestChange.bind(this);

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

        this.setState({
            cursor: node
        });

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
                    this.setState({
                        errorMessage: error.message,
                        errorComponentOpened: true,
                    });
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
                this.setState({
                    errorMessage: error.message,
                    errorComponentOpened: true,
                });
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
                            this.setState({
                                errorMessage: error.message,
                                errorComponentOpened: true,
                            });
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

        fileSystemHelper.bundle(`${this.state.projectPath}/main.js`)
            .then((buffer) => fileSystemHelper.saveFile('./build/app/emulator/bundle.js', buffer))
            .then(() => {
                electronHelper.send('open-emulator-window', {
                    emulatorComponentDevToolsOpened: this.state.emulatorComponentDevToolsOpened
                });
            })
            .catch((error) => {
                this.setState({
                    errorMessage: error.message,
                    errorComponentOpened: true,
                    emulatorWindowOpened: false
                });
            });
    }

    onErrorComponentRequestClose() {
        this.setState({
            errorMessage: '',
            errorComponentOpened: false
        });
    }

    onTopDashboardComponentNewProjectDialogCancelButtonTouchTapp() {
        this.setState({
            topDashboardComponentNewProjectDialogOpened: false
        });
    }

    onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap() {
        this.setState({
            topDashboardComponentNewProjectDialogOpened: false
        });

        fileSystemHelper.delete([`${this.state.projectPath}/**`, `!${this.state.projectPath}`], { force: true })
            .then(() => fileSystemHelper.copy('./edison-app/**/*', `${this.state.projectPath}`))
            .then(() => fileSystemHelper.delete(`${this.state.projectPath}/.DS_Store`, { force: true }))
            .then(() => {
                let treeData = {
                    // Get opened folder name (without full path)
                    name: this.state.projectPath.match(/([^\/]*)\/*$/)[1],
                    // Root node is toggled by default
                    toggled: true,
                    // Get all child nodes (recursive)
                    children: treeComponentHelper.getChildren(this.state.projectPath)
                };

                this.setState({
                    filePath: '',
                    fileContent: '',
                    fileOpened: false,
                    fileChanged: false,
                    treeData: treeData
                });
            })
            .catch((error) => {
                this.setState({
                    errorMessage: error.message,
                    errorComponentOpened: true,
                });
            });
    }

    onTopDashboardComponentNewProjectButtonTouchTap() {
        this.setState({
            topDashboardComponentNewProjectDialogOpened: true
        });
    }

    onTopDashboardComponentNewProjectDialogRequestClose() {
        this.setState({
            topDashboardComponentNewProjectDialogOpened: false
        });
    }

    onBottomDashboardComponentSettingsButtonTouchTap() {
        this.setState({
            bottomDashboardComponentSettingsDrawerOpened: true
        });
    }

    onBottomDashboardComponentSettingsDrawerRequestChange(isDrawerOpened) {
        this.setState({
            bottomDashboardComponentSettingsDrawerOpened: isDrawerOpened
        });
    }

    onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle(event, isInputChacked) {
        this.setState({
            emulatorComponentDevToolsOpened: isInputChacked
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

                newProjectDialogOpened={this.state.topDashboardComponentNewProjectDialogOpened}

                onNewProjectDialogCancelButtonTouchTap={this.onTopDashboardComponentNewProjectDialogCancelButtonTouchTapp}
                onNewProjectDialogSubmitButtonTouchTap={this.onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap}
                onNewProjectDialogRequestClose={this.onTopDashboardComponentNewProjectDialogRequestClose}
                onNewProjectButtonTouchTap={this.onTopDashboardComponentNewProjectButtonTouchTap}
            />;

        let bottomDashboardComponent =
            <BottomDashboardComponent
                compileProjectButtonDisabled={!this.state.projectOpened}
                settingsButtonDisabled={!this.state.projectOpened}
                emulatorComponentDevToolsToggleButtonToggled={this.state.emulatorComponentDevToolsOpened}

                onEmulatorComponentDevToolsToggleButtonToggle={this.onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle}
                settingsDrawerOpened={this.state.bottomDashboardComponentSettingsDrawerOpened}

                onSettingsButtonTouchTap={this.onBottomDashboardComponentSettingsButtonTouchTap}
                onSettingsDrawerRequestChange={this.onBottomDashboardComponentSettingsDrawerRequestChange}
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
                <div>{errorComponent}</div>
            </section>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

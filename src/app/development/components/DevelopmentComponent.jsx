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
import storageHelper from './common/storageHelper';

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

            emulatorComponentDevToolsOpened: true,

            editorComponentVimModeEnabled: true,
            editorComponentKeyboardHandler: 'vim',

            topDashboardComponentNewProjectDialogOpened: false,

            bottomDashboardComponentSettingsDrawerOpened: false
        };

        this.openProject = this.openProject.bind(this);

        this.onTreeComponentToggle = this.onTreeComponentToggle.bind(this);

        this.onEditorComponentChange = this.onEditorComponentChange.bind(this);
        this.onEditorComponentLoad = this.onEditorComponentLoad.bind(this);

        this.onErrorComponentRequestClose = this.onErrorComponentRequestClose.bind(this);

        this.onTopDashboardComponentOpenButtonTouchTap = this.onTopDashboardComponentOpenButtonTouchTap.bind(this);
        this.onTopDashboardComponentRunButtonTouchTap = this.onTopDashboardComponentRunButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectButtonTouchTap = this.onTopDashboardComponentNewProjectButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectDialogCancelButtonTouchTap = this.onTopDashboardComponentNewProjectDialogCancelButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap = this.onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap.bind(this);
        this.onTopDashboardComponentNewProjectDialogRequestClose = this.onTopDashboardComponentNewProjectDialogRequestClose.bind(this);

        this.onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle = this.onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle.bind(this);
        this.onBottomDashboardComponentEditorComponentVimModeToggleButtonToggle = this.onBottomDashboardComponentEditorComponentVimModeToggleButtonToggle.bind(this);
        this.onBottomDashboardComponentSettingsDrawerRequestChange = this.onBottomDashboardComponentSettingsDrawerRequestChange.bind(this);
        this.onBottomDashboardComponentSettingsButtonTouchTap = this.onBottomDashboardComponentSettingsButtonTouchTap.bind(this);
        this.onBottomDashboardComponentLeodifyButtonTouchTap = this.onBottomDashboardComponentLeodifyButtonTouchTap.bind(this);

        injectTapEventPlugin();

        electronHelper.on('emulator-window-did-closed', (event, args) => {
            this.setState({
                emulatorWindowOpened: false
            });
        });
    }

    openProject(directory) {
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
        fileSystemHelper.openFile(node.path, 'UTF-8')
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
            this.openProject(directory);
        });
    }

    onTopDashboardComponentRunButtonTouchTap() {
        this.setState({
            emulatorWindowOpened: true
        });

        const emulatorPath = './build/app/emulator';
        const projectPath = this.state.projectPath;

        fileSystemHelper.delete([
            `${emulatorPath}/**`,
            `!${emulatorPath}`,
            `!${emulatorPath}/index.html`,
            `!${emulatorPath}/style.css`,
            `!${emulatorPath}/assets/**`
        ])
            .then(() => fileSystemHelper.copy(`${projectPath}/node_modules/**/*.*`, `${emulatorPath}/node_modules`))
            .then(() => fileSystemHelper.bundle(`${projectPath}/main.js`, `${emulatorPath}/bundle.js`))
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

    onTopDashboardComponentNewProjectDialogCancelButtonTouchTap() {
        this.setState({
            topDashboardComponentNewProjectDialogOpened: false
        });
    }

    onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap() {
        this.setState({
            topDashboardComponentNewProjectDialogOpened: false
        });

        fileSystemHelper.delete([`${this.state.projectPath}/**`, `!${this.state.projectPath}`], { force: true })
            .then(() => fileSystemHelper.copy('./src/app/assets/sample-app/*.*', `${this.state.projectPath}`))
            .then(() => fileSystemHelper.delete(`${this.state.projectPath}/.DS_Store`, { force: true }))
            .then(() => {
                this.openProject(this.state.projectPath);
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

    onBottomDashboardComponentLeodifyButtonTouchTap() {
        const emulatorPath = './build/app/emulator';
        const projectPath = this.state.projectPath;
        let applicationName = '';

        fileSystemHelper.readJson(`${projectPath}/package.json`)
            .then((json) => {
                applicationName = json.name;
            })
            .then(() => fileSystemHelper.readJson(`${projectPath}/config.json`))
            .then((config) => {
                if (!config.applicationName) {
                    throw new Error('config.json: applicationName is not set');
                }
                if (!config.type) {
                    throw new Error('config.json: type is not set');
                }
                if (config.type !== 'NodeJS') {
                    throw new Error('config.json: type is not NodeJS');
                }
                if (!config.executable) {
                    throw new Error('config.json: executable is not set')
                }
                if (config.executable !== 'main.js') {
                    throw new Error('config.json: executable is not main.js')
                }
                if (!config.commands) {
                    throw new Error('config.json: commands is not set');
                }
                if (!config.commands.rules) {
                    throw new Error('config.json: rules is not set');
                }
                if (Object.keys(config.commands.rules).length === 0) {
                    throw new Error('config.json: rules is empty object');
                }

                let rules = config.commands.rules;

                for (let key in rules) {
                    if (!rules[key].rule || !rules[key].description) {
                        throw new Error(`config.json: ${key} rule is invalid`);
                    }

                    const regexp = /<\w+>/g;
                    const paramsInUse = [];
                    let param;

                    while ((param = regexp.exec(rules[key].rule)) !== null) {
                        const paramStr = param[0];
                        const paramKey = paramStr.substring(1, paramStr.length - 1);

                        if (!config.commands.params[paramKey]) {
                            throw new Error(`config.json: Unknown parameter ${param} in rule '${rules[key].rule}'`);
                        }
                    }
                }
            })
            .then(() => fileSystemHelper.copy('./src/app/assets/*leodroid.js', `${projectPath}`))
            .then(() => fileSystemHelper.zip(`${projectPath}`, `${projectPath}/../${applicationName}.zip`))
            .then(() => fileSystemHelper.copy('./src/app/assets/sample-app/*leodroid.js', `${projectPath}`))
            .then(() => storageHelper.deleteFile(`${applicationName}.zip`))
            .then(() => storageHelper.uploadFile(`${projectPath}/../${applicationName}.zip`, `${applicationName}.zip`))
            .then(() => fileSystemHelper.delete(`${projectPath}/../${applicationName}.zip`, { force: true }))
            .then(() => {
                this.setState({
                    errorMessage: 'It isn\'t an error! Leodify has successfully completed... CONGRATULATIONS!!! :)',
                    errorComponentOpened: true,
                });
            })
            .catch((error) => {
                this.setState({
                    errorMessage: error.message,
                    errorComponentOpened: true,
                });
                fileSystemHelper.copy('./src/app/assets/sample-app/*leodroid.js', `${projectPath}`)
                    .then(() => fileSystemHelper.delete(`${projectPath}/../${applicationName}.zip`, { force: true }))
                    .catch((error) => {
                        this.setState({
                            errorMessage: error.message,
                            errorComponentOpened: true,
                        });
                    });
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

    onBottomDashboardComponentEditorComponentVimModeToggleButtonToggle(event, isInputChacked) {
        if (isInputChacked) {
            this.setState({
                editorComponentVimModeEnabled: true,
                editorComponentKeyboardHandler: 'vim'
            });
        } else {
            this.setState({
                editorComponentVimModeEnabled: false,
                editorComponentKeyboardHandler: ''
            });
        }
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

                onNewProjectDialogCancelButtonTouchTap={this.onTopDashboardComponentNewProjectDialogCancelButtonTouchTap}
                onNewProjectDialogSubmitButtonTouchTap={this.onTopDashboardComponentNewProjectDialogSubmitButtonTouchTap}
                onNewProjectDialogRequestClose={this.onTopDashboardComponentNewProjectDialogRequestClose}
                onNewProjectButtonTouchTap={this.onTopDashboardComponentNewProjectButtonTouchTap}
            />;

        let bottomDashboardComponent =
            <BottomDashboardComponent
                leodifyProjectButtonDisabled={!this.state.projectOpened}
                settingsButtonDisabled={!this.state.projectOpened}
                emulatorComponentDevToolsToggleButtonToggled={this.state.emulatorComponentDevToolsOpened}
                editorComponentVimModeToggleButtonToggled={this.state.editorComponentVimModeEnabled}

                onEmulatorComponentDevToolsToggleButtonToggle={this.onBottomDashboardComponentEmulatorComponentDevToolsToggleButtonToggle}
                onEditorComponentVimModeToggleButtonToggle={this.onBottomDashboardComponentEditorComponentVimModeToggleButtonToggle}
                settingsDrawerOpened={this.state.bottomDashboardComponentSettingsDrawerOpened}

                onSettingsButtonTouchTap={this.onBottomDashboardComponentSettingsButtonTouchTap}
                onLeodifyButtonTouchTap={this.onBottomDashboardComponentLeodifyButtonTouchTap}
                onSettingsDrawerRequestChange={this.onBottomDashboardComponentSettingsDrawerRequestChange}
            />;

        let editorComponent =
            <EditorComponent
                value={this.state.fileContent}
                readOnly={!this.state.fileOpened}
                onChange={this.onEditorComponentChange}
                onLoad={this.onEditorComponentLoad}
                keyboardHandler={this.state.editorComponentKeyboardHandler}
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

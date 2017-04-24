import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './EditorComponent';
import TreeComponent from './TreeComponent';
import TopDashboardComponent from './TopDashboardComponent';
import BottomDashboardComponent from './BottomDashboardComponent';

import electronHelper from '../../helpers/electronHelper';
import fileSystemHelper from '../../helpers/fileSystemHelper';
import editorComponentHelper from './helpers/editorHelper';
import treeComponentHelper from './helpers/treeHelper';

import injectTapEventPlugin from 'react-tap-event-plugin';

class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fileContent: '',
            filePath: '',
            projectPath: '',
            fileOpened: false,
            fileChanged: false,
            projectOpened: false,
            emulatorWindowOpened: false,
            treeData: null
        };

        this.onTreeComponentToggle = this.onTreeComponentToggle.bind(this);

        this.onEditorComponentChange = this.onEditorComponentChange.bind(this);
        this.onEditorComponentLoad = this.onEditorComponentLoad.bind(this);

        this.onTopDashboardComponentOpenButtonTouchTap = this.onTopDashboardComponentOpenButtonTouchTap.bind(this);
        this.onTopDashboardComponentRunButtonTouchTap = this.onTopDashboardComponentRunButtonTouchTap.bind(this);

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
                    this.setState({ fileChanged: false });
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
                            this.setState({ fileChanged: false });
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
        // // delete dir './tmp'
        // fileSystemHelper.del(`${fileSystemHelper.getRootPath()}/tmp`, () => {
        //     // make dir './tmp'
        //     fileSystemHelper.mkdir(`${fileSystemHelper.getRootPath()}/tmp`, () => {
        //         // copy from '/path/to/projectdir' dir to './tmp' dir
        //         fileSystemHelper.copy(`${this.state.projectPath}/**/*.js`, `${fileSystemHelper.getRootPath()}/tmp`, (err, files) => {
        //             electronHelper.send('open-emulator-window');

        //             this.setState({
        //                 emulatorWindowOpened: true
        //             });
        //         });
        //     });
        // });
        electronHelper.send('emulator-window-will-opened');

        this.setState({
            emulatorWindowOpened: true
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
            />;

        let editorComponent =
            <EditorComponent
                value={this.state.fileContent}
                readOnly={!this.state.fileOpened}
                onChange={this.onEditorComponentChange}
                onLoad={this.onEditorComponentLoad}
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
            </section>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

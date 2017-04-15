import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';
import DashboardComponent from './dboardcomp';

const electron = window.require("electron");
const { dialog } = electron.remote;
const fs = window.require("fs");

class TreeEvents {
    constructor(context) {
        this.onToggle = this.onToggle.bind(context);
        this.onToggle = this._toggle.bind(context);
    }

    _toggle(node, toggled) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }

        node.active = true;

        if (node.children) {
            node.toggled = toggled;
        }

        this.setState({ cursor: node });
    }

    onToggle(node, toggled) {
        this._toggle(node, toggled);
    }
}

class EditorEvents {
    constructor(context) {
        this.onChange = this.onChange.bind(context);
    }

    onChange(value) {
        this.setState({ editorValue: value });
    }
}

function getChildren(directory) {
    let children = [];

    fs.readdirSync(directory).forEach((file) => {
        let child = {
            name: file,
            path: directory + '/' + file,
            type: 'File'
        }

        let stat = fs.statSync(child.path);

        if (stat && stat.isDirectory()) {
            child.type = 'Directory';
            child.children = getChildren(child.path);
        }

        children.push(child);
    });

    return children;
}

class DashboardEvents {
    constructor(context) {
        this.onOpenButtonClick = this.onOpenButtonClick.bind(context);
    }

    onOpenButtonClick() {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (directories) => {
            if (directories === undefined) {
                return;
            }

            let data = {
                name: "Project",
                toggled: true,
                children: getChildren(directories[0])
            };

            this.setState({ treeData: data });
        });
    }
}

class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorValue: "// Write your code here...",
            treeData: {}
        };

        this.editorEvents = new EditorEvents(this);
        this.dashboardEvents = new DashboardEvents(this);
        this.treeEvents = new TreeEvents(this);
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-3 no-padding">
                        <div className="row">
                            <div className="col-xs-12">
                                {/* Dashboard Component */}
                                <DashboardComponent
                                    onOpenButtonClick={this.dashboardEvents.onOpenButtonClick}
                                />
                                {/* ------------------- */}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                {/* Tree Component */}
                                <TreeComponent
                                    data={this.state.treeData}
                                    onToggle={this.treeEvents.onToggle}
                                />
                                {/* -------------- */}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-9 no-padding">
                        {/* Dashboard Component */}
                        <EditorComponent
                            onChange={this.editorEvents.onChange}
                            value={this.state.editorValue}
                        />
                        {/* ------------------- */}

                    </div>
                </div>
            </div>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

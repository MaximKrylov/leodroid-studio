import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';
import DashboardComponent from './dboardcomp';

// Electron
const electron = window.require("electron");
const { dialog } = electron.remote;
// --------

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

class DashboardEvents {
    constructor(context) {
        this.onOpenButtonClick = this.onOpenButtonClick.bind(context);
    }

    onOpenButtonClick() {
        dialog.showOpenDialog(() => { });
    }
}

class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editorValue: "// Write your code here..."
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
                                    data={data}
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

import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';
import DashboardComponent from './dboardcomp';

import EditorEvents from '../events/editorEvents'
import DashboardEvents from '../events/dashboardEvents'
import TreeEvents from '../events/treeEvents'

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

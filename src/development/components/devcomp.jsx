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
            editorValue: "",
            openedFilePath: "",
            treeData: null,
            isProjectOpened: false
        };

        this.editorEvents = new EditorEvents(this);
        this.dashboardEvents = new DashboardEvents(this);
        this.treeEvents = new TreeEvents(this);
    }

    render() {
        let treeComponent = null;

        if (this.state.treeData) {
            treeComponent =
                <TreeComponent
                    data={this.state.treeData}
                    onToggle={this.treeEvents.onToggle}
                />;
        } else {
            treeComponent = <div></div>;
        }

        const dashboardComponent =
            <DashboardComponent
                onOpenButtonClick={this.dashboardEvents.onOpenButtonClick}
                isProjectOpened={this.state.isProjectOpened}
            />;

        const editorComponent =
            <EditorComponent
                onChange={this.editorEvents.onChange}
                onLoad={this.editorEvents.onLoad}
                value={this.state.editorValue}
            />;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-3 no-padding side-bar">
                        <div className="row">
                            <div className="col-xs-12">{dashboardComponent}</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">{treeComponent}</div>
                        </div>
                    </div>
                    <div className="col-xs-9 no-padding">{editorComponent}</div>
                </div>
            </div>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

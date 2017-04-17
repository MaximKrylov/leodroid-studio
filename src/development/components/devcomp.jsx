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
            isFileOpened: false,
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
                value={this.state.editorValue}
                isFileOpened={this.state.isFileOpened}
                onChange={this.editorEvents.onChange}
                onLoad={this.editorEvents.onLoad}
            />;

        return (
            <section id="layout">
                <aside id="left-side">
                    <section id="dashboard">{dashboardComponent}</section>
                    <section id="tree">{treeComponent}</section>
                </aside>
                <section id="right-side">
                    <section id="editor">{editorComponent}</section>
                    <section id="airline"></section>
                </section>
            </section>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

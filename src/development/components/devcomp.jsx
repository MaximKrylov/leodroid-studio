import React from 'react';
import ReactDOM from 'react-dom';

import EditorComponent from './edicomp';
import TreeComponent from './treecomp';
import DashboardComponent from './dboardcomp';

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

class DevelopmentComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "// Write your code here..." };
        this.onTreeNodeToggle = this.onTreeNodeToggle.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    onEditorChange(value) {
        this.setState({ value: value });
    }

    onTreeNodeToggle(node, toggled) {
        let value = this.state.value;

        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({ cursor: node });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-3 no-padding">
                        <div className="row">
                            <div className="col-xs-12">
                                <DashboardComponent/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <TreeComponent
                                    data={data}
                                    onToggle={this.onTreeNodeToggle}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-9 no-padding">
                        <EditorComponent
                            onChange={this.onEditorChange}
                            value={this.state.value}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const content = document.getElementById('devcomp');
ReactDOM.render(<DevelopmentComponent />, content);

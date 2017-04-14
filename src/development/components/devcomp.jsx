import React from 'react';
import ReactDOM from 'react-dom';
import { Treebeard } from 'react-treebeard';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/twilight';

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
        this.state = {value: "// Ololo"};
        this.onTreeNodeToggle = this.onTreeNodeToggle.bind(this);
    }

    onTreeNodeToggle(node, toggled) {
        if (this.state.cursor) {
            this.state.cursor.active = false;
        }
        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }
        this.setState({cursor: node});
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xs-3 no-padding">
                        <div className="row"></div>
                        <div className="row">
                            <div className="col-xs-12">
                                <Treebeard data={data} onToggle={this.onTreeNodeToggle} />
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-9 no-padding">
                        <AceEditor mode="javascript"
                            theme="twilight"
                            fontSize="13"
                            editorProps={{ $blockScrolling: true }}
                            width="100%"
                            height="100%"
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

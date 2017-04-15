import React from 'react';

import { Treebeard } from 'react-treebeard';

const CONFIG = {}

class TreeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Treebeard
                    // Tree properties
                    data={this.props.data}
                    onToggle={this.props.onToggle}
                />
            </div>
        );
    }
}

export default TreeComponent;

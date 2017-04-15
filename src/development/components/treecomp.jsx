import React from 'react';

import { Treebeard, decorators } from 'react-treebeard';

const CONFIG = {}

decorators.Header = (props) => {
    const style = props.style;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };
    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                {props.node.name}
            </div>
        </div>
    );
};

class TreeComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Treebeard
                    decorators={decorators}
                    // Tree properties
                    data={this.props.data}
                    onToggle={this.props.onToggle}
                />
            </div>
        );
    }
}

export default TreeComponent;

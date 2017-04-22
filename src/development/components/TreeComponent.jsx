import React from 'react';

import { Treebeard, decorators } from 'react-treebeard';

decorators.Header = (props) => {
    const style = props.style;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = { marginRight: '5px' };
    
    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle} />
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
        let treebeard =
            <Treebeard
                decorators={decorators}
                
                data={this.props.data}
                onToggle={this.props.onToggle}
            />;
            
        return (
            <div>{treebeard}</div>
        );
    }
}

export default TreeComponent;

function toggle(context, node, toggled) {
    if (context.state.cursor) {
        context.state.cursor.active = false;
    }

    node.active = true;

    if (node.children) {
        node.toggled = toggled;
    }

    context.setState({ cursor: node });
}

class TreeEvents {
    constructor(context) {
        this.onToggle = this.onToggle.bind(context);
    }

    onToggle(node, toggled) {
        toggle(this, node, toggled);
    }
}

export default TreeEvents;

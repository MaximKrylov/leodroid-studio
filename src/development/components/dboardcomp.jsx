import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';

import Dialog from 'material-ui/Dialog';

import FileFolderOpen from 'material-ui/svg-icons/file/folder-open';
import AvCallToAction from 'material-ui/svg-icons/av/call-to-action';

import injectTapEventPlugin from 'react-tap-event-plugin';

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

        injectTapEventPlugin();
    }

    handleOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        this.setState({ open: false });
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];
        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <FlatButton onClick={this.props.onOpenButtonClick} label="OPEN" icon={<FileFolderOpen />} />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <RaisedButton label="NEW" onTouchTap={this.handleOpen} icon={<AvCallToAction />} />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <Dialog
                        title="Initialize project"
                        actions={actions}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                    > You are going to initialize project. Continue? </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

export default DashboardComponent;


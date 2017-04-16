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
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';

import injectTapEventPlugin from 'react-tap-event-plugin';

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newProjectDialogOpen: false };

        this.onNewProjectDialogOpen = this.onNewProjectDialogOpen.bind(this);
        this.onNewProjectDialogClose = this.onNewProjectDialogClose.bind(this);

        injectTapEventPlugin();
    }

    onNewProjectDialogOpen() {
        this.setState({ newProjectDialogOpen: true });
    };

    onNewProjectDialogClose() {
        this.setState({ newProjectDialogOpen: false });
    };

    render() {
        const newProjectDialogActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.onNewProjectDialogClose}
            />,

            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.onNewProjectDialogClose}
            />
        ];

        const openProjectButton =
            <FlatButton
                label="OPEN"
                icon={<FileFolderOpen />}
                onTouchTap={this.props.onOpenButtonClick}
            />;

        const newProjectButton =
            <RaisedButton
                label="NEW"
                onTouchTap={this.onNewProjectDialogOpen}
                icon={<AvCallToAction />}
                disabled={!this.props.isProjectOpened}
            />;

        const newProjectDialog =
            <Dialog
                title="New project"
                actions={newProjectDialogActions}
                modal={false}
                open={this.state.newProjectDialogOpen}
                onRequestClose={this.handleClose}
            > You are going to create new project. Continue?
            </Dialog>;
        
        const runButton =
            <FlatButton
                label="RUN"
                icon={<AvPlayArrow />}
                disabled={!this.props.isProjectOpened}
            />;

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {openProjectButton}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {newProjectButton}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {newProjectDialog}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {runButton}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default DashboardComponent;

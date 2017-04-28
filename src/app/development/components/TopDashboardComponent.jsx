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

class TopDashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { newProjectDialogOpened: false };

        this.onNewProjectButtonTouchTap = this.onNewProjectButtonTouchTap.bind(this);
        this.onNewProjectDialogCancelButtonTouchTap = this.onNewProjectDialogCancelButtonTouchTap.bind(this);
        this.onNewProjectDialogSubmitButtonTouchTap = this.onNewProjectDialogSubmitButtonTouchTap.bind(this);
        this.onNewProjectDialogRequestClose = this.onNewProjectDialogRequestClose.bind(this);
    }

    onNewProjectDialogCancelButtonTouchTap() {
        this.setState({
            newProjectDialogOpened: false
        });
    }

    onNewProjectDialogSubmitButtonTouchTap() {
        this.setState({
            newProjectDialogOpened: false
        });
    }

    onNewProjectButtonTouchTap() {
        this.setState({
            newProjectDialogOpened: true
        });
    }

    onNewProjectDialogRequestClose() {
        this.setState({
            newProjectDialogOpened: false
        });
    }

    render() {
        let newProjectDialogActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.onNewProjectDialogCancelButtonTouchTap}
            />,

            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.onNewProjectDialogSubmitButtonTouchTap}
            />
        ];

        let openProjectButton =
            <FlatButton
                label="OPEN"
                icon={<FileFolderOpen />}
                onTouchTap={this.props.onOpenButtonTouchTap}
            />;

        let newProjectButton =
            <RaisedButton
                label="NEW"
                onTouchTap={this.onNewProjectButtonTouchTap}
                icon={<AvCallToAction />}
                disabled={this.props.newProjectButtonDisabled}
            />;

        let newProjectDialog =
            <Dialog
                title="New project"
                actions={newProjectDialogActions}
                modal={false}
                open={this.state.newProjectDialogOpened}
                onRequestClose={this.onNewProjectDialogRequestClose}
            > You are going to create new project. Continue?
            </Dialog>;

        let runButton =
            <FlatButton
                label="RUN"
                icon={<AvPlayArrow />}
                disabled={this.props.runButtonDisabled}
                onTouchTap={this.props.onRunButtonTouchTap}
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

export default TopDashboardComponent;

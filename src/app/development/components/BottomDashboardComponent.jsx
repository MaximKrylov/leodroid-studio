import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';

import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import ActionSettings from 'material-ui/svg-icons/action/settings';

const compileProjectButtonStyle = {
    width: '141.5px'
}

const settingsButtonStyle = {
    width: '141.5px'
}

class BottomDashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            settingsComponentOpened: false
        };
    }

    render() {
        let compileProjectButton =
            <FlatButton
                label="COMPILE"
                icon={<HardwareDeveloperBoard />}
                disabled={this.props.compileProjectButtonDisabled}
                style={compileProjectButtonStyle}
            />;

        let settingsButton =
            <RaisedButton
                label="SETTINGS"
                icon={<ActionSettings />}
                disabled={this.props.settingsButtonDisabled}
                style={settingsButtonStyle}
            />;

        let settingsDrawer =
            <Drawer width={300} openSecondary={true} open={this.state.settingsComponentOpened} >
                <AppBar
                    title="Settings"
                    iconElementLeft={<IconButton><ActionSettings /></IconButton>}
                />
            </Drawer>;

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {settingsButton}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {compileProjectButton}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {settingsDrawer}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default BottomDashboardComponent;

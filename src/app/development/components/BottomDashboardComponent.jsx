import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';

import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';

import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';
import ActionSettings from 'material-ui/svg-icons/action/settings';

const leodifyProjectButtonStyle = {
    width: '141.5px'
}

const settingsButtonStyle = {
    width: '141.5px'
}

const emulatorComponentDevToolsToggleButtonStyle = {
    paddingTop: 12
}

class BottomDashboardComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let leodifyProjectButton =
            <FlatButton
                label="LEODIFY C:"
                icon={<HardwareDeveloperBoard />}
                disabled={this.props.leodifyProjectButtonDisabled}
                style={leodifyProjectButtonStyle}
            />;

        let settingsButton =
            <RaisedButton
                label="SETTINGS"
                icon={<ActionSettings />}
                disabled={this.props.settingsButtonDisabled}
                onTouchTap={this.props.onSettingsButtonTouchTap}
                style={settingsButtonStyle}
            />;

        let emulatorComponentDevToolsToggleButton =
            <Toggle
                label="Emulator DevTools"
                style={emulatorComponentDevToolsToggleButtonStyle}
                toggled={this.props.emulatorComponentDevToolsToggleButtonToggled}
                onToggle={this.props.onEmulatorComponentDevToolsToggleButtonToggle}
            />

        let settingsDrawer =
            <Drawer width={300}
                docked={false}
                openSecondary={true}
                open={this.props.settingsDrawerOpened}
                onRequestChange={this.props.onSettingsDrawerRequestChange}
            >
                <AppBar title="Settings"
                    iconElementLeft={<IconButton><ActionSettings /></IconButton>}
                />
                <MenuItem>
                    {emulatorComponentDevToolsToggleButton}
                </MenuItem>
            </Drawer>;


        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {settingsButton}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {leodifyProjectButton}
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {settingsDrawer}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default BottomDashboardComponent;

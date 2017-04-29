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

const compileProjectButtonStyle = {
    width: '141.5px'
}

const settingsButtonStyle = {
    width: '141.5px'
}

const emulatorComponentDevToolsToggleButtonStyle = {
    paddingTop: 10
}

class BottomDashboardComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            settingsDrawerOpened: false
        };

        this.onSettingsButtonTouchTap = this.onSettingsButtonTouchTap.bind(this);
        this.onSettingsDrawerRequestChange = this.onSettingsDrawerRequestChange.bind(this);
    }

    onSettingsButtonTouchTap() {
        this.setState({
            settingsDrawerOpened: true
        });
    }

    onSettingsDrawerRequestChange(inversesettingsDrawerOpeneded) {
        this.setState({
            settingsDrawerOpened: inversesettingsDrawerOpeneded
        });
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
                onTouchTap={this.onSettingsButtonTouchTap}
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
                open={this.state.settingsDrawerOpened}
                onRequestChange={this.onSettingsDrawerRequestChange}
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

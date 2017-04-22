import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RaisedButton from 'material-ui/RaisedButton';

import HardwareDeveloperBoard from 'material-ui/svg-icons/hardware/developer-board';

class BottomDashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const compileProjectButton =
            <RaisedButton
                label="COMPILE"
                icon={<HardwareDeveloperBoard />}
                fullWidth={true}
                disabled={this.props.compileProjectButtonDisabled}
            />;

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {compileProjectButton}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default BottomDashboardComponent;

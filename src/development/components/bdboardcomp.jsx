import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import RaisedButton from 'material-ui/RaisedButton';

class BottomDashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const deployProjectButton =
            <RaisedButton
                label="DEPLOY"
                fullWidth={true}
                disabled={!this.props.isProjectOpened}
            />;

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {deployProjectButton}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default BottomDashboardComponent;

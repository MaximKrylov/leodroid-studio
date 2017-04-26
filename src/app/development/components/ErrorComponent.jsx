import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Snackbar from 'material-ui/Snackbar';

const bodyStyle = {
    height: 'auto',
    width: '500px',
    whiteSpace: 'pre-wrap',
    lineHeight: '20px',
    padding: 20
};

class ErrorComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let errorComponent =
            <Snackbar
                open={this.props.open}
                message={this.props.message}
                onRequestClose={this.props.onRequestClose}
                bodyStyle={bodyStyle}
            />;

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    {errorComponent}
                </MuiThemeProvider>
            </div>
        );
    }
}

export default ErrorComponent;

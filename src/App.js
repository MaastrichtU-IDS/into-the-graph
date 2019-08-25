import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';

import './App.css';
import NavBar from './components/navbar';
import SparqlComponent from './components/sparql';
import DescribeComponent from './components/describe';
import DatasetsOverviewComponent from './components/datasets_overview';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

// Change theme color and typography here
const theme = createMuiTheme({
  palette: {
    // primary: blue[400],
    primary: { light: blue[300], main: blue[500], dark: blue[700] },
    secondary: green,
  },
  status: {
    danger: orange,
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontSize": 16,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
   }
});

// Routing happens here
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
          {/* <Router> */}
            <NavBar/>
            <Switch>
              <Route exact path='/' component={DatasetsOverviewComponent} />
              <Route exact path='/sparql' component={SparqlComponent} />
              <Route exact path='/describe' component={DescribeComponent} />
            </Switch>
          {/* </Router> */}
          </BrowserRouter>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default (App);

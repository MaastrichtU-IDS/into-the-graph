import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import NavBar from './components/navbar';
import SparqlComponent from './components/sparql';
import DescribeComponent from './components/describe';
import DatasetsOverviewComponent from './components/datasets_overview';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

// Change theme color and typography here
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    "fontSize": 18,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
   }
});

// Using Typography with p and span still leads to DejaVu Sans font...
// They had one job...
theme.typography.span = {
  fontFamily: 'Open Sans'
};
theme.typography.p = {
  fontFamily: 'Open Sans'
};

// Routing happens here
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <Router>
            <NavBar/>
            <Switch>
              <Route exact path='/' component={DatasetsOverviewComponent} />
              <Route path='/sparql' component={SparqlComponent} />
              <Route path='/describe' component={DescribeComponent} />
            </Switch>
          </Router>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;

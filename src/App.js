import React, { Component } from 'react';
//import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import NavBar from './components/navbar';
import SparqlComponent from './components/sparql';
import DescribeComponent from './components/describe';

// Routing happens here
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <NavBar/>
          <Switch>
            <Route exact path='/' component={SparqlComponent} />
            <Route path='/sparql' component={SparqlComponent} />
            <Route path='/describe' component={DescribeComponent} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom'

import App from './App';
import SparqlComponent from './components/sparql';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render((
  <BrowserRouter>
    <Route path="/" exact component={App}/>
    <Route path="/sparql" component={SparqlComponent}/>
    <Route path="/describe" component={App}/>
  </BrowserRouter>
  ),
  document.getElementById('root')
);

// ReactDOM.render(
//  <App />,
//  document.getElementById('root')
// );

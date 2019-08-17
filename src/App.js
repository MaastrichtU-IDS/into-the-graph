import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Router, browserHistory } from 'react-router';

import logo from './logo.svg';
import './App.css';
import NavBar from './components/navbar';
import routes from './routes';

// ReactDom.render(  //  try to put routes here
//   <Router history={browserHistory} routes={routes} />,
//   document.querySelector('#app')
// );

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar/>
        <p>Nothing to see</p>
      </div>
    );
  }
}

export default App;

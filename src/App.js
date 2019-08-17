import React, { Component } from 'react';
//import ReactDOM from 'react-dom';

import './App.css';
import NavBar from './components/navbar';

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

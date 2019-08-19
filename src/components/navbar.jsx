import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
 
class NavBar extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/">rdf-graph-explorer</Navbar.Brand>
            <Nav className="mr-auto">
            <Link to="/">Home</Link>
            <Link to="/sparql">SPARQL</Link>
            <Link to="/describe">Describe</Link>
            </Nav>
        </Navbar>
      </React.Fragment>
    );
  }
}
 
export default NavBar;
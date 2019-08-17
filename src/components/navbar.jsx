import React, { Component } from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
 
class NavBar extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/">rdf-graph-explorer</Navbar.Brand>
            <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/sparql">SPARQL</Nav.Link>
            <Nav.Link href="/describe">Describe</Nav.Link>
            </Nav>
        </Navbar>
      </React.Fragment>
    );
  }
}
 
export default NavBar;
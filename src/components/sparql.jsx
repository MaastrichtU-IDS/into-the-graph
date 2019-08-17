import React, { Component } from "react";
import NavBar from './navbar'; 
 
class Sparql extends Component {
  render() {
    return (
      <div className="Sparql">
        <NavBar/>
        <p>
          This is the sparql me page.
        </p>
      </div>
    );
  }
}
 
export default Sparql;
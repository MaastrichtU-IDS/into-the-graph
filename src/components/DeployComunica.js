import React, { Component } from "react";
import TriplestoreContext from '../TriplestoreContext';

class DeployComunica extends Component {
  static contextType = TriplestoreContext;
  
  render () {
    return <iframe src={this.context.triplestore.comunica_url}
        width="100%"
        height='89%'
        scrolling="yes" 
        frameBorder="0"
      />
  }
}
export default (DeployComunica);
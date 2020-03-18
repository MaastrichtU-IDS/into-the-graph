import React, { Component } from "react";
import TriplestoreContext from '../TriplestoreContext';

class DeployFilebrowser extends Component {
  static contextType = TriplestoreContext;
  
  render () {
    // const { classes } = this.props;
    return <iframe url={this.context.triplestore.filebrowser_url}
        width="100%"
        // TODO: properly fix height to avoid double scroll
        height='89%'
        scrolling="yes" 
        frameBorder="0"/>
  }
}
export default (DeployFilebrowser);
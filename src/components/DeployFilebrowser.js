import React, { Component } from "react";

var Config = require('Config')

class DeployFilebrowser extends Component {
  
  render () {
    // const { classes } = this.props;
    return <iframe url={Config.download_filebrowser_url}
        width="100%"
        // TODO: properly fix height to avoid double scroll
        height='89%'
        scrolling="yes" 
        frameBorder="0"/>
  }
}
export default (DeployFilebrowser);
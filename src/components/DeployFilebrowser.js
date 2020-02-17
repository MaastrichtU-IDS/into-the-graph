import React, { Component } from "react";
import Iframe from 'react-iframe'

var Config = require('Config')

class DeployFilebrowser extends Component {
  
  render () {
    // const { classes } = this.props;
    return <Iframe url={Config.download_filebrowser_url}
      width="100%"
      // TODO: properly fix height to avoid double scroll
      height="200%"
      id="iFrameFilebrowser"
      className="iFrameFilebrowser"
      display="initial"
      position="relative"
      scrolling="no" 
      frameBorder="0"/>
  }
}
export default (DeployFilebrowser);
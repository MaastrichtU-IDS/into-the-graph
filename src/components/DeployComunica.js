import React, { Component } from "react";
import Iframe from 'react-iframe'

var Config = require('Config')

class DeployComunica extends Component {
  
  render () {
    // const { classes } = this.props;
    return <Iframe url={Config.comunica_url}
      width="100%"
      // TODO: properly fix height to avoid double scroll
      height="180%"
      id="iFrameComunica"
      className="iFrameComunica"
      display="initial"
      position="relative"
      scrolling="no" 
      frameBorder="0"/>
  }
}
export default (DeployComunica);
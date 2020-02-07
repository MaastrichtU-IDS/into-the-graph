import React, { Component } from "react";
import Iframe from 'react-iframe'

var Config = require('Config')

class DeploySwaggerApi extends Component {
  
  render () {
    // const { classes } = this.props;
    return <Iframe url={Config.swagger_api_url}
      width="100%"
      // TODO: properly fix height to avoid double scroll
      height="900%"
      id="iFrameSwaggerApi"
      className="iFrameSwaggerApi"
      display="initial"
      position="relative"
      scrolling="no" 
      frameBorder="0"/>
  }
}
export default (DeploySwaggerApi);
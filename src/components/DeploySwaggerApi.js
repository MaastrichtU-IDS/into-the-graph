import React, { Component } from "react";
// import IframeResizer from 'react-iframe-resizer-super'
// import IframeResizer from 'iframe-resizer-react'
// import Iframe from 'react-iframe'

var Config = require('Config')

class DeploySwaggerApi extends Component {

  render() {
    // const { classes } = this.props;
    return <iframe 
        src={Config.swagger_api_url}
        // TODO: find ideal fix to resize iframe dynamically with content? 
        // iFrameResizer didn't work
        width='100%'
        height='800%'
        scrolling='no' 
        frameBorder='0'
      />;
  }

  //   return <IframeResizer 
  //      heightCalculationMethod="bodyScroll"
  //      src={Config.swagger_api_url}
  //     //  style={{ height: '100%', width:'100%' }}
  //     //  iframeResizerOptions={{ checkOrigin: false }}
  //     />
}
export default (DeploySwaggerApi);
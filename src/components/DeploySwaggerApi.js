import React, { Component } from "react";
// import { withStyles } from '@material-ui/styles';
// import IframeResizer from 'react-iframe-resizer-super'
// import IframeResizer from 'iframe-resizer-react'
// import Iframe from 'react-iframe'

var Config = require('Config')

// const styles = theme => ({
//   offset: theme.mixins.toolbar.minHeight,
// })

class DeploySwaggerApi extends Component {

  render() {
    // const { classes } = this.props;
    // return <iframe style={{height: 'calc(100% - ' + styles.offset + ')'}}
    return <iframe
        src={Config.swagger_api_url}
        // TODO: find ideal fix to resize iframe dynamically with content? 
        // iFrameResizer didn't work
        width='100%'
        // height='100%'
        height='89%'
        scrolling='yes' 
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
// export default withStyles(styles) (DeploySwaggerApi);
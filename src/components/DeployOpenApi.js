import React, { Component } from "react";
import TriplestoreContext from '../TriplestoreContext';

// import { withStyles } from '@material-ui/styles';
// import IframeResizer from 'react-iframe-resizer-super'
// import IframeResizer from 'iframe-resizer-react'
// import Iframe from 'react-iframe'

// const styles = theme => ({
//   offset: theme.mixins.toolbar.minHeight,
// })

class DeployOpenApi extends Component {
  static contextType = TriplestoreContext;

  render() {
    // const { classes } = this.props;
    // return <iframe style={{height: 'calc(100% - ' + styles.offset + ')'}}
    return <iframe
        src={this.context.triplestore.openapi_url}
        // TODO: find ideal fix to resize iframe dynamically with content? 
        // iFrameResizer didn't work
        width='100%'
        height='100%'
        scrolling='yes' 
        frameBorder='0'
      />;
  } 

  //   return <IframeResizer 
  //      heightCalculationMethod="bodyScroll"
  //      src={Config.openapi_url}
  //     //  style={{ height: '100%', width:'100%' }}
  //     //  iframeResizerOptions={{ checkOrigin: false }}
  //     />
}
export default (DeployOpenApi);
// export default withStyles(styles) (DeployOpenApi);
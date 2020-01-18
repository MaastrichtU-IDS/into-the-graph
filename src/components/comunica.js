// import * as React from "react";
// import * as Iframe from "react-iframe";

import React, { Component } from "react";
import Iframe from 'react-iframe'

var Config = require('Config');

// export interface ComunicaProps { compiler: string; framework: string; }
// export class Comunica extends React.Component<ComunicaProps, {}> {
  
class Comunica extends Component {
  
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
      frameBorder="0" />
  }
}
export default (Comunica);
import React, { Component } from "react";

var Config = require('Config')

class DeployComunica extends Component {
  
  render () {
    return <iframe src={Config.comunica_url}
        width="100%"
        height='89%'
        scrolling="yes" 
        frameBorder="0"
      />
  }
}
export default (DeployComunica);
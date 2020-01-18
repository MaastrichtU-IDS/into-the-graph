import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Iframe from 'react-iframe'

const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
  }
})

class Comunica extends Component {
  state = {}
  
  componentDidMount() { }

  render () {
    // const { classes } = this.props;
    return <Iframe url="http://query.linkeddatafragments.org/"
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
export default withStyles(styles)(Comunica);
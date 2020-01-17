import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
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
    const { classes } = this.props;
    return <Iframe url="http://query.linkeddatafragments.org/"
    width="100%"
    height="70%"
    id="myId"
    className="myClassname"
    display="initial"
    position="relative"/>
  }
}
export default withStyles(styles)(Comunica);
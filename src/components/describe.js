import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
 
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
 
const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  }
})

class Describe extends Component {
  params = new URLSearchParams(location.search);

  componentDidMount() {
    console.log(this.params.get('uri'));
  }
  render () {
    return <Container>
        <Typography component="p">
          This is the describe me page.
          {this.params.get("uri")}
        </Typography >
      </Container>
  }
}
 
export default withStyles(styles)(Describe);

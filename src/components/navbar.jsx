import React, { Component } from "react";
import Typography from '@material-ui/core/Typography'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { makeStyles, mergeClasses } from '@material-ui/styles';

import {AppBar, Toolbar, Button} from '@material-ui/core';

// const useStyles = makeStyles(theme => ({
//   flexGrow: {
//     flexGrow: 1
//   }
// }));
 
class NavBar extends Component {
  // const classes = useStyles();
  
  render() {
    return (
      <React.Fragment>
        <AppBar title="rdf-graph-explorer" position="static">
          <Toolbar>
            <Link to="/">
              <Button color="inherit">
                Home
              </Button>
            </Link>
            <div className="flexGrow"></div>
            <Link to="/describe">
              <Button variant="h6">
                Describe
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}
 
export default NavBar;
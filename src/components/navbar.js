import React, { Component } from "react";
import Typography from '@material-ui/core/Typography'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { makeStyles, mergeClasses } from '@material-ui/styles';

import {AppBar, Toolbar, Button} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  whiteColor: {
    // background: '#fafafa'
    color: '#fafafa'
  }
}));
 
export default function NavBar() {
   const classes = useStyles();
  
    return (
      <React.Fragment>
        <AppBar title="rdf-graph-explorer" position="static">
          <Toolbar>
            <Link to="/">
              <Button className={classes.whiteColor}>
                Home
              </Button>
            </Link>
            <Link to="/sparql">
              <Button className={classes.whiteColor}>
                SPARQL
              </Button>
            </Link>
            <Link to="/describe">
              <Button className={classes.whiteColor}>
                Describe
              </Button>
            </Link>
            <div className="flexGrow"></div>
            <Link to="http://github.com/MaastrichtU-IDS/into-the-graph" target="_blank">
              <Button className={classes.whiteColor} target="_blank"
              href="https://github.com/MaastrichtU-IDS/into-the-graph">
                Source on GitHub
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  
}
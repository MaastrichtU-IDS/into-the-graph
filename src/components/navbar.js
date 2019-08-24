import React, { Component } from "react";
import Typography from '@material-ui/core/Typography'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { makeStyles, mergeClasses } from '@material-ui/styles';

import {AppBar, Toolbar, Button} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles(theme => ({
  menuButton: {
    // background: '#fafafa'
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em'
  }
}));
 
export default function NavBar() {
   const classes = useStyles();
  
    return (
      <React.Fragment>
        <AppBar title="rdf-graph-explorer" position="static">
          <Toolbar>
            <Link to="/">
              <Button className={classes.menuButton}>
              <Icon>home</Icon>
                &nbsp;Home
              </Button>
            </Link>
            <Link to="/sparql">
              <Button className={classes.menuButton}>
                <Icon>share</Icon>
                &nbsp;Run SPARQL queries
              </Button>
            </Link>
            <Link to="/describe">
              <Button className={classes.menuButton}>
                <Icon>search</Icon>
                &nbsp;Describe URIs
              </Button>
            </Link>
            <div className="flexGrow"></div>
            <Link to="http://github.com/MaastrichtU-IDS/into-the-graph" target="_blank">
              <Button className={classes.menuButton} target="_blank"
              href="https://github.com/MaastrichtU-IDS/into-the-graph">
                <Icon>code</Icon>
                &nbsp;Source on GitHub
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  
}
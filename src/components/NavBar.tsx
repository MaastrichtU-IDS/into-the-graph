import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import GitHubIcon from '@material-ui/icons/GitHub';
import SearchIcon from '@material-ui/icons/Search';
import ExploreIcon from '@material-ui/icons/Explore';

// import iconImage from '../../assets/icon.png';

// import { AuthButton, Value } from '@solid/react';

const useStyles = makeStyles(theme => ({
  menuButton: {
    color: theme.palette.common.white
  },
  solidButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    borderRadius: '6px',
    // boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
    padding: '7px 14px',
    '&:hover': {  
      backgroundColor: theme.palette.primary.dark,
      cursor: 'pointer'
    }
  },
  linkButton: {
    textTransform: 'none',
    textDecoration: 'none'
  },
  linkLogo: {
    // Seems to fit the 48px navbar height...
    // height: '48px',
    alignItems: 'center',
    display: 'flex',
  },
}))
  
export default function NavBar() {
  const classes = useStyles();

  return (
    <AppBar title="" position='static'>
      <Toolbar variant='dense'>
        <Link to="/" className={classes.linkButton}>
          {/* <img src={iconImage} style={{height: '2em', width: '2em', marginRight: '10px'}} alt="Logo" /> */}
          <Tooltip title='Into the Graph homepage'>
            <Button className={classes.menuButton}>
              <ExploreIcon />&nbsp;Into the graph
            </Button>
          </Tooltip>  
        </Link>
        <Link to="/describe?uri=http://bio2rdf.org/clinicaltrials:NCT00209495&endpoint=https://bio2rdf.org/sparql" className={classes.linkButton}>
          <Tooltip title='Describe an URI in a SPARQL endpoint'>
            <Button className={classes.menuButton}>
              <SearchIcon />&nbsp;Describe URI
            </Button>
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>
        {/* <a href="https://github.com/MaastrichtU-IDS/into-the-graph" 
            target="_blank" rel="noopener noreferrer" className={classes.linkButton}>
          <Tooltip title='External link'>
            <Button className={classes.menuButton}>
              <AssignmentIcon />
              &nbsp;Import report
            </Button>
          </Tooltip>
        </a> */}
        {/* <Tooltip title='Go to IDS Best Practices documentation'>
          <Button className={classes.menuButton} target="_blank"
          href="https://maastrichtu-ids.github.io/best-practices">
            <MenuBookIcon />
          </Button>
        </Tooltip> */}
        <Tooltip  title='Go to https://github.com/MaastrichtU-IDS/into-the-graph'>
          <Button className={classes.menuButton} target="_blank"
          href="https://github.com/MaastrichtU-IDS/into-the-graph" rel="noopener noreferrer">
            <GitHubIcon />
          </Button>
        </Tooltip>
        {/* <AuthButton title='Login with SOLID' className={classes.solidButton} popup="https://inrupt.net/common/popup.html"/> */}
      </Toolbar>
    </AppBar>
  );
}
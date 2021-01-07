import React from "react";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Paper, InputBase, IconButton, Popper, Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import GitHubIcon from '@material-ui/icons/GitHub';
import SearchIcon from '@material-ui/icons/Search';
import ExploreIcon from '@material-ui/icons/Explore';
import SettingsIcon from '@material-ui/icons/Settings';

import AppContext from "./Context";
import Settings from "./Settings";

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
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  // Search box
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    // 50% of top appbar
    width: `40%`,
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    // Hardcoded width for search input
    width: '50%',
    fontSize: '14px',
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
}))
  
export default function NavBar(props: any) {
  const classes = useStyles();

  // const [context, setContext] = React.useContext(AppContext);
  // setContext("New Value")

  const [state, setState] = React.useState({
    solid_webid: '',
    search_text: '',
    describe_uri: '',
    describe_endpoint: ''
  });

  // Popper for settings
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  // Avoid conflict when async calls
  const stateRef = React.useRef(state);
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  let history = useHistory();

  // const appContext = React.useContext(AppContext);

  function submitSearch(event: any) {
    event.preventDefault();
    history.push('/describe?uri=' + state.search_text)
    // Hard reload of the page: location.reload();
  }

  function handleChange(event: any) {
    updateState({search_text: event.target.value});
  }

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
        <Link to="/describe?uri=http://bio2rdf.org/clinicaltrials:NCT00209495" className={classes.linkButton}>
          <Tooltip title='Describe an URI in a SPARQL endpoint'>
            <Button className={classes.menuButton}>
              <SearchIcon />&nbsp;Describe URI
            </Button>
          </Tooltip>
        </Link>
        <div className="flexGrow"></div>
        {/* <Tooltip title='Go to IDS Best Practices documentation'>
          <Button className={classes.menuButton} target="_blank"
          href="https://maastrichtu-ids.github.io/best-practices" rel="noopener noreferrer">
            <MenuBookIcon />
          </Button>
        </Tooltip> */}
        <Paper component="form" className={classes.paperSearch}
          onSubmit={submitSearch}
        >
          <InputBase  // https://material-ui.com/api/input-base/
            className={classes.searchInput}
            // placeholder="Search SPARQL endpoint"
            placeholder={"Search"}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'search' }}
            // fullWidth={true}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <Tooltip  title='Application settings'>
          <Button className={classes.menuButton} onClick={handleClick}>
            <SettingsIcon />
          </Button>
        </Tooltip>
        <Tooltip  title='Go to https://github.com/MaastrichtU-IDS/into-the-graph'>
          <Button className={classes.menuButton} target="_blank"
          href="https://github.com/MaastrichtU-IDS/into-the-graph" rel="noopener noreferrer">
            <GitHubIcon />
          </Button>
        </Tooltip>
        <Popper id={id} open={open} anchorEl={anchorEl}
          modifiers={{
            flip: {
              enabled: true,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },
            arrow: {
              enabled: true,
              element: anchorEl,
            },
          }}>
          <Paper elevation={4} className={classes.paperPadding}>
            <Settings />
          </Paper>
        </Popper>
        {/* <AuthButton title='Login with SOLID' className={classes.solidButton} popup="https://inrupt.net/common/popup.html"/> */}
      </Toolbar>
    </AppBar>
  );
}
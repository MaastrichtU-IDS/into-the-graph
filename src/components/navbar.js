import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from "react-router-dom";

import {AppBar, Toolbar, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';

import $ from 'jquery';

var Config = require('Config')

// import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  menuButton: {
    color: theme.palette.secondary.main,
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none',
    textDecoration: 'none',
    fontSize: '15px'
  },
  linkButton: {
    textTransform: 'none',
    textDecoration: 'none'
  },
  whiteColor: {
    color: theme.palette.secondary.main,
  },
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    fontSize: '1rem',
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
})
 
// export default function NavBar() {
class NavBar extends Component {
  state = { searchText: '' }

  constructor(props) {
    super(props);
    this.state = {
      searchText: ''
    }
  }

  // submitSearch(event){
  submitSearch  = (event) => {
    event.preventDefault();
    this.props.history.push('/describe?uri=' + this.state.searchText)
    location.reload();
  }

  handleChange = (event) => {
    this.setState({searchText: event.target.value});
  }
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AppBar title="" position='sticky'>
          <Toolbar>
            <Link to="/" className={classes.linkButton}>
              <Tooltip title="Explore the content of the triplestore and its graphs using the HCLS descriptive statistics">
                <Button className={classes.menuButton}>
                <Icon>explore</Icon>
                  &nbsp;Explore datasets
                </Button>
              </Tooltip>  
            </Link>
            <Link to={"/describe?uri=" + Config.default_describe_uri}
            className={classes.linkButton}>
              <Tooltip title="Get all informations about an URI from the triplestore">
                <Button className={classes.menuButton}>
                  <Icon>format_list_bulleted</Icon>
                  &nbsp;Describe URIs
                </Button>
              </Tooltip>
            </Link>
            <Link to="/sparql" className={classes.linkButton}>
              <Tooltip title="Query the triplestore using the YASGUI SPARQL editor">
                <Button className={classes.menuButton}>
                  <Icon>share</Icon>
                  &nbsp;Run SPARQL queries
                </Button>
              </Tooltip>
            </Link>
            <Link to="/comunica"
            className={classes.linkButton}>
              <Tooltip title="Query the triplestore and the web of Linked Data with SPARQL and GraphQL using the Comunica widget">
                <Button className={classes.menuButton}>
                  <Icon>language</Icon>
                  &nbsp;Query with Comunica
                </Button>
              </Tooltip>
            </Link>
            <div className="flexGrow"></div>
            {/* Search box */}
            <Paper component="form" className={classes.paperSearch} onSubmit={this.submitSearch}>
              <InputBase
                className={classes.input}
                placeholder="Search"
                onChange={this.handleChange}
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            {/* <Button className={classes.menuButton} target="_blank"
            href="https://github.com/MaastrichtU-IDS/into-the-graph">
              <Icon>code</Icon>
              &nbsp;GitHub
            </Button> */}
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}
export default withRouter((withStyles(styles)(NavBar))) ;
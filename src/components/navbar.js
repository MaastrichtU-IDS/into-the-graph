import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from "react-router-dom";
import TriplestoreContext from '../TriplestoreContext';

import {AppBar, Toolbar, Button} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import $ from 'jquery';

const styles = theme => ({
  menuButton: {
    color: theme.palette.secondary.main,
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none',
    textDecoration: 'none',
    fontSize: '14px'
  },
  linkButton: {
    textTransform: 'none',
    textDecoration: 'none'
  },
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    fontSize: '14px',
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
})
 
// export default function NavBar() {
class NavBar extends Component {
  state = { searchText: '' }

  static contextType = TriplestoreContext;

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
          <Toolbar variant='dense'>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              // onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" className={classes.linkButton}>
              <Tooltip title="Get an overview of the content of the triplestore and its graphs using the HCLS descriptive statistics">
                <Button className={classes.menuButton}>
                <Icon>explore</Icon>
                  &nbsp;Graphs overview
                </Button>
              </Tooltip>  
            </Link>
            {/* <Link to={"/describe?uri="}
            className={classes.linkButton}>
              <Tooltip title="Get all informations about an URI from the triplestore">
                <Button className={classes.menuButton}>
                  <Icon>format_list_bulleted</Icon>
                  &nbsp;Describe URIs
                </Button>
              </Tooltip>
            </Link> */}
            <Link to="/sparql" className={classes.linkButton}>
              <Tooltip title="Query the triplestore using the YASGUI SPARQL editor">
                <Button className={classes.menuButton}>
                  <Icon>share</Icon>
                  &nbsp;SPARQL
                </Button>
              </Tooltip>
            </Link>
            {this.context.triplestore.openapi_url && ( 
              <Link to="/api"
              className={classes.linkButton}>
                <Tooltip title="A HTTP OpenAPI to easily query the different classes and concepts in the triplestore.">
                  <Button className={classes.menuButton}>
                    <Icon>http</Icon>
                    &nbsp;API
                  </Button>
                </Tooltip>
              </Link>
            )}
            {this.context.triplestore.comunica_url && ( 
              <Link to="/archives"
              className={classes.linkButton}>
                <Tooltip title="Query the triplestore graphs archives and the web of Linked Data with SPARQL and GraphQL using the Comunica widget">
                  <Button className={classes.menuButton}>
                    <Icon>unarchive</Icon>
                    &nbsp;Archives
                  </Button>
                </Tooltip>
              </Link>
            )}
            {this.context.triplestore.filebrowser_url && ( 
              <a href={this.context.triplestore.filebrowser_url}
              className={classes.linkButton} target='_blank'>
                <Tooltip title="Download RDF dumps of the triplestore graphs.">
                  <Button className={classes.menuButton}>
                    <Icon>cloud_download</Icon>
                    &nbsp;Download
                  </Button>
                </Tooltip>
              </a>
              // <Link to="/download"
              // className={classes.linkButton}>
              //   <Tooltip title="Download RDF dumps of the triplestore graphs.">
              //     <Button className={classes.menuButton}>
              //       <Icon>cloud_download</Icon>
              //       &nbsp;Download
              //     </Button>
              //   </Tooltip>
              // </Link>
            )}
            <div className="flexGrow"></div>
            {/* Search box */}
            <Paper component="form" className={classes.paperSearch} onSubmit={this.submitSearch}>
              <InputBase
                className={classes.input}
                placeholder="Search triplestore"
                onChange={this.handleChange}
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            <Link to="/settings" className={classes.linkButton}>
              <Tooltip title={this.context.triplestore.sparql_endpoint}>
                <Button className={classes.menuButton}>
                  <Icon>settings</Icon>
                </Button>
              </Tooltip>
            </Link>
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
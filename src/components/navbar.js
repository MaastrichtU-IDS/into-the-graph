import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, Link } from "react-router-dom";

import {AppBar, Toolbar, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import Icon from '@material-ui/core/Icon';

// import Typography from '@material-ui/core/Typography'

// background: '#fafafa'
const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none',
    textDecoration: 'none'
  },
  whiteColor: {
    color: '#fafafa'
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
  }

  handleChange = (event) => {
    this.setState({searchText: event.target.value});
  }
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AppBar title="into-the-graph" position='sticky'>
          <Toolbar>
            <Link to="/">
              <Button className={classes.menuButton}>
              <Icon>explore</Icon>
                &nbsp;Explore datasets
              </Button>
            </Link>
            <Link to="/sparql">
              <Button className={classes.menuButton}>
                <Icon>share</Icon>
                &nbsp;Run SPARQL queries
              </Button>
            </Link>
            <Link to="/describe?uri=http:%2F%2Fbio2rdf.org%2Fdrugbank_resource:f9e3bfa310df6a9054278bc8f2cc8c8d">
              <Button className={classes.menuButton}>
                <Icon>format_list_bulleted</Icon>
                &nbsp;Describe URIs
              </Button>
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
            <Button className={classes.menuButton} target="_blank"
            href="https://github.com/MaastrichtU-IDS/into-the-graph">
              <Icon>code</Icon>
              &nbsp;GitHub
            </Button>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}  export default withRouter((withStyles(styles)(NavBar))) ;
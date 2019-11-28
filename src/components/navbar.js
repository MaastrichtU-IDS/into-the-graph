import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, BrowserRouter as Redirect, Link } from "react-router-dom";

import {AppBar, Toolbar, Button, Grid,
  Input, InputLabel, InputAdornment, TextField} from '@material-ui/core';

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import Icon from '@material-ui/core/Icon';
// import SearchBar from 'material-ui-search-bar'

// import React, { Component } from "react";
// import Typography from '@material-ui/core/Typography'

// background: '#fafafa'
const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  },
  whiteColor: {
    color: '#fafafa'
  },
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    // width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
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
    // const searchText = this.state.searchText;
    console.log('submitted');
    console.log(this.state.searchText);
    // const searchText = this.refs.searchText.value;
    console.log(event);
    this.props.history.push('/describe?uri=' + this.state.searchText)
    // return <Redirect to='/describe?uri=http:%2F%2Fidentifiers.org%2FHGNC:4601'/>
  }

  handleChange = (event) => {
    this.setState({searchText: event.target.value});
  }
  
  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <AppBar title="linked-data-browser" position="static">
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
            <Link to="/describe?uri=http:%2F%2Fidentifiers.org%2FHGNC:4600">
              <Button className={classes.menuButton}>
                <Icon>format_list_bulleted</Icon>
                &nbsp;Describe URIs
              </Button>
            </Link>
            <div className="flexGrow"></div>

              {/* <Icon>search</Icon> */}
              {/* <TextField onChange={this.handleChange} label="Search" color='secondary' /> */}
            <Paper component="form" className={classes.paperSearch}>
              <InputBase
                className={classes.input}
                placeholder="Search URI"
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="submit" className={classes.iconButton} aria-label="search">
                <SearchIcon />
              </IconButton>
            </Paper>
            {/* <div className={classes.menuButton}>
              <Grid container alignItems="flex-end">
                <Grid item>
                  <Icon>search</Icon>
                </Grid>
                <Grid item>
                  <form noValidate autoComplete="off" onSubmit={this.submitSearch} >
                    <TextField onChange={this.handleChange} label="Search"
                    color='secondary' // White when focus
                    className={classes.whiteColor}
                    InputLabelProps={{
                      className: classes.whiteColor
                    }}
                    InputProps={{
                      className: classes.whiteColor
                    }} />
                  </form>
                </Grid>
              </Grid>
            </div> */}
              {/* <TextField onChange={this.handleChange} placeholder="Search" /> */}
              {/* value={this.state.value} */}
            {/* <SearchBar
              // onChange={(e) => this.setState(e.target.value)}
              // onRequestSearch={() => {return <Redirect to='/describe?uri=http:%2F%2Fidentifiers.org%2FHGNC:4601'/>}}
              onRequestSearch={(value) => this.props.history.push('/describe?uri=' + value)}
              // onRequestSearch={() => console.log(this.props)}
              style={{
                margin: '0 auto',
                maxWidth: 800
              }}
            /> */}
            <Button className={classes.menuButton} target="_blank"
            href="https://github.com/MaastrichtU-IDS/linked-data-browser">
              <Icon>code</Icon>
              &nbsp;Source on GitHub
            </Button>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}  export default withRouter((withStyles(styles)(NavBar))) ;
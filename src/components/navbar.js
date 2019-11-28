import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter, BrowserRouter as Redirect, Link } from "react-router-dom";

import {AppBar, Toolbar, Button, 
  Input, InputLabel, InputAdornment, TextField} from '@material-ui/core';
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
  }
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
                {/* <Icon>search</Icon> */}
                <Icon>format_list_bulleted</Icon>
                &nbsp;Describe URIs
              </Button>
            </Link>
            <div className="flexGrow"></div>
            <form noValidate autoComplete="off" onSubmit={this.submitSearch}>
              <TextField onChange={this.handleChange} placeholder="Search" />
              {/* value={this.state.value} */}
            </form>
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
import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import axios from 'axios';
 
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
 
const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  }
})

class Describe extends Component {
  params = new URLSearchParams(location.search);

  state = {datasetStat: []}

  componentDidMount() {
    axios.get(`http://graphdb.dumontierlab.com/repositories/test?query=` + this.getDescribeQuery(this.params.get('uri')))
      .then(res => {
        const datasetStat = res.data.results.bindings;
        console.log("yeaaah");
        console.log(datasetStat);
        this.setState({ datasetStat });
      })
  }

  render () {
    return <Container>
        <Typography component="p">
          This is the describe me page.
          {this.params.get("uri")}
        </Typography >
      </Container>
  }

  getDescribeQuery(uriToDescribe) {
    return encodeURIComponent(`SELECT DISTINCT ?subject ?predicate ?object ?graph WHERE {
      {
          GRAPH ?graph {
            <` + uriToDescribe + `> ?predicate ?object .
          }
      } UNION {
          GRAPH ?graph {
            ?subject ?predicate <` + uriToDescribe + `> .
          }
      } UNION {
        GRAPH ?graph {
          ?subject <` + uriToDescribe + `> ?object .
        }
      } UNION {
        GRAPH <` + uriToDescribe + `> {
          [] a ?object .
          BIND("dummy subject" AS ?subject)
          BIND("dummy predicate" AS ?predicate)
        }
      }
    } LIMIT 1000`);
  }
}
 
export default withStyles(styles)(Describe);

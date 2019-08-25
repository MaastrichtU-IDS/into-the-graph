import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import { BrowserRouter as Link, Router } from "react-router-dom";
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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

  state = {
    describeHash: {}, 
    describeGraphClasses: []
  }

  componentDidMount() {
    axios.get(`http://graphdb.dumontierlab.com/repositories/test?query=` + this.getDescribeQuery(this.params.get('uri')))
      .then(res => {
        const sparqlResultArray = res.data.results.bindings;
        let describeHash = {};
        let describeGraphClasses = [];

        // Build describe object
        // {graph1: {asSubject: {property1: [object1, object2]}, asObject: {property1: [subject1]}}}
        sparqlResultArray.forEach((sparqlResultRow, index) => {
          // SPO case. Described URI is the subject
          if (!('subject' in sparqlResultRow)) {
            if (!(sparqlResultRow.graph.value in describeHash)) {
              describeHash[sparqlResultRow.graph.value] = {asSubject: {}, asObject: {}, asPredicate: {},
              asSubjectExtra: {}, asPredicateExtra: {}, asObjectExtra: {}, showExtra: {},
              asSubjectCount: 0, asPredicateCount: 0, asObjectCount: 0};
            }
            if (!(sparqlResultRow.predicate.value in describeHash[sparqlResultRow.graph.value].asSubject)) {
              describeHash[sparqlResultRow.graph.value].asSubject[sparqlResultRow.predicate.value] = [];
              describeHash[sparqlResultRow.graph.value].asSubjectExtra[sparqlResultRow.predicate.value] = [];
              describeHash[sparqlResultRow.graph.value].showExtra[sparqlResultRow.predicate.value] = false;
            }
            if (describeHash[sparqlResultRow.graph.value].asSubject[sparqlResultRow.predicate.value].length < 5) {
              describeHash[sparqlResultRow.graph.value].asSubject[sparqlResultRow.predicate.value].push(sparqlResultRow.object.value);
            } else {
              // We store in another key the extra statements (when more than 5), to display them when asked
              describeHash[sparqlResultRow.graph.value].asSubjectExtra[sparqlResultRow.predicate.value]
              .push(sparqlResultRow.object.value);
            }
            describeHash[sparqlResultRow.graph.value].asSubjectCount++;
          }

          // OPS case. Described URI is the object
          if (!('object' in sparqlResultRow)) {
            if (!(sparqlResultRow.graph.value in describeHash)) {
              describeHash[sparqlResultRow.graph.value] = {asSubject: {}, asObject: {}, asPredicate: {},
              asSubjectExtra: {}, asPredicateExtra: {}, asObjectExtra: {}, showExtra: {},
              asSubjectCount: 0, asPredicateCount: 0, asObjectCount: 0};
            }
            if (!(sparqlResultRow.predicate.value in describeHash[sparqlResultRow.graph.value].asObject)) {
              describeHash[sparqlResultRow.graph.value].asObject[sparqlResultRow.predicate.value] = [];
              describeHash[sparqlResultRow.graph.value].asObjectExtra[sparqlResultRow.predicate.value] = [];
              describeHash[sparqlResultRow.graph.value].showExtra[sparqlResultRow.predicate.value] = false;
            }
            if (describeHash[sparqlResultRow.graph.value].asObject[sparqlResultRow.predicate.value].length < 5) {
              describeHash[sparqlResultRow.graph.value].asObject[sparqlResultRow.predicate.value].push(sparqlResultRow.subject.value);
            } else {
              describeHash[sparqlResultRow.graph.value].asObjectExtra[sparqlResultRow.predicate.value]
              .push(sparqlResultRow.subject.value);
            }
            describeHash[sparqlResultRow.graph.value].asObjectCount++;
          }

          // Described URI is the predicate (OSO?)
          if (!('predicate' in sparqlResultRow)) {
            if (!(sparqlResultRow.graph.value in describeHash)) {
              describeHash[sparqlResultRow.graph.value] = {asSubject: {}, asObject: {}, asPredicate: {},
              asSubjectExtra: {}, asPredicateExtra: {}, asObjectExtra: {}, showExtra: {},
              asSubjectCount: 0, asPredicateCount: 0, asObjectCount: 0};
            }
            if (!(sparqlResultRow.subject.value in describeHash[sparqlResultRow.graph.value].asPredicate)) {
              describeHash[sparqlResultRow.graph.value].asPredicate[sparqlResultRow.subject.value] = [];
              describeHash[sparqlResultRow.graph.value].asPredicateExtra[sparqlResultRow.subject.value] = [];
              describeHash[sparqlResultRow.graph.value].showExtra[sparqlResultRow.subject.value] = false;
            }
            if (describeHash[sparqlResultRow.graph.value].asPredicate[sparqlResultRow.subject.value].length < 5) {
              describeHash[sparqlResultRow.graph.value].asPredicate[sparqlResultRow.subject.value].push(sparqlResultRow.object.value);
            } else {
              describeHash[sparqlResultRow.graph.value].asPredicateExtra[sparqlResultRow.subject.value]
              .push(sparqlResultRow.object.value);
            }
            describeHash[sparqlResultRow.graph.value].asPredicateCount++;
          }

          // Only get classes for the graph
          if (!('graph' in sparqlResultRow)) {
            describeGraphClasses.push(sparqlResultRow.object.value);
          }
      })
      console.log('describe object:');
      console.log(describeHash);
      console.log('describe classes as graph:');
      console.log(describeGraphClasses);
      this.setState({ describeGraphClasses });
      this.setState({ describeHash });
    })
  }

  render () {
    return <Container>
        <div>
          {/* TODO: Link doesn't work without reason. It's included in Router. */}
          <Link to="/describe?uri={this.params.get('uri')}">
            <Typography variant="h4">
              {this.params.get('uri')}
            </Typography>
          </Link>
          
          {/* Following can't find 'this' */}
          {/* {Object.keys(this.state.describeHash).map(function(datasetUri, key, listDatasets){
            return <DescribeGraphPanel key={key} datasetUri={datasetUri} datasetHash={this.state.describeHash[datasetUri]}/>;
          })} */}

          {Object.keys(this.state.describeHash).map((datasetUri, key) => {
            return <DescribeGraphPanel key={key} datasetUri={datasetUri} datasetHash={this.state.describeHash[datasetUri]}/>;
          })}

          {this.state.describeGraphClasses.map(function(dataset, index){
            return <span key={index}>{dataset}</span>;
          })}
        </div>
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

// Work to generate a component:
// const DescribeGraphPanel = ({ dataset }) => <h1>
// {dataset}
// </h1>;

// Also work. But this.propos never work. 
// Apparently this is undefined. How is it even possible?
// Maybe it should be "class MyClass extends Component"?
// Or even "React,createClass"? So much choice, really handy
export function DescribeGraphPanel(props) {
  return (
    <ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
        id="panel1a-header" aria-controls="panel1a-content">
        <Typography variant="h6">{props.datasetUri}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
          sit amet blandit leo lobortis eget.
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
    // <h1>
    //   {console.log(props)}
    //   {props.datasetUri}
    // </h1>
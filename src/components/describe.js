import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { LinkDescribe } from "./link_describe";

// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { BrowserRouter } from "react-router-dom";

const styles = theme => ({
  italic: {
    fontStyle: 'italic'
  },
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  },
  noCap: {
    textTransform: 'none'
  },
  uriLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    '& :hover': {
      color: '#2196f3',
    },
  },
  alignRight: {
    textAlign: 'right'
  },
  alignLeft: {
    textAlign: 'left'
  },
  greyBackground: {
    backgroundColor: theme.palette.primary.light
    // color: 'white',
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
  divider: {
    margin: theme.spacing(1, 1),
  },
  font300: {
    fontWeight: 300
  }
})

class Describe extends Component {
  params = new URLSearchParams(location.search);

  constructor(props) {
    super(props);

    this.showMoreHandler = this.showMoreHandler.bind(this);
  }

  showMoreHandler(graphUri, propertyUri) {
    // We should set state here but how to do it properly?
    // https://stackoverflow.com/questions/43638938/updating-an-object-with-setstate-in-react
    this.state.describeHash[graphUri].showExtra[propertyUri] = true;
    console.log('showMoreHandler');
    // this.setState({
      
    // })
  }

  state = {
    describeUri: this.params.get('uri'),
    describeHash: {}, 
    describeGraphClasses: [],
    searchResults: []
  }

  // Reload page when URI change (not working)
  // static getDerivedStateFromProps(nextProps, prevState){
  //   if(nextProps.describeUri !== prevState.describeUri){
  //     return { describeUri: nextProps.describeUri};
  //   } else {
  //     return null;
  //   }
  // }
  // componentDidUpdate(prevProps, prevState) {
  //   // if(prevProps.describeUri !== this.state.describeUri){
  //   if(this.props.describeUri !== prevState.describeUri){
  //      //fetchnewProduct and set state to reload
  //     //  this.forceUpdate();
  //     console.log('staate');
  //     console.log(this.state);
  //     this.setState({
  //       describeUri: this.props.describeUri,
  //       describeHash: {}, 
  //       describeGraphClasses: []
  //     });
  //   }
  // }

  // Query SPARQL endpoint to get the URI infos
  componentDidMount() {
    // Not working:
    // this.setState({ describeUri: this.params.get('uri') });

    if (this.state.describeUri.startsWith('http')) {
      console.log('describeUri');
      console.log(this.state.describeUri);
      axios.get(`http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar?query=` + this.getDescribeQuery(this.state.describeUri))
        .then(res => {
          const sparqlResultArray = res.data.results.bindings;
          let describeHash = {};
          let describeGraphClasses = [];

          // Build describe object
          // {graph1: {asSubject: {property1: [object1, object2]}, asObject: {property1: [subject1]}}}
          sparqlResultArray.forEach((sparqlResultRow) => {
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
    } else {
      // TODO: do full text search
      axios.get(`http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar?query=` + this.getSearchQuery(this.state.describeUri))
        .then(res => {
          const sparqlResultArray = res.data.results.bindings;
          let searchResults = [];
          sparqlResultArray.forEach((sparqlResultRow) => {
            searchResults.push({
              searchUri: sparqlResultRow.searchUri.value , 
              searchLabel: sparqlResultRow.searchLabel.value
            })
          })
          this.setState({ searchResults });
        })
    }
  }

  // START HTML
  render () {
    const { classes } = this.props;
    return <Container>
        <div className='mainContainer'>
          <LinkDescribe uri={this.state.describeUri} variant='h4' passClass={classes.font300}/>
          <br/>
          {/* Iterates over results for each graphs and display them using DescribeGraphPanel */}
          {/* TODO: Warning: Each child in a list should have a unique "key" prop. Check the render method of `DescribeGraphPanel` */}
          {Object.keys(this.state.describeHash).map((datasetUri, key) => {
            return <DescribeGraphPanel key={key} classes={classes} describeUri={this.state.describeUri}
            datasetUri={datasetUri} datasetHash={this.state.describeHash[datasetUri]} showMoreHandler={this.showMoreHandler}/>;
          })}

          {/* Show classes for the described URI as a graph */}
          {this.state.describeGraphClasses.length > 0 &&
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary className={classes.greyBackground} expandIcon={<ExpandMoreIcon />}
                id="panel1a-header" aria-controls="panel1a-content">
                <Typography variant="h6">As a graph (classes)</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                  <Grid container spacing={3} alignItems="center">
                    {this.state.describeGraphClasses.map(function(dataset, index){
                      return <React.Fragment>
                        <Grid key={index} item xs={0} md={2}></Grid>
                        <Grid key={index} item xs={12} md={8}>
                          <Paper className={classes.paperPadding}>
                            <LinkDescribe variant='body2' uri={dataset}/>
                          </Paper>
                        </Grid>
                        <Grid key={index} item xs={0} md={2}></Grid>
                      </React.Fragment> 
                    })}
                  </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          }

          {/* Show results of full text search query (if not http) */}
          {this.state.searchResults.length > 0 &&
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary className={classes.greyBackground} expandIcon={<ExpandMoreIcon />}
                id="panel1a-header" aria-controls="panel1a-content">
                <Typography variant="h6">Search results</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                  <Grid container spacing={3} alignItems="center">
                    {this.state.searchResults.map(function(searchResult, index){
                      return <React.Fragment>
                        <Grid key={index} item xs={6}>
                          <Paper className={classes.paperPadding}>
                            <LinkDescribe variant='body2' uri={searchResult.searchUri}/>
                          </Paper>
                        </Grid>
                        <Grid key={index} item xs={6}>
                          <Typography variant="body2">{searchResult.searchLabel}</Typography>
                        </Grid>
                      </React.Fragment> 
                    })}
                  </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          }
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

  getSearchQuery(textToSearch) {
    return encodeURIComponent(`SELECT ?searchUri ?searchLabel WHERE {
      ?searchUri ?p ?searchLabel .
      VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .
      FILTER(isLiteral(?searchLabel))
      FILTER contains(?searchLabel, "` + textToSearch + `")
      } LIMIT 5`);
  }
  // GraphDB search index query
  // PREFIX luc: <http://www.ontotext.com/owlim/lucene#>
  // SELECT ?searchResult {
  //   ?searchResult luc:labelIndex "*` + this.searchText + `*"
  // }
} 
export default withStyles(styles)(Describe);



// Display the panels showing s,p,o for each graph 
export function DescribeGraphPanel(props) {
  const [, setValue] = React.useState(0);
  const { classes } = props;

  function showMoreStatements(propertyUri) {
    props.showMoreHandler(props.datasetUri, propertyUri, true)
    // props.datasetHash.showExtra[propertyUri] = true;
    console.log('clicked');
    // Ok apparently we cannot change state of parent component in function
    // And it doesn't pick up changes. So we will need to convert it to Component...
  }


  console.log('datasetHash before expansion panel:');
  console.log(props.datasetHash);
  // Define tab header here to hide them if no results for this tab
  return (
    <ExpansionPanel defaultExpanded>
      {console.log('in expansion panel')}
      {console.log(props)}
      {/* <ExpansionPanelSummary  color="primary" expandIcon={<ExpandMoreIcon />} */}
      <ExpansionPanelSummary className={classes.greyBackground} expandIcon={<ExpandMoreIcon />}
        id="panel1a-header" aria-controls="panel1a-content">
        <Typography variant="h6"><i>In graph </i>{props.datasetUri}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className='flexGrow'>
          <Tabs>
            <TabList>
              {props.datasetHash.asSubjectCount !== 0 && ( 
                <Tab>As subject</Tab>
              ) }
              {props.datasetHash.asPredicateCount !== 0 && ( 
                <Tab>As predicate</Tab>
              ) }
              {props.datasetHash.asObjectCount !== 0 && ( 
                <Tab>As object</Tab>
              ) }
            </TabList>

            {props.datasetHash.asSubjectCount !== 0 && ( 
              <TabPanel>
                <Grid container spacing={3} alignItems="center">
                  {console.log(props)}
                  {/* Iterate over properties in a graph */}
                  {Object.keys(props.datasetHash.asSubject).map((propertyUri, key) => {
                    let addShowMore = '';
                    // Add button to show more statements if more that 5 for same property
                    if (props.datasetHash.asSubjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] == false) {
                      addShowMore = ( <Button variant="contained" size="small" className={classes.noCap} color="primary"
                      // onClick={props.datasetHash.showExtra[propertyUri] = false}>
                      // onClick={showMoreStatements(props.datasetHash, propertyUri)}
                      onClick={() => showMoreStatements(propertyUri)}
                      >
                        Show {props.datasetHash.asSubjectExtra[propertyUri].length} statements
                      </Button>  );
                    } else if (props.datasetHash.asSubjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] == true) {
                      addShowMore = ( <Button variant="contained" size="small" className={classes.noCap} color="primary">
                        Hide {props.datasetHash.asSubjectExtra[propertyUri].length} statements
                      </Button>  );
                    }

                    // Display property / values for the described SUBJECT URI
                    return <React.Fragment>
                      <Grid key={key} item xs={6} className={classes.alignRight}>
                        <LinkDescribe variant='body2' uri={propertyUri}/>
                      </Grid>
                      <Grid item xs={6} className={classes.alignLeft}>
                        {/* loop for property values in this grid cell */}
                        <Paper className={classes.paperPadding}>
                          {Object.keys(props.datasetHash.asSubject[propertyUri]).map((valueIndex, key) => {
                            let addDivider = '';
                            if (key != 0) {
                              addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                            }
                            return <React.Fragment>
                              {addDivider}
                              <LinkDescribe variant='body2' uri={props.datasetHash.asSubject[propertyUri][valueIndex]} key={key}/>
                            </React.Fragment>
                          })}
                          {addShowMore}
                        </Paper>
                      </Grid>
                    </React.Fragment>})
                  }
                </Grid>
              </TabPanel>
            ) }

            {props.datasetHash.asPredicateCount !== 0 && ( 
              <TabPanel>
                <Grid container spacing={3} alignItems="center">
                  {console.log(props)}
                  {/* Iterate over predicates in the graph */}
                  {Object.keys(props.datasetHash.asPredicate).map((subjectUri, key) => {
                    
                    // Display subject / predicate / objects for the described PREDICATE URI
                    return <React.Fragment>
                      <Grid key={key} item xs={4} className={classes.alignRight}>
                        <Paper className={classes.paperPadding}>
                          <LinkDescribe variant='body2' uri={subjectUri}/>
                        </Paper>
                      </Grid>
                      <Grid key={key} item xs={4} >
                        <LinkDescribe variant='body2' uri={props.describeUri}/>
                      </Grid>
                      <Grid item xs={4} className={classes.alignLeft}>
                        {/* loop for property values in this grid cell */}
                        <Paper className={classes.paperPadding}>
                          {Object.keys(props.datasetHash.asPredicate[subjectUri]).map((valueIndex, key) => {
                            let addDivider = '';
                            if (key != 0) {
                              addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                            }
                            return <React.Fragment>
                              {addDivider}
                              <LinkDescribe variant='body2' uri={props.datasetHash.asPredicate[subjectUri][valueIndex]} key={key}/>
                            </React.Fragment>
                          })}
                          {/* {addShowMore} */}
                        </Paper>
                      </Grid>
                    </React.Fragment>})
                  }
                </Grid>
              </TabPanel>
            ) }

            {props.datasetHash.asObjectCount !== 0 && ( 
              <TabPanel>
                <Grid container spacing={3} alignItems="center">
                  {console.log(props)}
                  {/* Iterate over properties in a graph */}
                  {Object.keys(props.datasetHash.asObject).map((propertyUri, key) => {
                    let addShowMore = '';
                    // Add button to show more statements if more that 5 for same property
                    if (props.datasetHash.asObjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] == false) {
                      addShowMore = ( <Button variant="contained" size="small" className={classes.noCap} color="primary"
                      // onClick={props.datasetHash.showExtra[propertyUri] = false}>
                      // onClick={showMoreStatements(props.datasetHash, propertyUri)}
                      onClick={() => showMoreStatements(propertyUri)}
                      >
                        Show {props.datasetHash.asObjectExtra[propertyUri].length} statements
                      </Button>  );
                    } else if (props.datasetHash.asObjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] == true) {
                      addShowMore = ( <Button variant="contained" size="small" className={classes.noCap} color="primary">
                        Hide {props.datasetHash.asObjectExtra[propertyUri].length} statements
                      </Button>  );
                    }

                    // Display property / values for the described SUBJECT URI
                    return <React.Fragment>
                      <Grid key={key} item xs={2}>
                        <LinkDescribe variant='body2' uri={props.describeUri}/>
                      </Grid>
                      <Grid key={key} item xs={1}>
                        <span className={classes.italic}>is</span>
                      </Grid>
                      <Grid key={key} item xs={4}>
                        <Paper className={classes.paperPadding}>
                          <LinkDescribe variant='body2' uri={propertyUri}/>
                        </Paper>
                      </Grid>
                      <Grid key={key} item xs={1}>
                        <span className={classes.italic}>of</span>
                      </Grid>
                      <Grid item xs={4} className={classes.alignLeft}>
                        {/* loop for property values in this grid cell */}
                        <Paper className={classes.paperPadding}>
                          {Object.keys(props.datasetHash.asObject[propertyUri]).map((valueIndex, key) => {
                            let addDivider = '';
                            if (key != 0) {
                              addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                            }
                            return <React.Fragment>
                              {addDivider}
                              <LinkDescribe variant='body2' uri={props.datasetHash.asObject[propertyUri][valueIndex]} key={key}/>
                            </React.Fragment>
                          })}
                          {addShowMore}
                        </Paper>
                      </Grid>
                    </React.Fragment>})
                  }
                </Grid>
              </TabPanel>
            ) }
          </Tabs>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

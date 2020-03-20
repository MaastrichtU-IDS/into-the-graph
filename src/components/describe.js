import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { LinkDescribe } from "./LinkDescribe";
import Footer from './footer';
import Settings from './Settings';
import TriplestoreContext from '../TriplestoreContext';

var Config = require('Config')

const styles = theme => ({
  italic: {
    fontStyle: 'italic'
  },
  showMoreButton: {
    textTransform: 'none',
    margin: theme.spacing(2),
  },
  alignRight: {
    textAlign: 'right'
  },
  alignLeft: {
    textAlign: 'left'
  },
  greyBackground: {
    backgroundColor: theme.palette.default.main
  },
  paperPadding: {
    padding: theme.spacing(0.5, 1.5)
  },
  badgePadding: {
    padding: theme.spacing(0, 1),
  },
  loadSpinner: {
    padding: theme.spacing(10, 10),
  },
  divider: {
    margin: theme.spacing(0.3, 1),
  },
  uriLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  uriTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(2),
  },
  endpointAutocomplete: {
    margin: theme.spacing(2, 15),
    fontSize: '13px',
    // fontSize: theme.typography.fontSize,
    // fontSize: `calc(${theme.typography.fontSize} -2)`,
  }
})

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Describe extends Component {
  params = new URLSearchParams(this.props.location.search + this.props.location.hash);

  state = {
    endpointToQuery: '',
    describeUri: this.params.get('uri'),
    // providedEndpoint: this.params.get('endpoint'),
    describeHash: {}, 
    describeGraphClasses: [],
    searchResults: []
  }

  static contextType = TriplestoreContext;

  constructor(props) {
    super(props);
    this.showMoreHandler = this.showMoreHandler.bind(this);
    this.state.isLoading = true;
    this.state.requestError = false;
    this.state.openChangeEndpoint = false;
    this.state.sparql_endpoint_autocomplete = '';
    if (this.params.get('endpoint')) {
      this.state.endpointToQuery = this.params.get('endpoint')
    } 
    // else {
    //   this.state.endpointToQuery = this.context.triplestore.sparql_endpoint;
    // }
  }

  showMoreHandler(graphUri, propertyUri) {
    this.setState((state) => {
      if (state.describeHash[graphUri].showExtra[propertyUri] === true) {
        // Hide extra statements
        state.describeHash[graphUri].showExtra[propertyUri] = false;
      } else {
        state.describeHash[graphUri].showExtra[propertyUri] = true;
      }
      return {describeHash: state.describeHash};
    });
  }
  handleCloseChangeEndpoint = (event, reason) => {
    this.setState({ openChangeEndpoint: false});
  };
  doChangeEndpoint = (setTriplestore) => {
    let triplestoreConfig = this.context.triplestore;
    triplestoreConfig.sparql_endpoint = this.state.endpointToQuery;
    setTriplestore(triplestoreConfig);
    localStorage.setItem("intothegraphSettings", JSON.stringify(triplestoreConfig));
    this.setState({ openChangeEndpoint: false});
  };

  handleAutocomplete = (stateToUpdate, searchText) => {
    console.log('stateToUpdate, searchText')
    console.log(stateToUpdate)
    console.log(searchText)
    // Generate specific state key for this autocomplete
    const autocompleteStateKey = stateToUpdate + '_autocomplete';
    if (searchText && searchText.target){
      if (searchText.target.value) {
        this.setState({ [autocompleteStateKey]: searchText.target.value})
      } else {
        this.setState({ [autocompleteStateKey]: searchText.target.innerText})
      }
    } 
    else {
      // If nothing in field, we get from the context
      // const fromContext = this.context.triplestore[]
      this.setState({ [autocompleteStateKey]: this.context.triplestore[[stateToUpdate]]})
    }
  }
  // Submit change of SPARQL endpoint URL
  handleSubmit  = (event, setTriplestore) => {
    event.preventDefault();
    let triplestoreConfig = this.context.triplestore;
    triplestoreConfig.sparql_endpoint = this.state.sparql_endpoint_autocomplete;
    setTriplestore(triplestoreConfig);
    // localStorage.setItem("intothegraphSettings", JSON.stringify(triplestoreConfig));
    window.location.reload();
  }

  // Query SPARQL endpoint to get the URI infos
  componentDidMount() {
    let endpointToQuery = this.state.endpointToQuery;
    if (!this.state.endpointToQuery || 0 === this.state.endpointToQuery.length) {
      // No endpoint provided in URL, use Context API one
      endpointToQuery = this.context.triplestore.sparql_endpoint;
      this.setState({ endpointToQuery: this.context.triplestore.sparql_endpoint});
    } else if (this.state.endpointToQuery !== this.context.triplestore.sparql_endpoint) {
      // If an endpoint is provided in URL params: snackbar to propose to change settings
      this.setState({ openChangeEndpoint: true});
    } 

    // if (this.state.describeUri.startsWith('http')) {
    if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(this.state.describeUri)) {
      axios.get(endpointToQuery + `?query=` + this.getDescribeQuery(this.state.describeUri))
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
        this.setState({ describeGraphClasses });
        this.setState({ describeHash });
        this.setState({ isLoading: false });
        // console.log('State after componentDidMount in describe:');
        // console.log(this.state);
      })
      .catch(error => {
        console.log(error)
        this.setState({ requestError: true });
        this.setState({ isLoading: false });
      })
    } else {
      // Full text search
      axios.get(endpointToQuery + `?query=` + this.getSearchQuery(this.state.describeUri))
        .then(res => {
          const sparqlResultArray = res.data.results.bindings;
          let searchResults = [];
          sparqlResultArray.forEach((sparqlResultRow) => {
            searchResults.push({
              foundUri: sparqlResultRow.foundUri.value , 
              foundLabel: sparqlResultRow.foundLabel.value
            })
          })
          this.setState({ searchResults });
          this.setState({ isLoading: false });
        })
        .catch(error => {
          console.log(error)
          this.setState({ requestError: true });
          this.setState({ isLoading: false });
        })
    }
  }

  // START HTML
  render () {
    const { classes } = this.props;
    return this.state.isLoading ? <CircularProgress className={classes.loadSpinner} /> : <TriplestoreContext.Consumer>
    {({triplestore, setTriplestore}) => ( 
      <React.Fragment>
        <Container className='mainContainer'>
          {/* <div className='mainContainer'> */}
            {/* Snippet to collapse all Graphs expansion panels. Not working with MaterialUI panels */}
            {/* <div style={{textAlign: 'right'}}>
              <Button variant="contained" size="small" className={classes.showMoreButton} 
                color="primary" onClick={() => console.log('tyrtg')}>
                  color="primary" onClick={() => showMoreStatements(propertyUri)}>
                Collapse all
              </Button>
            </div> */}
            <Typography variant="h6" className={classes.uriTitle}>
              {this.state.describeUri}
            </Typography>
            <form 
              onSubmit={(event) => {
                this.handleSubmit(event, setTriplestore)}}>
              <Autocomplete
                className={classes.endpointAutocomplete}
                onChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                onInputChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                options={Settings.sparqlEndointList}
                value={this.state.endpointToQuery}
                freeSolo={true}
                includeInputInList={true}
                ListboxProps={{
                  className: classes.endpointAutocomplete,
                }}
                renderInput={params => <TextField {...params} 
                label="SPARQL endpoint URL" 
                variant="outlined" 
                size='small'
                />}
              />
            </form>
            {/* Show classes for the described URI as a graph */}
            {this.state.describeGraphClasses.length > 0 &&
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary className={classes.greyBackground} expandIcon={<ExpandMoreIcon />}
                  id="panel1a-header" aria-controls="panel1a-content">
                  <Typography variant="body2">As a graph (contains classes)</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={1} alignItems="center">
                      {this.state.describeGraphClasses.map(function(dataset, key){
                        return <React.Fragment key={key}>
                          <Grid item xs={0} md={2}></Grid>
                          <Grid item xs={12} md={8}>
                            <Paper className={classes.paperPadding}>
                              <LinkDescribe variant='body2' uri={dataset}/>
                            </Paper>
                          </Grid>
                          <Grid item xs={0} md={2}></Grid>
                        </React.Fragment> 
                      })}
                    </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            }

            {/* Iterates over results for each graphs and display them using DescribeGraphPanel */}
            {Object.keys(this.state.describeHash).map((datasetUri, key) => {
              return <DescribeGraphPanel key={key} classes={classes} describeUri={this.state.describeUri}
              datasetUri={datasetUri} datasetHash={this.state.describeHash[datasetUri]} showMoreHandler={this.showMoreHandler}/>;
            })}

            {/* Show results of full text search query (if not http) */}
            {this.state.searchResults.length > 0 &&
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary className={classes.greyBackground} expandIcon={<ExpandMoreIcon />}
                  id="panel1a-header" aria-controls="panel1a-content">
                  <Typography variant="h6">Search results</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={1} alignItems="center">
                      {this.state.searchResults.map(function(searchResult, key){
                        return <React.Fragment key={key}>
                          <Grid item xs={6}>
                            <Paper className={classes.paperPadding}>
                              <LinkDescribe variant='body2' uri={searchResult.foundUri}/>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">{searchResult.foundLabel}</Typography>
                          </Grid>
                        </React.Fragment> 
                      })}
                    </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            }

            {/* Show error message (if request fails) */}
            {this.state.requestError && (
              <Paper elevation={2} className={classes.paperPadding}>
                <Typography variant="body2">
                  The request to the SPARQL endpoint failed, try to <a href="" className={classes.uriLink}>reload the page ♻️</a><br/>
                  Or&nbsp;<a href="https://addons.mozilla.org/fr/firefox/addon/cors-everywhere/" className={classes.uriLink} target='_blank'>
                    enable CORS requests</a> in your browser.
                </Typography>
              </Paper>
            )}
          {/* Snackbar to change the SPARQL endpoint if provided in URL */}
          <Snackbar open={this.state.openChangeEndpoint} 
            onClose={this.handleCloseChangeEndpoint} 
            autoHideDuration={6000}
          >
            <Alert severity="warning"
              onClose={() => {}}
              action={
                <Button color="inherit" size="small" 
                  onClick={() => this.doChangeEndpoint(setTriplestore)}
                >
                  Change Endpoint
                </Button>
              }
            >
              Do you want to change the SPARQL endpoint to use the one provided in the URL?
            </Alert>
          </Snackbar>
        </Container>
        <Footer />
      </React.Fragment>
    )}
    </TriplestoreContext.Consumer>
  }

  getDescribeQuery(uriToDescribe) {
    var describeQuery;
    if(uriToDescribe.startsWith('node')) {
      // Case it is a blank node
      uriToDescribe = "_:" + uriToDescribe
      describeQuery = `SELECT DISTINCT ?subject ?predicate ?object ?graph WHERE {
          GRAPH ?graph {
            ` + uriToDescribe + ` ?predicate ?object .
          }
        } LIMIT 1000`
    } else {
      // Regular URI
      uriToDescribe = "<" + uriToDescribe + ">"
      describeQuery = `SELECT DISTINCT ?subject ?predicate ?object ?graph WHERE {
        {
          SELECT * {
            GRAPH ?graph {
              ` + uriToDescribe + ` ?predicate ?object .
            }
          } LIMIT 1000
        } UNION {
          SELECT * {
            GRAPH ?graph {
              ?subject ?predicate ` + uriToDescribe + ` .
            }
          } LIMIT 1000
        } UNION {
          SELECT * {
            GRAPH ?graph {
              ?subject ` + uriToDescribe + ` ?object .
            }
          } LIMIT 1000
        } UNION {
          SELECT * {
            GRAPH ` + uriToDescribe + ` {
              [] a ?object .
              BIND("dummy subject" AS ?subject)
              BIND("dummy predicate" AS ?predicate)
            }
          } LIMIT 1000
        }
      }`
    }
    return encodeURIComponent(describeQuery);
  }

  getSearchQuery(textToSearch) {
    let searchQuery = this.context.triplestore.search_query;
    if (textToSearch === "") {
      // If no text provided we use a default search query to get interesting concepts 
      // in the knowledge graph. A custom default query can be set in settings.json
      let defaultSearchQuery = Config.default_search_query;
      if (defaultSearchQuery) {
        searchQuery = defaultSearchQuery;
      } else {
        // If no custom default_query defined in settings.json
        searchQuery = `SELECT ?foundUri ?foundLabel WHERE {
          ?foundUri a ?type ; ?p ?foundLabel .
          VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .
          FILTER(isLiteral(?foundLabel))
          FILTER(isIRI(?foundUri))
          } LIMIT 20`
      }
    } else if (searchQuery) {
      // If defined in settings.json
      // Results are provided through ?foundUri and ?foundLabel
      // Use $TEXT_TO_SEARCH as search variable to replace
      searchQuery = searchQuery.replace('$TEXT_TO_SEARCH', textToSearch)
    } else {
      // Default search query, if no query provided
      searchQuery = `SELECT ?foundUri ?foundLabel WHERE {
        ?foundUri ?p ?foundLabel .
        VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .
        FILTER(isLiteral(?foundLabel))
        FILTER contains(?foundLabel, "$TEXT_TO_SEARCH")
        } LIMIT 5`.replace('$TEXT_TO_SEARCH', textToSearch)
    }
    return encodeURIComponent(searchQuery);
  }
} 
export default withStyles(styles)(Describe);


// Display the panels showing s,p,o for each graph 
export function DescribeGraphPanel(props) {
  const { classes } = props;

  function showMoreStatements(propertyUri) {
    props.showMoreHandler(props.datasetUri, propertyUri, true)
  }

  // Define tab header here to hide them if no results for this tab
  return (<ExpansionPanel defaultExpanded>
      <ExpansionPanelSummary className={classes.greyBackground} expandIcon={<ExpandMoreIcon />}
        id="panel1a-header" aria-controls="panel1a-content">
      <Typography variant="body2" onClick={event => event.stopPropagation()} style={{userSelect: 'text', cursor: 'text'}}><i>In graph </i>{props.datasetUri}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className='flexGrow'>
          <Tabs>
            <TabList>
              {props.datasetHash.asSubjectCount !== 0 && ( 
                <Tab>
                  <Badge className={classes.badgePadding} color="primary" badgeContent={props.datasetHash.asSubjectCount}>
                    <Typography variant="body2">As subject</Typography>
                  </Badge>
                </Tab>
              ) }
              {props.datasetHash.asPredicateCount !== 0 && ( 
                <Tab>
                  <Badge className={classes.badgePadding} color="primary" badgeContent={props.datasetHash.asPredicateCount}>
                    <Typography variant="body2">As predicate</Typography>
                  </Badge>
                </Tab>
              ) }
              {props.datasetHash.asObjectCount !== 0 && (
                <Tab>
                  <Badge className={classes.badgePadding} color="primary" badgeContent={props.datasetHash.asObjectCount}>
                    <Typography variant="body2">As object</Typography>
                  </Badge>
                </Tab>
              ) }
            </TabList>

            {props.datasetHash.asSubjectCount !== 0 && ( 
              <TabPanel>
                <Grid container spacing={1} alignItems="center">
                  {/* Iterate over properties in a graph */}
                  {Object.keys(props.datasetHash.asSubject).map((propertyUri, key) => {
                    let addShowMore = '';
                    // Add button to show more statements if more that 5 for same property
                    if (props.datasetHash.asSubjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] === false) {
                      addShowMore = ( <Button variant="contained" size="small" className={classes.showMoreButton} 
                      color="primary" onClick={() => showMoreStatements(propertyUri)}>
                        Show {props.datasetHash.asSubjectExtra[propertyUri].length} more statements
                      </Button>  );

                    } else if (props.datasetHash.asSubjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] === true) {
                      // Show extra statements
                      addShowMore = ( <React.Fragment>
                        <Button variant="contained" size="small" className={classes.showMoreButton}
                        color="primary" onClick={() => showMoreStatements(propertyUri)}>
                          Hide {props.datasetHash.asSubjectExtra[propertyUri].length} statements
                        </Button>
                        {/* Use the same snippet as for regular display */}
                        {Object.keys(props.datasetHash.asSubjectExtra[propertyUri]).map((valueIndex, key) => {
                          let addDivider = '';
                          if (key !== 0) {
                            addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                          }
                          return <React.Fragment key={key}>
                            {addDivider}
                            <LinkDescribe variant='body2' uri={props.datasetHash.asSubjectExtra[propertyUri][valueIndex]}/>
                          </React.Fragment>
                        })}
                        <Button variant="contained" size="small" className={classes.showMoreButton} 
                        color="primary" onClick={() => showMoreStatements(propertyUri)}>
                          Hide {props.datasetHash.asSubjectExtra[propertyUri].length} statements
                        </Button>
                      </React.Fragment>  );
                    }

                    // Display property / values for the described SUBJECT URI
                    return <React.Fragment key={key}>
                      <Grid item xs={6} className={classes.alignRight}>
                        <LinkDescribe variant='body2' uri={propertyUri}/>
                      </Grid>
                      <Grid item xs={6} className={classes.alignLeft}>
                        {/* loop for property values in this grid cell */}
                        <Paper className={classes.paperPadding}>
                          {Object.keys(props.datasetHash.asSubject[propertyUri]).map((valueIndex, key) => {
                            let addDivider = '';
                            if (key !== 0) {
                              addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                            }
                            return <React.Fragment key={key}>
                              {addDivider}
                              <LinkDescribe variant='body2' uri={props.datasetHash.asSubject[propertyUri][valueIndex]}/>
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
                <Grid container spacing={1} alignItems="center">
                  {/* Iterate over predicates in the graph */}
                  {Object.keys(props.datasetHash.asPredicate).map((subjectUri, key) => {
                    
                    // Display subject / predicate / objects for the described PREDICATE URI
                    return <React.Fragment key={key}>
                      <Grid item xs={4} className={classes.alignRight}>
                        <Paper className={classes.paperPadding}>
                          <LinkDescribe variant='body2' uri={subjectUri}/>
                        </Paper>
                      </Grid>
                      <Grid item xs={4} >
                        <LinkDescribe variant='body2' uri={props.describeUri}/>
                      </Grid>
                      <Grid item xs={4} className={classes.alignLeft}>
                        {/* loop for property values in this grid cell */}
                        <Paper className={classes.paperPadding}>
                          {Object.keys(props.datasetHash.asPredicate[subjectUri]).map((valueIndex, key) => {
                            let addDivider = '';
                            if (key !== 0) {
                              addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                            }
                            return <React.Fragment key={key}>
                              {addDivider}
                              <LinkDescribe variant='body2' uri={props.datasetHash.asPredicate[subjectUri][valueIndex]}/>
                            </React.Fragment>
                          })}
                        </Paper>
                      </Grid>
                    </React.Fragment>})
                  }
                </Grid>
              </TabPanel>
            ) }

            {props.datasetHash.asObjectCount !== 0 && ( 
              <TabPanel>
                <Grid container spacing={1} alignItems="center">
                  {/* Iterate over properties in a graph */}
                  {Object.keys(props.datasetHash.asObject).map((propertyUri, key) => {
                    let addShowMore = '';
                    // Add button to show more statements if more that 5 for same property
                    if (props.datasetHash.asObjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] === false) {
                      addShowMore = ( <Button variant="contained" size="small" className={classes.showMoreButton} 
                      color="primary" onClick={() => showMoreStatements(propertyUri)}>
                        Show {props.datasetHash.asObjectExtra[propertyUri].length} more statements
                      </Button>  );

                    } else if (props.datasetHash.asObjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] === true) {
                      // Show extra statements
                      addShowMore = ( <React.Fragment>
                        <Button variant="contained" size="small" className={classes.showMoreButton}
                        color="primary" onClick={() => showMoreStatements(propertyUri)}>
                          Hide {props.datasetHash.asObjectExtra[propertyUri].length} statements
                        </Button>
                        {/* Use the same snippet as for regular display */}
                        {Object.keys(props.datasetHash.asObjectExtra[propertyUri]).map((valueIndex, key) => {
                          let addDivider = '';
                          if (key !== 0) {
                            addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                          }
                          return <React.Fragment key={key}>
                            {addDivider}
                            <LinkDescribe variant='body2' uri={props.datasetHash.asObjectExtra[propertyUri][valueIndex]}/>
                          </React.Fragment>
                        })}
                        <Button variant="contained" size="small" className={classes.showMoreButton} 
                        color="primary" onClick={() => showMoreStatements(propertyUri)}>
                          Hide {props.datasetHash.asObjectExtra[propertyUri].length} statements
                        </Button>
                      </React.Fragment>  );
                    }

                    // Display property / values for the described SUBJECT URI
                    return <React.Fragment key={key}>
                      <Grid item xs={2}>
                        <LinkDescribe variant='body2' uri={props.describeUri}/>
                      </Grid>
                      <Grid item xs={1}>
                        <span className={classes.italic}>is</span>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper className={classes.paperPadding}>
                          <LinkDescribe variant='body2' uri={propertyUri}/>
                        </Paper>
                      </Grid>
                      <Grid item xs={1}>
                        <span className={classes.italic}>of</span>
                      </Grid>
                      <Grid item xs={4} className={classes.alignLeft}>
                        {/* loop for property values in this grid cell */}
                        <Paper className={classes.paperPadding}>
                          {Object.keys(props.datasetHash.asObject[propertyUri]).map((valueIndex, key) => {
                            let addDivider = '';
                            if (key !== 0) {
                              addDivider = ( <Divider variant="middle" className={classes.divider}/> );
                            }
                            return <React.Fragment key={key}>
                              {addDivider}
                              <LinkDescribe variant='body2' uri={props.datasetHash.asObject[propertyUri][valueIndex]}/>
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
import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import { BrowserRouter as Link, Router } from "react-router-dom";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { LinkDescribe } from "./link_describe";
import { ok } from "assert";

// import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { BrowserRouter } from "react-router-dom";

const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  },
  noCap: {
    textTransform: 'none'
  },
  describePanelUri: {
    fontSize: 16
  },
  uriLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    '& :hover': {
      color: '#2196f3',
    },
  },
  paper: {
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
    super(props)

    this.showMoreHandler = this.showMoreHandler.bind(this)
  }

  showMoreHandler(graphUri, propertyUri, showMore) {
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
    describeGraphClasses: []
  }

  componentDidMount() {
    // Not working:
    // this.setState({ describeUri: this.params.get('uri') });
    console.log('describeUri');
    console.log(this.state.describeUri);
    axios.get(`http://graphdb.dumontierlab.com/repositories/ncats-red-kg?query=` + this.getDescribeQuery(this.state.describeUri))
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

  // START HTML
  render () {
    const { classes } = this.props;
    return <Container>
        <div className='mainContainer'>
          <LinkDescribe uri={this.state.describeUri} variant='h4' passClass={classes.font300}/>
          <br/>
          {/* TODO: Warning: Each child in a list should have a unique "key" prop. Check the render method of `DescribeGraphPanel` */}
          {Object.keys(this.state.describeHash).map((datasetUri, key) => {
            return <DescribeGraphPanel key={key} classes={classes} describeUri={this.state.describeUri}
            datasetUri={datasetUri} datasetHash={this.state.describeHash[datasetUri]} showMoreHandler={this.showMoreHandler}/>;
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

// Display the panels showing s,p,o for each graph 
export function DescribeGraphPanel(props) {
  const [value, setValue] = React.useState(0);
  const { classes } = props;

  function showMoreStatements(propertyUri) {
    props.showMoreHandler(props.datasetUri, propertyUri, true)
    // props.datasetHash.showExtra[propertyUri] = true;
    console.log('clicked');
    // Ok apparently we cannot change state of parent component in function
    // And it doesn't pick up changes. So we will need to convert it to Component...
  }

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  return (
    <ExpansionPanel defaultExpanded>
      {console.log('in expansion panel')}
      {console.log(props)}
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}
        id="panel1a-header" aria-controls="panel1a-content">
        <Typography variant="h6">{props.datasetUri}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className='flexGrow'>
          <AppBar position="static" color="inherit">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example"
            indicatorColor="primary" textColor="primary">
              {/* <Tab className={classes.noCap} label="As subject" {...a11yProps(0)} /> */}
              <Tab className={classes.noCap} {...a11yProps(0)}
              label={<Badge className={classes.badgePadding} badgeContent={props.datasetHash.asSubjectCount} color="primary" max={999}>
                As subject
                </Badge>}/>
              <Tab className={classes.noCap} {...a11yProps(1)}
              label={<Badge className={classes.badgePadding} badgeContent={props.datasetHash.asPredicateCount} color="primary" max={999}>
                As predicate
                </Badge>} />
              <Tab className={classes.noCap} {...a11yProps(2)}
              label={<Badge className={classes.badgePadding} badgeContent={props.datasetHash.asObjectCount} color="primary" max={999}>
                As object
                </Badge>} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            <Grid container spacing={3} alignItems="center">
              {console.log(props)}
              {/* Iterate over properties in a graph */}
              {Object.keys(props.datasetHash.asSubject).map((propertyUri, key) => {
                let addShowMore = '';
                if (props.datasetHash.asSubjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] == false) {
                  addShowMore = ( <Button variant="contained" size="small" className={classes.noCap} color="primary"
                  // onClick={props.datasetHash.showExtra[propertyUri] = false}>
                  // onClick={showMoreStatements(props.datasetHash, propertyUri)}
                  onClick={(e) => showMoreStatements(propertyUri)}
                  >
                    Show {props.datasetHash.asSubjectExtra[propertyUri].length} statements
                  </Button>  );
                } else if (props.datasetHash.asSubjectExtra[propertyUri].length > 0 && props.datasetHash.showExtra[propertyUri] == true) {
                  addShowMore = ( <Button variant="contained" size="small" className={classes.noCap} color="primary">
                    Hide {props.datasetHash.asSubjectExtra[propertyUri].length} statements
                  </Button>  );
                }
                return <React.Fragment>
                  <Grid item xs={4} className={classes.describePanelUri}>
                    <LinkDescribe variant='body2' uri={props.describeUri}/>
                  </Grid>
                  <Grid key={key} item xs={4} className={classes.describePanelUri}>
                    <LinkDescribe variant='body2' uri={propertyUri}/>
                  </Grid>
                  <Grid item xs={4}>
                    {/* loop for property values in this grid cell */}
                    <Paper className={classes.paper}>
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
                </React.Fragment>
              })}
            </Grid>
          </TabPanel>
          <TabPanel value={value} index={1}>
            Predicate panel
          </TabPanel>
          <TabPanel value={value} index={2}>
            Object panel
          </TabPanel>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}


// Tabs setup
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      <Box p={3}>{children}</Box>
    </Typography>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
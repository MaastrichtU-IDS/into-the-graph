import React, { Component } from "react"; 
import { withStyles } from '@material-ui/styles';
import { Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TriplestoreContext from '../TriplestoreContext';
import { FormControl, TextField, Input, InputLabel, FormHelperText } from '@material-ui/core';

import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { LinkDescribe } from "./LinkDescribe";
import Footer from './footer';

var Config = require('Config')

const styles = theme => ({
  settingsForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      marginTop: '40px'
    },
  },
  saveButton: {
    textTransform: 'none',
    margin: theme.spacing(4),
  }
})


class Settings extends Component {

  static contextType = TriplestoreContext;

  constructor(props) {
    super(props);
    this.formSparqlEndpoint = React.createRef(); 
    this.formGraphsOverview = React.createRef(); 
 }

  // handleSubmit(event) {
  handleSubmit  = (event) => {
    event.preventDefault();
    console.log('saved');
    console.log(this.formSparqlEndpoint.current.value);
    console.log(this.formGraphsOverview.current.value);
    // alert('saved alert');
    // event.preventDefault(); // Reload the page
  }

  render() {
    const { classes } = this.props;
    return (<TriplestoreContext.Consumer>
        {({triplestore, setTriplestore}) => (
          <Container>
            <form onSubmit={this.handleSubmit}>
              <FormControl className={classes.settingsForm}>
                <TextField
                  id="outlined-sparql-endpoint"
                  label="SPARQL endpoint URL"
                  defaultValue={triplestore.sparql_endpoint}
                  placeholder="SPARQL endpoint URL"
                  // onChange={handleChange}
                  variant="outlined"
                  inputRef={this.formSparqlEndpoint}
                />
                <FormHelperText id="helper-sparql-endpoint">SPARQL endpoint URL used by the into-the-graph app to resolve URIs.</FormHelperText>
                <TextField
                  id="outlined-graphs-overview"
                  label="Graphs overview query type"
                  defaultValue={triplestore.graphs_overview}
                  placeholder="Graphs overview query type"
                  variant="outlined"
                  inputRef={this.formGraphsOverview}
                />
                {/* <InputLabel htmlFor="my-input">SPARQL endpoint URL</InputLabel>
                <Input id="my-input" defaultValue={triplestore.sparql_endpoint} 
                  placeholder="SPARQL endpoint URL" variant="outlined" aria-describedby="my-helper-text" /> */}
                <FormHelperText id="helper-graphs-overview">2 possibilities: "hcls" gets only graphs described using HCLS metadata and "all" get all graphs (optimized on Virtuoso)</FormHelperText>
                <Button type="submit"
                variant="contained" size="small" 
                className={classes.saveButton} 
                // onClick={() => showMoreStatements(propertyUri)}
                color="primary" >
                  Save settings for this session  
                </Button>
              </FormControl>
            </form>
          </Container>
        )}
    </TriplestoreContext.Consumer>);
  }

  getAllGraphsQuery = `SELECT DISTINCT ?graph WHERE { GRAPH ?graph {?s ?p ?o} }`

  hclsOverviewQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>
  PREFIX dcat: <http://www.w3.org/ns/dcat#>
  PREFIX void: <http://rdfs.org/ns/void#>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  SELECT DISTINCT ?graph ?name ?description ?homepage ?dateGenerated ?statements ?entities ?properties ?classes
  WHERE {
    GRAPH ?metadataGraph {
      ?graph a void:Dataset .
      OPTIONAL {
        ?dataset a dctypes:Dataset ;
          dct:title ?name ;
          dct:description ?description ;
          foaf:page ?homepage .
        ?version dct:isVersionOf ?dataset ;
          dcat:distribution ?graph .
      }
      OPTIONAL {
        ?graph void:triples ?statements ;
          void:entities ?entities ;
          void:properties ?properties .
      }
      OPTIONAL {
        ?graph dct:created ?dateGenerated .
      }
      OPTIONAL {
        ?graph void:classPartition [
          void:class rdfs:Class ;
          void:distinctSubjects ?classes
        ] .
      }
    }
  } ORDER BY DESC(?statements)`;

  entitiesRelationsQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX bl: <http://w3id.org/biolink/vocab/>
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>
  PREFIX idot: <http://identifiers.org/idot/>
  PREFIX dcat: <http://www.w3.org/ns/dcat#>
  PREFIX void: <http://rdfs.org/ns/void#>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX void-ext: <http://ldf.fi/void-ext#>
  SELECT DISTINCT ?graph ?classCount1 ?class1 ?relationWith ?classCount2 ?class2
  WHERE {
  GRAPH ?metadataGraph {
    ?graph a void:Dataset .
    ?graph void:propertyPartition [
      void:property ?relationWith ;
      void:classPartition [
        void:class ?class1 ;
        void:distinctSubjects ?classCount1 ;
      ];
      void-ext:objectClassPartition [
      void:class ?class2 ;
      void:distinctObjects ?classCount2 ;
      ]] .
    }
  } ORDER BY DESC(?classCount1)`;
}
export default withStyles(styles) (Settings);

// Turgay snippet:
// state ={
//   number: 5,
//   data: []
// }
// The component has been loaded
// componentDidMount() {
//   this.x =6
//   setInterval(()=> {
//     const {x, state: { data, number }} = this;
//     console.log(x, data, number)
//     //const data = this.state.data;
//     data.push(number)
//     this.setState({data})
//   }, 1000)
// }
// render() {
//   const { state: { number, data }} = this;
//   return (
//     <div className="Sparql">
//       <p>
//         This is the {number} sparql me page. 
//       </p>
//       {
//         data.map(val => <p>{val}</p>)
//       }
//     </div>
//   );
// }
import React, { Component } from "react"; 
import { withStyles } from '@material-ui/styles';
import { Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import TriplestoreContext from '../TriplestoreContext';
import { FormControl, TextField, Input, InputLabel, FormHelperText } from '@material-ui/core';

import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { LinkDescribe } from "./LinkDescribe";
import Footer from './footer';

const styles = theme => ({
  settingsForm: {
    // width: '100%',
    textAlign: 'center',
    '& .MuiTextField-root': {
      margin: theme.spacing(4),
      marginTop: '40px'
    },
  },
  saveButton: {
    textTransform: 'none',
    margin: theme.spacing(4),
  },
  formWidth: {
    minWidth: '600px'
  },
  alignCenter: {
    textAlign: 'center'
  }
})

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Settings extends Component {

  static contextType = TriplestoreContext;
  state = {open: false};

  constructor(props) {
    super(props);
    this.formSparqlEndpoint = React.createRef(); 
    this.formGraphsOverview = React.createRef(); 
    this.formOpenapiUrl = React.createRef(); 
    this.formComunicaUrl = React.createRef(); 
    this.formFilebrowserUrl = React.createRef(); 
    this.formSearchQuery = React.createRef(); 
 }

  handleClose = (event, reason) => {
    this.setState({ open: false});
  };

  // handleSubmit  = (event) => {
  handleSubmit  = (event, setTriplestore) => {
    event.preventDefault();
    console.log('saved');
    console.log(this.formSparqlEndpoint.current.value);
    console.log(this.formGraphsOverview.current.value);
    setTriplestore({
      sparql_endpoint: this.formSparqlEndpoint.current.value, 
      graphs_overview: this.formGraphsOverview.current.value,
      openapi_url: this.formOpenapiUrl.current.value, 
      comunica_url: this.formComunicaUrl.current.value,
      filebrowser_url: this.formFilebrowserUrl.current.value, 
      search_query: this.formSearchQuery.current.value, 
    });
    this.setState({ open: true });
    // alert('saved alert');
  }

  render() {
    const { classes } = this.props;
    return (<TriplestoreContext.Consumer>
        {({triplestore, setTriplestore}) => (
          <React.Fragment>
            <Container >
              <form onSubmit={(event) => {
                this.handleSubmit(event, setTriplestore)}}>
                  <FormControl className={classes.settingsForm} >
                    <TextField
                      id="outlined-sparql-endpoint"
                      label="SPARQL endpoint URL"
                      // TODO: better handle form width
                      className={classes.formWidth}
                      defaultValue={triplestore.sparql_endpoint}
                      placeholder="SPARQL endpoint URL"
                      variant="outlined"
                      inputRef={this.formSparqlEndpoint}
                      autoFocus='true'
                      // InputProps={{
                      //   className: classes.fullWidth,
                      //   style: {textAlign: 'center'}
                      // }}
                      // size='small'
                      // fullWidth='false'
                    />
                  {/* Commented, due to margin not properly working */}
                  {/* <FormHelperText id="helper-sparql-endpoint">SPARQL endpoint URL used by the into-the-graph app to resolve URIs.</FormHelperText> */}
                  <FormControl variant="outlined">
                    <InputLabel id="form-graph-overview-label">
                      Graphs overview query type
                    </InputLabel>
                    <Select
                      labelId="form-graph-overview-label"
                      label="Graphs overview query type"
                      defaultValue={triplestore.graphs_overview}
                      inputRef={this.formGraphsOverview}
                      MenuProps={{
                        className: classes.alignCenter
                      }}
                      autoWidth='true'
                    >
                      <MenuItem value="hcls">HCLS descriptive metadata</MenuItem>
                      <MenuItem value="all">Get all graphs (optimized in Virtuoso)</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    id="textfield-openapi-url"
                    label="Open API URL"
                    defaultValue={triplestore.openapi_url}
                    placeholder="Comunica widget URL"
                    variant="outlined"
                    inputRef={this.formOpenapiUrl}
                  />
                  <TextField
                    id="textfield-comunica-url"
                    label="Comunica widget URL"
                    defaultValue={triplestore.comunica_url}
                    placeholder="Comunica widget URL"
                    variant="outlined"
                    inputRef={this.formComunicaUrl}
                  />
                  <TextField
                    id="textfield-filebrowser-url"
                    label="Filebrowser URL"
                    defaultValue={triplestore.filebrowser_url}
                    placeholder="Filebrowser URL"
                    variant="outlined"
                    inputRef={this.formFilebrowserUrl}
                  />
                  <TextField
                    id="textfield-search-query"
                    label="Search query"
                    defaultValue={triplestore.search_query}
                    placeholder="Search query"
                    variant="outlined"
                    inputRef={this.formSearchQuery}
                  />
                  {/* <FormHelperText id="helper-graphs-overview">2 possibilities: "hcls" gets only graphs described using HCLS metadata and "all" get all graphs (optimized on Virtuoso)</FormHelperText> */}
                  <Button type="submit"
                  variant="contained" size="small" 
                  className={classes.saveButton} 
                  color="primary" >
                    Save settings for this session  
                  </Button>
                  <Snackbar open={this.state.open} autoHideDuration={5000}>
                    <Alert onClose={this.handleClose} severity="success">
                      The new settings has been saved
                    </Alert>
                  </Snackbar>
                </FormControl>
              </form>
            </Container>
            <Footer />
          </React.Fragment>
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
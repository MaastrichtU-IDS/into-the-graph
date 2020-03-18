import React, { Component } from "react"; 
import { withStyles } from '@material-ui/styles';
import { Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TriplestoreContext from '../TriplestoreContext';
import { FormControl, TextField, Input, InputLabel, FormHelperText } from '@material-ui/core';

import Footer from './footer';

const styles = theme => ({
  settingsForm: {
    width: '80%',
    // textAlign: 'center',
    '& .MuiFormControl-root': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(1),
    },
  },
  saveButton: {
    textTransform: 'none',
    margin: theme.spacing(4),
  },
  formTextField: {
    width: '100%',
  },
  smallFont: {
    fontSize: '16px',
  },
  smallerFont: {
    fontSize: '12px',
  },
  alignLeft: {
    textAlign: 'left'
  }
})

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Settings extends Component {

  static contextType = TriplestoreContext;

  state = {open: false, 
    sparql_endpoint_autocomplete: ''};

  constructor(props) {
    super(props);
    this.formSparqlEndpoint = React.createRef(); 
    this.formGraphsOverview = React.createRef(); 
    this.formOpenapiUrl = React.createRef(); 
    this.formComunicaUrl = React.createRef(); 
    this.formFilebrowserUrl = React.createRef(); 
    this.formSearchQuery = React.createRef(); 
    // this.setState({ sparql_endpoint_autocomplete: this.context.triplestore.sparql_endpoint})
 }

  handleClose = (event, reason) => {
    this.setState({ open: false});
  };

  handleAutocomplete = (searchText) => {
    if (searchText){
      if (searchText.target.value) {
        this.setState({ sparql_endpoint_autocomplete: searchText.target.value})
      } else {
        this.setState({ sparql_endpoint_autocomplete: searchText.target.innerText})
      }
    } else {
      this.setState({ sparql_endpoint_autocomplete: this.context.triplestore.sparql_endpoint})
    }
  }

  // handleSubmit  = (event) => {
  handleSubmit  = (event, setTriplestore) => {
    event.preventDefault();
    setTriplestore({
      sparql_endpoint: this.state.sparql_endpoint_autocomplete, 
      graphs_overview: this.formGraphsOverview.current.value,
      openapi_url: this.formOpenapiUrl.current.value, 
      comunica_url: this.formComunicaUrl.current.value,
      filebrowser_url: this.formFilebrowserUrl.current.value, 
      search_query: this.formSearchQuery.current.value, 
    });
    this.setState({ open: true });
  }

  render() {
    const { classes } = this.props;
    // const sparqlEndointList = [
    //   { title: 'DBpedia Virtuoso', value: 'http://dbpedia.org/sparql' },
    //   { title: 'Bio2RDF Virtuoso', value: 'https://bio2rdf.org/sparql' },
    //   { title: 'NCATS Translator TReK', value: 'http://graphdb.dumontierlab.com/repositories/trek' },
    //   { title: 'NCATS Translator TReK', value: 'http://graphdb.dumontierlab.com/repositories/ncats-red-kg' },
    //   { title: 'Bio2RDF v5', value: 'http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar' },
    // ]
    const sparqlEndointList = [
      'http://graphdb.dumontierlab.com/repositories/trek',
      'http://graphdb.dumontierlab.com/repositories/bio2vec',
      'http://graphdb.dumontierlab.com/repositories/ncats-red-kg',
      'http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar',
      'https://bio2rdf.org/sparql',
      'http://dbpedia.org/sparql',
      'http://opencitations.net/index/sparql',
      'http://opencitations.net/sparql',
      'http://publications.europa.eu/webapi/rdf/sparql',
      'http://lod.openlinksw.com/sparql',
      'https://sparql.nextprot.org',
      'http://localhost:7200/repositories/demo',
      'http://localhost:8890/sparql',
      'http://localhost:8082/bigdata/sparql',
      // 'https://query.wikidata.org/sparql',
      // 'https://sparql.uniprot.org/sparql/',
      // 'http://dbtune.org/bbc/peel/cliopatria/sparql',
      // 'https://semantic.eea.europa.eu/sparql',
      // 'http://void.rkbexplorer.com/sparql/',
    ]
    const example_search_graphdb = 'PREFIX luc: <http://www.ontotext.com/owlim/lucene#>\nSELECT ?foundUri ?foundLabel {\n    ?foundLabel luc:searchIndex "$TEXT_TO_SEARCH*" ;\n    luc:score ?score .\n    ?foundUri ?p ?foundLabel .\n} ORDER BY ?score LIMIT 200';
    const example_search_virtuoso = 'SELECT ?foundUri ?foundLabel WHERE {\n    ?foundUri <http://www.w3.org/2000/01/rdf-schema#label> ?foundLabel .\n    ?foundLabel bif:contains "$TEXT_TO_SEARCH*" .\n} LIMIT 200';
    return (<TriplestoreContext.Consumer>
        {({triplestore, setTriplestore}) => (
          <React.Fragment>
            <Container
              style={{marginTop: '30px'}}
            >
              <form onSubmit={(event) => {
                this.handleSubmit(event, setTriplestore)}}>
                  <FormControl className={classes.settingsForm} >
                    <Autocomplete
                      onChange={this.handleAutocomplete.bind(this)}
                      onInputChange={this.handleAutocomplete.bind(this)}
                      id="autocomplete-sparql-endpoint"
                      options={sparqlEndointList}
                      value={this.context.triplestore.sparql_endpoint}
                      freeSolo={true}
                      includeInputInList={true}
                      ListboxProps={{
                        className: classes.alignLeft,
                      }}
                      renderInput={params => <TextField {...params} 
                      label="SPARQL endpoint URL" 
                      variant="outlined" 
                      // getOptionLabel={option => option.title}
                      // style={{ width: 300 }}
                      // size='small'
                      />}
                    />
                  <FormHelperText id="helper-sparql-endpoint">SPARQL endpoint URL used by the into-the-graph app to resolve URIs.</FormHelperText>
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
                        className: classes.formTextField
                      }}
                      // SelectDisplayProps={{
                      //   className: classes.smallerFont
                      // }}
                      InputProps={{
                        className: classes.smallerFont
                      }}
                      autoWidth={true}
                    >
                      <MenuItem value="hcls">HCLS descriptive metadata</MenuItem>
                      <MenuItem value="all">Get all graphs (optimized in Virtuoso)</MenuItem>
                    </Select>
                  </FormControl>
                  <FormHelperText id="helper-graphs-overview">2 possibilities: "hcls" gets only graphs described using HCLS metadata and "all" get all graphs (optimized on Virtuoso)</FormHelperText>
                  <TextField
                    id="textfield-openapi-url"
                    label="Open API URL"
                    defaultValue={triplestore.openapi_url}
                    placeholder="Open API URL"
                    variant="outlined"
                    inputRef={this.formOpenapiUrl}
                    size='small'
                    InputProps={{
                      className: classes.smallerFont
                    }}
                    InputLabelProps={{
                      className: classes.smallerFont
                    }}
                  />
                  <FormHelperText id="helper-graphs-overview">URL to the OpenAPI UI to perform Reasoner API queries and RESTful queries to explore the SPARQL endpoint (require a RDF Knowledge graph compliant with the BioLink model)</FormHelperText>
                  <TextField
                    id="textfield-comunica-url"
                    label="Comunica widget URL (Archives)"
                    defaultValue={triplestore.comunica_url}
                    placeholder="Comunica widget URL (Archives)"
                    variant="outlined"
                    inputRef={this.formComunicaUrl}
                    size='small'
                    InputProps={{
                      className: classes.smallerFont
                    }}
                    InputLabelProps={{
                      className: classes.smallerFont
                    }}
                  />
                  <FormHelperText id="helper-graphs-overview">URL to the Comunica widget to expose a Triple Pattern Fragment server to query archives.</FormHelperText>
                  <TextField
                    id="textfield-filebrowser-url"
                    label="Filebrowser URL"
                    defaultValue={triplestore.filebrowser_url}
                    placeholder="Filebrowser URL"
                    variant="outlined"
                    inputRef={this.formFilebrowserUrl}
                    size='small'
                    InputProps={{
                      className: classes.smallerFont
                    }}
                    InputLabelProps={{
                      className: classes.smallerFont
                    }}
                  />
                  <FormHelperText id="helper-graphs-overview">URL to the filebrowser to download RDF data dumps of the different graphs (needs to be manually exported at the moment)</FormHelperText>
                  <TextField
                    id="textfield-search-query"
                    label="Search query"
                    defaultValue={triplestore.search_query}
                    placeholder="Search query"
                    variant="outlined"
                    inputRef={this.formSearchQuery}
                    multiline={true}
                    size='small'
                    InputProps={{
                      className: classes.smallerFont
                    }}
                    InputLabelProps={{
                      className: classes.smallerFont
                    }}
                  />
                  <FormHelperText id="helper-search-virtuoso" >
                    SPARQL query used when searching in the navbar search box.
                    It should return a ?foundUri and a ?foundLabel.
                    <br/>
                    You can use those examples queries for GraphDB or Virtuoso Search Index (needs to be enabled in the triplestore):
                    <TextField 
                      className={classes.formTextField}
                      id="search-graphdb" 
                      label="Search query for Ontotext GraphDB" 
                      variant="outlined" multiline={true}
                      value={example_search_graphdb}
                      size='small'
                      InputProps={{
                        className: classes.smallerFont
                      }}
                      InputLabelProps={{
                        className: classes.smallerFont
                      }}
                    />
                    <TextField 
                      className={classes.formTextField}
                      id="search-virtuoso" 
                      label="Search query for OpenLink Virtuoso" 
                      variant="outlined" multiline={true}
                      value={example_search_virtuoso}
                      size='small'
                      InputProps={{
                        className: classes.smallerFont
                      }}
                      InputLabelProps={{
                        className: classes.smallerFont
                      }}
                    />
                  </FormHelperText>
                  <Button type="submit"
                  variant="contained" size="small" 
                  className={classes.saveButton} 
                  color="primary" >
                    Save settings for this session  
                  </Button>
                  <Snackbar open={this.state.open} onClose={this.handleClose} autoHideDuration={3000}>
                    <Alert severity="success">
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
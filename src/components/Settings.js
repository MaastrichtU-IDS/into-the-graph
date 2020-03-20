import React, { Component } from "react"; 
import { withStyles } from '@material-ui/styles';
import { Typography } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TriplestoreContext from '../TriplestoreContext';
import { FormControl, TextField, Input, InputLabel, FormHelperText } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Footer from './footer';

const styles = theme => ({
  settingsForm: {
    width: '90%',
    // textAlign: 'center',
    '& .MuiFormControl-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    '& .MuiFormHelperText-root': {
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(1),
    },
  },
  saveButton: {
    textTransform: 'none',
    margin: theme.spacing(2, 2),
    // maxWidth: '400px'
  },
  fullWidth: {
    width: '100%',
  },
  normalFont: {
    fontSize: '14px',
  },
  smallerFont: {
    fontSize: '12px',
  },
  alignLeft: {
    textAlign: 'left'
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  paperTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(1),
  }
})

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Settings extends Component {

  static contextType = TriplestoreContext;

  state = {open: false, 
    dialogOpen: false,
    sparql_endpoint_autocomplete: '',
    openapi_url_autocomplete: '',
    comunica_url_autocomplete: '',
    filebrowser_url_autocomplete: ''};

  constructor(props) {
    super(props);
    // this.formSparqlEndpoint = React.createRef(); 
    this.formGraphsOverview = React.createRef(); 
    this.formSearchQuery = React.createRef(); 
    // this.formOpenapiUrl = React.createRef(); 
    // this.formComunicaUrl = React.createRef(); 
    // this.formFilebrowserUrl = React.createRef(); 
    // this.setState({ sparql_endpoint_autocomplete: this.context.triplestore.sparql_endpoint})
 }

  // Close Snackbar
  handleClose = (event, reason) => {
    this.setState({ open: false});
  };
  handleDialogClose = (event, reason) => {
    this.setState({ dialogOpen: false});
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

  // handleSubmit  = (event) => {
  handleSubmit  = (event, setTriplestore) => {
    event.preventDefault();
    setTriplestore({
      sparql_endpoint: this.state.sparql_endpoint_autocomplete, 
      graphs_overview: this.formGraphsOverview.current.value,
      openapi_url: this.state.openapi_url_autocomplete, 
      comunica_url: this.state.comunica_url_autocomplete,
      filebrowser_url: this.state.filebrowser_url_autocomplete, 
      search_query: this.formSearchQuery.current.value, 
    });
    this.setState({ open: true });
  }

  confirmDeleteCache  = () => {
    this.setState({ dialogOpen: true });
  }
  doDeleteCache = () => {
    localStorage.clear();
    this.handleDialogClose();
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
      'http://rdf.disgenet.org/sparql/',    // Disease - Gene associations and else. Virtuoso
      'http://opencitations.net/index/sparql',  // Law OpenCitation corpus. Virtuoso
      'http://opencitations.net/sparql',    // Virtuoso
      'https://joinup.ec.europa.eu/sparql/',   // EU Joinup initiative. Virtuoso
      'http://data.europa.eu/euodp/sparqlep', // EU Open Data Portal. Seems Virtuoso
      'http://publications.europa.eu/webapi/rdf/sparql',  // EU Cellar Law dataset. Seems Virtuoso
      'http://digital-agenda-data.eu/data/sparql', // EU  Digital Agenda Scoreboard dataset. Seems Virtuoso
      'http://lod.openlinksw.com/sparql',
      'http://sparql.southgreen.fr',
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
    const openapiList = [
      'http://api.trek.semanticscience.org',
      'http://localhost:8080',
    ]
    const comunicaList = [
      'https://query.linkeddatafragments.org',
      'http://comunica.137.120.31.102.nip.io',
      'http://localhost:8084',
    ]
    const filebrowserList = [
      'http://download.137.120.31.102.nip.io',
      'https://download.bio2rdf.org',
      'http://localhost:8081',
    ]
    const example_search_graphdb = "PREFIX luc: <http://www.ontotext.com/owlim/lucene#>\nSELECT ?foundUri ?foundLabel {\n    ?foundLabel luc:searchIndex '$TEXT_TO_SEARCH*' ;\n    luc:score ?score .\n    ?foundUri ?p ?foundLabel .\n} ORDER BY ?score LIMIT 200";
    const example_search_virtuoso = "SELECT ?foundUri ?foundLabel WHERE {\n    ?foundUri <http://www.w3.org/2000/01/rdf-schema#label> ?foundLabel .\n    ?foundLabel bif:contains '$TEXT_TO_SEARCH' .\n} LIMIT 200";
    const example_search_default = "SELECT ?foundUri ?foundLabel WHERE {\n    ?foundUri ?p ?foundLabel .\n    VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .\n    FILTER(isLiteral(?foundLabel))\n    FILTER contains(?foundLabel, '$TEXT_TO_SEARCH')\n} LIMIT 5";
    return (<TriplestoreContext.Consumer>
        {({triplestore, setTriplestore}) => (
          <React.Fragment>
            <Container className='mainContainer'
              style={{marginTop: '30px'}}
            >
              <form onSubmit={(event) => {
                this.handleSubmit(event, setTriplestore)}}>
                  <FormControl className={classes.settingsForm}>
                    <Paper elevation={2} className={classes.paperPadding}>
                      <Typography variant="h5" className={classes.paperTitle}>
                        SPARQL endpoint
                      </Typography>
                      <Autocomplete
                        onChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
                        onInputChange={this.handleAutocomplete.bind(this, 'sparql_endpoint')}
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
                    <FormControl variant="outlined" 
                      className={classes.fullWidth}
                      >
                      <InputLabel id="form-graph-overview-label">
                        Graphs overview query type
                      </InputLabel>
                      <Select
                        labelId="form-graph-overview-label"
                        label="Graphs overview query type"
                        defaultValue={triplestore.graphs_overview}
                        inputRef={this.formGraphsOverview}
                        // MenuProps={{
                        //   className: classes.fullWidth,
                        // }}
                        // SelectDisplayProps={{
                        //   className: classes.smallerFont,
                        //   style: {width: '100%'}
                        // }}
                        InputProps={{
                          className: classes.smallerFont,
                          // style: {width: '100%'}
                        }}
                        autoWidth
                      >
                        <MenuItem value="hcls">HCLS descriptive metadata</MenuItem>
                        <MenuItem value="all">Get all graphs (optimized in Virtuoso)</MenuItem>
                      </Select>
                    </FormControl>
                    <FormHelperText id="helper-graphs-overview">2 possibilities: "hcls" gets only graphs described using HCLS metadata and "all" get all graphs (optimized in Virtuoso)</FormHelperText>
                  </Paper>
                  <Paper elevation={2} className={classes.paperPadding}>
                    <Typography variant="h5" className={classes.paperTitle}>
                      Interfaces
                    </Typography>
                    <Autocomplete
                      onChange={this.handleAutocomplete.bind(this, 'openapi_url')}
                      onInputChange={this.handleAutocomplete.bind(this, 'openapi_url')}
                      id="autocomplete-openapi-url"
                      options={openapiList}
                      value={this.context.triplestore.openapi_url}
                      freeSolo={true}
                      includeInputInList={true}
                      ListboxProps={{
                        className: classes.alignLeft,
                      }}
                      renderInput={params => <TextField {...params} 
                      label="Reasoner API URL"
                      variant="outlined" 
                      // getOptionLabel={option => option.title}
                      // style={{ width: 300 }}
                      // size='small'
                      />}
                    />
                    <FormHelperText id="helper-graphs-overview">URL to the OpenAPI UI to perform Reasoner API queries and RESTful queries to explore the SPARQL endpoint (require a RDF Knowledge graph compliant with the BioLink model)</FormHelperText>
                    <Autocomplete
                      onChange={this.handleAutocomplete.bind(this, 'comunica_url')}
                      onInputChange={this.handleAutocomplete.bind(this, 'comunica_url')}
                      id="autocomplete-comunica-url"
                      options={comunicaList}
                      value={this.context.triplestore.comunica_url}
                      freeSolo={true}
                      includeInputInList={true}
                      ListboxProps={{
                        className: classes.alignLeft,
                      }}
                      renderInput={params => <TextField {...params} 
                      label="Comunica widget URL (Archives)"
                      variant="outlined" 
                      />}
                    />
                    <FormHelperText id="helper-graphs-overview">URL to the Comunica widget to expose a Triple Pattern Fragment server to query archives.</FormHelperText>
                    <Autocomplete
                      onChange={this.handleAutocomplete.bind(this, 'filebrowser_url')}
                      onInputChange={this.handleAutocomplete.bind(this, 'filebrowser_url')}
                      id="autocomplete-filebrowser-url"
                      options={filebrowserList}
                      value={this.context.triplestore.filebrowser_url}
                      freeSolo={true}
                      includeInputInList={true}
                      ListboxProps={{
                        className: classes.alignLeft,
                      }}
                      renderInput={params => <TextField {...params} 
                      label="Filebrowser URL to download RDF dumps"
                      variant="outlined" 
                      />}
                    />
                    <FormHelperText id="helper-graphs-overview">URL to the filebrowser to download RDF data dumps of the different graphs (needs to be manually exported at the moment)</FormHelperText>
                  </Paper>
                  <Paper elevation={2} className={classes.paperPadding}>
                    <Typography variant="h5" className={classes.paperTitle}>
                      Search query
                    </Typography>
                    <FormHelperText>
                      The SPARQL query used when searching in the navbar search box. 
                      Use $TEXT_TO_SEARCH to define where the text to search will be replaced in the query.
                      It should return a ?foundUri and a ?foundLabel to be displayed by the app.
                    </FormHelperText>
                    <TextField
                      id="textfield-search-query"
                      label="Search query used by the app"
                      placeholder="Search query used by the app"
                      className={classes.fullWidth}
                      defaultValue={triplestore.search_query}
                      variant="outlined"
                      inputRef={this.formSearchQuery}
                      multiline={true}
                      // size='small'
                      InputProps={{
                        className: classes.normalFont
                      }}
                      InputLabelProps={{
                        className: classes.normalFont
                      }}
                    />
                    <FormHelperText>
                      You can use those examples queries to use GraphDB or Virtuoso Search Index (it needs to have been enabled in the triplestore before):
                    </FormHelperText>
                    <TextField 
                      className={classes.fullWidth}
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
                      className={classes.fullWidth}
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
                  <TextField 
                      className={classes.fullWidth}
                      id="search-default" 
                      label="Default search query" 
                      variant="outlined" multiline={true}
                      value={example_search_default}
                      size='small'
                      InputProps={{
                        className: classes.smallerFont
                      }}
                      InputLabelProps={{
                        className: classes.smallerFont
                      }}
                    />
                  </Paper>
                  <Button type="submit"
                  variant="contained" 
                  className={classes.saveButton} 
                  startIcon={<Icon>save</Icon>}
                  color="primary" >
                    Save settings for this session  
                  </Button>
                  <Button
                  variant="contained" size="small" 
                  className={classes.saveButton} 
                  onClick={this.confirmDeleteCache}
                  startIcon={<Icon>delete</Icon>}
                  color="secondary" >
                    Delete cache
                  </Button>
                  <Snackbar open={this.state.open} onClose={this.handleClose} autoHideDuration={3000}>
                    <Alert severity="success">
                      Settings has been saved
                    </Alert>
                  </Snackbar>
                </FormControl>
              </form>
              <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Delete the cache?"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    This will delete the cache containing your current settings.<br/>
                    This can help resolve issues related to the cache.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.doDeleteCache} color="secondary">
                    Delete cache
                  </Button>
                  <Button onClick={this.handleDialogClose} color="primary" autoFocus>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
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
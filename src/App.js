import React, { Component } from 'react';
// TODO: which one to keep?
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
//import ReactDOM from 'react-dom';

import './App.css';
import TriplestoreContext from './TriplestoreContext';
import NavBar from './components/navbar';
import GraphsOverviewComponent from './components/GraphsOverview';
import DeployYasguiComponent from './components/DeployYasgui';
import DeployComunicaComponent from './components/DeployComunica';
import DeployOpenApi from './components/DeployOpenApi';
import DeployFilebrowser from './components/DeployFilebrowser';
import DescribeComponent from './components/describe';
import Settings from './components/Settings';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
// import blueGrey from '@material-ui/core/colors/blueGrey';
// import orange from '@material-ui/core/colors/orange';

// Change theme color and typography here
const theme = createMuiTheme({
  palette: {
    primary: { light: '#63a4ff', main: blue[700], dark: '#004ba0' },
    // primary: { light: '#63a4ff', main: blue[700], dark: blue[900] },
    // Same color as Angular into-the-graph: blue[700] / #1976d2
    // primary: { light: blue[50], main: blue[600], dark: blue[900] },
    secondary: { light: '#f05545', main: '#b71c1c', dark: '#7f0000' },
    default: { light: '#fafafa', main: '#eceff1', dark: grey[600] }
  },
  typography: {
    "fontFamily": "\"Open Sans\", \"Roboto\", \"Arial\"",
    "fontSize": 13,
    "fontWeightLight": 300,
    "fontWeightRegular": 400,
    "fontWeightMedium": 500
  },
});

// Routing happens here
class App extends Component {
  
  constructor(props) {
    super(props);

    // Update the triplestore config
    this.setTriplestore = (triplestore_config) => {
      this.setState( { triplestore: { 
        sparql_endpoint: triplestore_config.sparql_endpoint,
        graphs_overview: triplestore_config.graphs_overview,
        graph_uri_resolution: triplestore_config.graph_uri_resolution,
        openapi_url: triplestore_config.openapi_url,
        comunica_url: triplestore_config.comunica_url,
        filebrowser_url: triplestore_config.filebrowser_url,
        search_query: triplestore_config.search_query
       } 
      })
      localStorage.setItem("intothegraphSettings", JSON.stringify(triplestore_config));
    };

    const localStorageConfig = localStorage.getItem("intothegraphSettings");
    let triplestoreState = {}
    // Get settings from local storage (more persistent)
    if (localStorageConfig) {
      triplestoreState = JSON.parse(localStorageConfig);      
    } else {
      // Default settings
      triplestoreState = { 
        sparql_endpoint: 'https://graphdb.dumontierlab.com/repositories/trek', 
        graphs_overview: 'hcls',
        graph_uri_resolution: 'triples',
        openapi_url: 'http://api.trek.semanticscience.org/',
        comunica_url: 'http://query.linkeddatafragments.org/',
        // comunica_url: 'http://comunica.137.120.31.102.nip.io/',
        filebrowser_url: 'http://download.137.120.31.102.nip.io/#/',
        search_query: "PREFIX luc: <http://www.ontotext.com/owlim/lucene#>\n        SELECT ?foundUri ?foundLabel {\n            ?foundLabel luc:searchIndex '$TEXT_TO_SEARCH*' ;\n            luc:score ?score .\n            ?foundUri ?p ?foundLabel .\n        } ORDER BY ?score LIMIT 200",
        // Default default search query:
        // search_query: "SELECT ?foundUri ?foundLabel WHERE {\n    ?foundUri ?p ?foundLabel .\n    VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .\n    FILTER(isLiteral(?foundLabel))\n    FILTER contains(?foundLabel, '$TEXT_TO_SEARCH')\n} LIMIT 5",
      }
    }
    this.state = {
      triplestore: triplestoreState,
      drawer_width: '240px',
      setTriplestore: this.setTriplestore,
    };
    console.log(this.state);
  }

  render() {
    return (
      <TriplestoreContext.Provider value={this.state}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
          <div style={{width: '100%', height: '100%', fontFamily: 'Open Sans'}}>
            <NavBar />
            <Switch >
              {/* <div style={{flexGrow: 1,  height: '100%', marginLeft: this.state.drawer_width}}> */}
              <div style={{height: '100%', marginLeft: this.state.drawer_width}}>
                <Route exact path='/' component={DeployYasguiComponent} />
                {/*<Route exact path='/' component={GraphsOverviewComponent} />*/}
                {/*<Route exact path='/sparql' component={DeployYasguiComponent} />*/}
                {/*<Route exact path='/describe' component={DescribeComponent} />*/}
                {/*<Route exact path='/archives' component={DeployComunicaComponent} />*/}
                {/*<Route exact path='/api' component={DeployOpenApi} />*/}
                {/*<Route exact path='/download' component={DeployFilebrowser} />*/}
                <Route exact path='/settings' component={Settings} />
              </div>
            </Switch>
          </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </TriplestoreContext.Provider>
    );
  }
}
export default (App);
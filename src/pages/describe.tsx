import React from 'react';
import { useLocation } from "react-router-dom";
import { makeStyles,  useTheme } from '@material-ui/core/styles';
import { Typography, Container, Paper, Grid, CircularProgress, Button } from "@material-ui/core";
import axios from 'axios';

// From https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfa
import 'datatables.net-dt/css/jquery.dataTables.min.css';
const $ = require('jquery');
$.DataTable = require('datatables.net');

import { Graph } from "perfect-graph";
import { ApplicationProvider } from 'unitx-ui';
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import Cola from 'cytoscape-cola';

import LinkDescribe from "../components/LinkDescribe";
// import Context from "../components/Context";

Cytoscape.use(Cola);

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  link: {
    textDecoration: 'none',
    textTransform: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
    },
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
    // margin: theme.spacing(2, 2),
  },
  paperTitle: {
    fontWeight: 300,
    marginBottom: theme.spacing(1),
  },
  loadSpinner: {
    padding: theme.spacing(10, 10)
  },
  datatable_text: {
    wordBreak: 'break-word'
  }
}))


export default function Describe() {
  const classes = useStyles();
  const theme = useTheme();

  const [state, setState] = React.useState({
    describe_uri: '',
    describe_endpoint: '',
    describe_results: [],
    search_results: [],
    graph_data: {nodes: [], edges: []},
    cytoscape_elements: [],
    isLoading: true,
    requestError: false
  });
  const stateRef = React.useRef(state);

  // Avoid conflict when async calls
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // const [context, setContext]: any = React.useContext(Context);

  // useLocation hook to get URL params
  let location = useLocation();

  // TODO: dont work to use Ref for datatables.net
  // const datatableRef = React.useRef(null);
  
  // Build SPARQL query to describe a URI
  function getDescribeQuery(uri_to_describe: any) {
    var describe_query;
    if(uri_to_describe.startsWith('node')) {
      // Case it is a blank node in Ontotext GraphDB
      // TODO: improve it
      uri_to_describe = "_:" + uri_to_describe
      describe_query = `SELECT DISTINCT ?subject ?predicate ?object ?graph WHERE {
          GRAPH ?graph {
            ` + uri_to_describe + ` ?predicate ?object .
          }
        } LIMIT 100`
    } else {
      // Regular URI
      uri_to_describe = "<" + uri_to_describe + ">"
      
      // Define the query block that resolves graph URIs
      // To returns only classes or all triples
      var graphQuery = `SELECT * {
        GRAPH ` + uri_to_describe + ` {
          ?subject ?predicate ?object .
          BIND(` + uri_to_describe + ` AS ?graph)
        }
      } LIMIT 100`
      // if (this.context.triplestore.graph_uri_resolution === "classes") {
      //   // TODO: Add DISTINCT ? Might slow the query down in some cases
      //   graphQuery = `SELECT * {
      //     GRAPH ` + uri_to_describe + ` {
      //       [] a ?object .
      //       BIND("dummy subject" AS ?subject)
      //       BIND("dummy predicate" AS ?predicate)
      //     }
      //   } LIMIT 1000`
      // }

      describe_query = `SELECT DISTINCT ?subject ?predicate ?object ?graph WHERE {
        {
          SELECT * {
            GRAPH ?graph {
              ` + uri_to_describe + ` ?predicate ?object .
              BIND(` + uri_to_describe + ` AS ?subject)
            }
          } LIMIT 100
        } UNION {
          SELECT * {
            GRAPH ?graph {
              ?subject ?predicate ` + uri_to_describe + ` .
              BIND(` + uri_to_describe + ` AS ?object)
            }
          } LIMIT 100
        } UNION {
          SELECT * {
            GRAPH ?graph {
              ?subject ` + uri_to_describe + ` ?object .
              BIND(` + uri_to_describe + ` AS ?predicate)
            }
          } LIMIT 100
        } UNION {
          ` + graphQuery + `
        }
      }`
    }
    return encodeURIComponent(describe_query);
  }

  function getSearchQuery(text_to_search: string) {
    let search_query = ''
    const localStorageConfig = localStorage.getItem("intothegraphSettings");
    if (localStorageConfig) {
      let configState: any = JSON.parse(localStorageConfig);
      search_query = configState.search_query;
    }
    if (!search_query) {
      // Default search query, if no query in localStorage
      search_query = `SELECT ?foundUri ?foundLabel WHERE {
        ?foundUri ?p ?foundLabel .
        VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .
        FILTER(isLiteral(?foundLabel))
        FILTER contains(?foundLabel, "$TEXT_TO_SEARCH")
        } LIMIT 5`.replace('$TEXT_TO_SEARCH', text_to_search)
    }

    // if (text_to_search === "") {
    //   // If no text provided, we use a default search query to get interesting concepts 
    //   search_query = `SELECT ?foundUri ?foundLabel WHERE {
    //     ?foundUri a ?type ; ?p ?foundLabel .
    //     VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .
    //     FILTER(isLiteral(?foundLabel))
    //     FILTER(isIRI(?foundUri))
    //     } LIMIT 20`

    //   // A custom default query can be set in settings.json
    //   // let defaultSearchQuery = Config.default_search_query;
    //   // if (defaultSearchQuery) {
    //   //   searchQuery = defaultSearchQuery;
    //   // } else {
    //   //   // If no custom default_query defined in settings.json
    //   //   searchQuery = `SELECT ?foundUri ?foundLabel WHERE {
    //   //     ?foundUri a ?type ; ?p ?foundLabel .
    //   //     VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} .
    //   //     FILTER(isLiteral(?foundLabel))
    //   //     FILTER(isIRI(?foundUri))
    //   //     } LIMIT 20`
    //   // }
    // // } else if (search_query) {
    // //   // If defined in settings.json
    // //   // Results are provided through ?foundUri and ?foundLabel
    // //   // Use $TEXT_TO_SEARCH as search variable to replace
    // //   searchQuery = searchQuery.replace('$TEXT_TO_SEARCH', text_to_search)
    // }
    // console.log('search_query generated');
    // console.log(search_query);
    return encodeURIComponent(search_query);
  }

  function convertStringToNumber(string_to_convert: string) {
    let hash = 0, i, chr;
    for (i = 0; i < string_to_convert.length; i++) {
      chr   = string_to_convert.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  // Run on start of the page
  React.useEffect(() => {
    // Reset state
    updateState({describe_results: {}})
    updateState({search_results: {}})
    updateState({isLoading: true})

    // Get URL params 
    const params = new URLSearchParams(location.search + location.hash);

    let describe_uri = params.get('uri');
    let describe_endpoint = params.get('endpoint');

    // Get sparql_endpoint from cookie intothegraphSettings
    if (!describe_endpoint) {
      const localStorageConfig = localStorage.getItem("intothegraphSettings");
      if (localStorageConfig) {
        let configState: any = JSON.parse(localStorageConfig);
        describe_endpoint = configState.sparql_endpoint;
      }
    }

    // console.log('context');
    // console.log(context);
    // if (!describe_endpoint && context.describe_endpoint) {
    //   // Get endpoint from react Context
    //   describe_endpoint = context.describe_endpoint;
    // }

    // TODO: handle default value somewhere else?
    if (!describe_uri) {
      describe_uri = 'https://identifiers.org/drugbank:DB00002';
      // describe_uri = 'http://bio2rdf.org/clinicaltrials:NCT00209495';
    }
    if (!describe_endpoint) {
      describe_endpoint = 'https://graphdb.dumontierlab.com/repositories/ncats-red-kg';
      // describe_endpoint = 'https://bio2rdf.org/sparql';
    }

    updateState({describe_uri: describe_uri})
    updateState({describe_endpoint: describe_endpoint})
    // TODO: Context not propagating properly, using cookie localStorage instead
    // setContext(describe_endpoint)

    if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(describe_uri)) {
      // If URI provided
      axios.get(describe_endpoint + `?query=` + getDescribeQuery(describe_uri))
        .then(res => {
          const sparql_results_array = res.data.results.bindings;
          updateState({describe_results: sparql_results_array})
          updateState({isLoading: false})

          $('#datatableRef').DataTable({
            "autoWidth": false
          });

          let graph_nodes: any = {}
          let graph_edges: any = []
          let cytoscape_elements: any = []
          let node_count = 1;

          // Prepare perfect graph data
          sparql_results_array.forEach((result_row: any) => {
            // Add subject node to hash if not present
            if (!(result_row.subject.value in graph_nodes)) {
              // If not already in array
              graph_nodes[result_row.subject.value] = {
                id: result_row.subject.value,
                position: { x: node_count * 100, y: node_count * 400 },
                data: { uri: result_row.subject.value, color: 'red' },
              };
              cytoscape_elements.push({ data: { id: result_row.subject.value, label: result_row.subject.value } })
              node_count += 1;
            }

            // Add object node
            if (!(result_row.object.value in graph_nodes)) {
              // If not already in array
              graph_nodes[result_row.object.value] = {
                id: result_row.object.value,
                position: { x: node_count * 80, y: node_count * 40 },
                data: { uri: result_row.object.value, color: 'green' },
              };
              cytoscape_elements.push({ data: { id: result_row.object.value, label: result_row.object.value } })
              node_count += 1;
            }

            // Add edge between the 2 nodes
            const edge_id = result_row.subject.value + result_row.predicate.value + result_row.object.value;
            graph_edges.push({
              id: edge_id,
              source: result_row.subject.value,
              target: result_row.object.value,
              data: { uri: result_row.predicate.value, color: 'green' }
            });
            cytoscape_elements.push({ data: { 
              source: result_row.subject.value, 
              target: result_row.object.value, 
              label: result_row.predicate.value 
            } })
          })

        const graph_nodes_array = Object.keys(graph_nodes).map(function(node_id){
          return graph_nodes[node_id];
        });

        console.log('Graph nodes and edges data');
        console.log(graph_nodes_array);
        console.log(graph_edges);
        updateState({
          graph_data: { nodes: graph_nodes_array, edges: graph_edges },
          cytoscape_elements: cytoscape_elements
        })
      })

    } else {
      // Full text search if not URI
      axios.get(describe_endpoint + `?query=` + getSearchQuery(describe_uri))
        .then(res => {
          const search_results_array = res.data.results.bindings;
          updateState({search_results: search_results_array})
          updateState({isLoading: false})
          // let searchResults = [];
          // sparqlResultArray.forEach((sparqlResultRow) => {
          //   searchResults.push({
          //     foundUri: sparqlResultRow.foundUri.value , 
          //     foundLabel: sparqlResultRow.foundLabel.value
          //   })
          // })
        })
        .catch(error => {
          console.log(error)
          updateState({ requestError: true });
          updateState({ isLoading: false });
        })
    }

  }, [location])

  // Change Cytoscape layout: https://js.cytoscape.org/#layouts
  const cytoscape_layout = {
    name: 'cola',
    nodeSpacing: 170,
    // edgeLengthVal: 1000,
    animate: false,
    randomize: false,
    maxSimulationTime: 1500
  }
  // const cytoscape_layout = { 
  //   name: 'concentric',
  //   minNodeSpacing: 20
  // };
  // const cytoscape_layout = { name: 'breadthfirst' };
  // const cytoscape_layout = {
  //   name: 'cose',
  //   animate: 'end',
  //   fit: true,
  //   componentSpacing: 1000,
  //   nodeOverlap: 10,
  //   nodeRepulsion: function( node: any ){ return 4092; },
  //   idealEdgeLength: function( edge: any ){ return 300; },
  // };

  return(
    <Container className='mainContainer'>
      <Typography variant="body2" className={classes.margin}>
      {/* <Typography variant="body2" style={{textAlign: 'center', marginBottom: '20px'}}> */}
        {state.describe_endpoint}
      </Typography>
      <Typography variant="h5" className={classes.margin}>
        {state.describe_uri}
      </Typography>

      {state.isLoading && (
        <CircularProgress className={classes.loadSpinner} />
      )}

      {/* Display a datatable with subject, predicate, object, graph retrieved */}
      {state.describe_results.length > 0 && ( 
        // <table table="true" ref={datatableRef}>
        <Paper elevation={4} className={classes.paperPadding}>
          <table id='datatableRef' style={{ wordBreak: 'break-all' }}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Predicate</th>
                <th>Object</th>
                <th>Graph</th>
              </tr>
            </thead>
            <tbody>
              {/* Iterate Describe query results array */}
              {state.describe_results.map((row: any, key: number) => {
                // return <Tooltip title={displayDescription(row.name, row.description)} key={key}>
                return <tr key={key}>
                    {/* <td><LinkDescribe uri={row.graph.value} variant='body2'/></td> */}
                    <td><LinkDescribe variant='body2' uri={row.subject.value}/></td>
                    <td><LinkDescribe variant='body2' uri={row.predicate.value}/></td>
                    <td><LinkDescribe variant='body2' uri={row.object.value}/></td>
                    <td><LinkDescribe variant='body2' uri={row.graph.value}/></td>
                  </tr>
                {/* </Tooltip>; */}
              })}
            </tbody>
          </table>
        </Paper>
      )}

      {/* Show results of full text search query */}
      {state.search_results.length > 0 &&
        <Paper elevation={4} className={classes.paperPadding}>
            {state.search_results.map(function(searchResult: any, key: number){
              return <Grid container spacing={2} alignItems="center" key={key}>
                <Grid item xs={6}>
                  <Paper className={classes.paperPadding}>
                    <LinkDescribe variant='body2' uri={searchResult.foundUri.value}/>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">{searchResult.foundLabel.value}</Typography>
                </Grid>
              </Grid>
            })}
        </Paper>
      }

      {/* Show error message (if request fails) */}
      {state.requestError && (
        <Paper elevation={2} className={classes.paperPadding}>
          <Typography variant="body2">
            The request to the SPARQL endpoint failed, try to <a href="" className={classes.link}>reload the page ♻️</a><br/>
            Or&nbsp;<a href="https://addons.mozilla.org/fr/firefox/addon/cors-everywhere/" className={classes.link} target='_blank' rel="noopener noreferrer">
              enable CORS requests</a> in your browser.
          </Typography>
        </Paper>
      )}

      {/* No results for URI resolution */}
      {!state.requestError && !state.isLoading && state.describe_results.length < 1 && !state.search_results.length && (
        <Paper elevation={2} className={classes.paperPadding}>
          <Typography variant="body2">
            We could not find a match for your URI in the SPARQL endpoint.
          </Typography>
        </Paper>
      )}

      {/* No results for Search */}
      {!state.requestError && !state.isLoading && state.search_results.length < 1 && !state.describe_results.length && (
        <Paper elevation={2} className={classes.paperPadding}>
          <Typography variant="body2">
            We could not find a match for your search in the SPARQL endpoint.
          </Typography>
        </Paper>
      )}

      {/* Iterate a JSON object: */}
      {/* {Object.keys(state.repositories_hash).map(function(repo: any){ ... })  */}

      {/* image: {iconImage} */}
      {/* Color: https://perfectgraph-5c619.web.app/?path=/story/components-components--view */}
      {/* <Graph
        style={{ width: '100%', height: 250 }}
        nodes={[
          {
            id: 1,
            position: { x: 10, y: 10 },
            data: {
              name: 'Institute of Data Science',
              // image: 'https://raw.githubusercontent.com/MaastrichtU-IDS/into-the-graph/main/assets/icon.png',
              story: `Develop responsible data science by design to accelerate discovery across all sectors of society.`
              // color: 'grey'
            }
          },
          {
            id: 2,
            position: { x: 600, y: 10 },
            data: {
              name: 'Maastricht University',
              // image: 'https://raw.githubusercontent.com/MaastrichtU-IDS/into-the-graph/main/assets/icon.png',
              story: `The most international university in the Netherlands, stands out for its innovative education model, and multidisciplinary approach to research and education.`
              // color: 'grey'
            }
          },
        ]}
        edges={[
          { id: 51, source: 1, target: 2 }
        ]}
        renderNode={({ item: { data } }) => (
        <Graph.ProfileTemplate
          name={data.name}
          // image={data.image}
          story={data.story}
          // color= 'grey'
          // style={{ backgroundColor: '#eceff1' }}
        />
      )}
      /> */}

      {state.graph_data.nodes.length > 0 && (<>
        <Typography variant="h5" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
          {/* <a href='https://perfectgraph-5c619.web.app/' className={classes.link} > */}
          Perfect Graph visualization
          {/* </a> */}
        </Typography>
        <Paper elevation={4} className={classes.paperPadding}>
          <ApplicationProvider>
            <Graph
              style={{ width: '100%', height: 800 }}
              // config={{ layout: Graph.Layouts.euler }}
              nodes={state.graph_data.nodes}
              edges={state.graph_data.edges}
              // nodes={[
              //   {
              //     id: '1',
              //     position: { x: 10, y: 10 },
              //     data: { city: 'Amsterdam', color: 'red' },
              //   },
              //   {
              //     id: '2',
              //     position: { x: 300, y: 10 },
              //     data: { city: 'Maastricht', color: 'blue' },
              //   },
              // ]}
              // edges={[
              //   { id: '51', source: '1', target: '2' },
              // ]}
              // drawLine={({ graphics, to, from }) => {
              //   drawLine({
              //     graphics,
              //     to,
              //     from,
              //     directed: true
              //     // type: 'bezier'
              //   })
              // }} 
              renderNode={({ item: { data } }: any) => (
                <Graph.View
                  style={{ width: 100, height: 100, backgroundColor: data.color }}
                >
                  <Graph.Text style={{ fontSize: 16 }}>
                    {data.uri}
                  </Graph.Text>
                  {/* <LinkDescribe variant='body2' uri={data.uri}/> */}
                </Graph.View>
              )}
            />
          </ApplicationProvider>
        </Paper>
      </> )}

      {state.graph_data.nodes.length > 0 && (<>
        <Typography variant="h5" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
          {/* <a href='https://perfectgraph-5c619.web.app/' className={classes.link} > */}
          Cytoscape JS visualization
          {/* </a> */}
        </Typography>
        <Paper elevation={4} className={classes.paperPadding} style={{ height: '100vh', textAlign: 'left' }}>
          <CytoscapeComponent elements={state.cytoscape_elements} layout={cytoscape_layout}
            style={{ width: '100%', height: '100%' }} 
            stylesheet={[
              {
                selector: 'edge',
                style: {
                  'label': 'data(label)',
                  'color': '#546e7a', // Grey
                  'text-wrap': 'wrap',
                  'font-size': '18px',
                  'text-opacity': 0.9,
                  'target-arrow-shape': 'triangle',
                  // 'line-color': '#ccc',
                  // 'target-arrow-color': '#ccc',
                  // Control multi edge on 2 nodes:
                  'curve-style': 'bezier',
                  'control-point-step-size': 300,
                  // width: 15
                }
              },
              {
                selector: 'node',
                style: {
                  'label': 'data(label)',
                  'text-wrap': 'wrap',
                  'font-size': '30px',
                  // width: 20,
                  // height: 20,
                  // shape: 'rectangle'
                }
              }
            ]}
          />
        </Paper>
      </> )}

 
    
    </Container>
  )
}
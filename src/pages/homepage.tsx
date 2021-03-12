import React from 'react';
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, Container, Paper, CircularProgress } from "@material-ui/core";
import axios from 'axios';

// Import jquery datatables.net
import 'datatables.net-dt/css/jquery.dataTables.min.css'
const $ = require('jquery');
$.DataTable = require('datatables.net');

import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

import { Graph, drawLine } from "perfect-graph";
import { ApplicationProvider } from 'unitx-ui';

import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import Cola from 'cytoscape-cola';

import LinkDescribe from '../components/LinkDescribe';
import About from './About';

// import { data } from "@solid/query-ldflex";
// import data from "@solid/query-ldflex";
// import { LoggedIn, LoggedOut, Value, useWebId } from '@solid/react';
// import { Like } from '@solid/react';
// import SolidStar from "./SolidStar";

// import {newEngine} from '@comunica/actor-init-sparql';
// import {ActorInitSparql} from '@comunica/actor-init-sparql/lib/ActorInitSparql-browser';
// import {IQueryOptions, newEngineDynamicArged} from "@comunica/actor-init-sparql/lib/QueryDynamic";

Cytoscape.use(Cola);

const useStyles = makeStyles(theme => ({
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    // textAlign: 'center',
  },
  paperSearch: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '30%',
  },
  searchInput: {
    marginLeft: theme.spacing(1),
    width: '50%',
    fontSize: '14px',
    flex: 1,
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
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 0),
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  loadSpinner: {
    padding: theme.spacing(10, 10)
  },
}))

export default function Homepage() {
  const classes = useStyles();
  const theme = useTheme();
  
  const [state, setState] = React.useState({
    isLoading: true,
    describe_endpoint: '',
    webid: '',
    projects_list: [],
    search: '',
    get_all_graphs_results: [],
    hcls_overview_results: [],
    entities_relations_overview_results: [],
    graph_data: {nodes: [], edges: []},
    cytoscape_elements: [],
    repositories_hash: {},
    category_pie: {}
  });

  const stateRef = React.useRef(state);

  // Avoid conflict when async calls
  // Can be done with another lib (cf. Turgay)
  const updateState = React.useCallback((update) => {
    stateRef.current = {...stateRef.current, ...update};
    setState(stateRef.current);
  }, [setState]);

  // Check SOLID pod for a user preferences file
  // https://github.com/solid/react-components/blob/master/demo/app.jsx
  // https://solid.github.io/react-components/

  // useLocation hook to get SOLID WebID
  // let solid_webid = useWebId();

  // function createEmptyDocument() {
  //   // const location = "/public/into-the-graph/preferences.ttl";
  //   const webId = useWebId();
  //   // console.log("webId!!");
  //   // console.log(webId);
  //   // return data[webId + location].put();
  // }

  // async function WebIdStatus() {
  //   updateState({webid: useWebId()})
  //   // const webId = useWebId();
  //   // .replace("profile/card#me", "public/into-the-graph/preferences.ttl");
  //   // const location = webId.replace("profile/card#me", "public/into-the-graph/preferences.ttl");
  //   // return data[webId + location].put();
  //   return <span>Preferences stored at {webId}.</span>;
  // }

  // TODO: fix to use webid hook
  // async function createEmptyDocument(location: any) {
  //   // webId.replace("profile/card#me", "public/into-the-graph/preferences.ttl");
  //   return data[location].put();
  // }
  
  function displayTableCell(stringToDisplay: any) {
    if (stringToDisplay) {
      return stringToDisplay.value;
    } else {
      return 'Not computed';
    }
  }

  // Run at start of the page
  React.useEffect(() => {

    let describe_endpoint = '';
    // Get sparql_endpoint from cookie intothegraphSettings
    if (!describe_endpoint) {
      const localStorageConfig = localStorage.getItem("intothegraphSettings");
      if (localStorageConfig) {
        let configState: any = JSON.parse(localStorageConfig);
        describe_endpoint = configState.sparql_endpoint;
      }
    }
    if (!describe_endpoint) {
      // If no endpoint found in localStorage
      describe_endpoint = 'https://graphdb.dumontierlab.com/repositories/ncats-red-kg';
      // describe_endpoint = 'https://bio2rdf.org/sparql';
    }
    updateState({ describe_endpoint: describe_endpoint });

    Yasgui.defaults.requestConfig.endpoint = describe_endpoint;
    // @ts-ignore If endpoint and query provided
    let yasgui: any = new Yasgui(document.getElementById('yasguiDiv'), {
      requestConfig: { endpoint: describe_endpoint },
      copyEndpointOnNewTab: true,
    });
    // yasgui.addTab(
    //   true, // set as active tab
    //   { ...Yasgui.Tab.getDefaults(), yasqe: { value: props.query }}
    // );

    axios.get(describe_endpoint + `?query=` + encodeURIComponent(get_all_graphs_query))
      .then((res: any) => {
        console.log('after get all graphs');
        console.log(res);
        if (res.data.results){
          updateState( { get_all_graphs_results: res.data.results.bindings } );
          // updateState({ graphsLoading: false });
          // $(this.refs.graphsOverview).DataTable();
          $('#datatableAllGraphs').DataTable({
            "autoWidth": false
          });
        }
      })
      .catch((error: any) => {
        console.log('Query to get all graphs failed');
        console.log(error);
      });

    axios.get(describe_endpoint + `?query=` + encodeURIComponent(hcls_overview_query))
      .then((res: any) => {
        if (res.data.results){
          updateState( { hcls_overview_results: res.data.results.bindings } );
          // updateState({ graphsLoading: false });
          // $(this.refs.graphsOverview).DataTable();
          $('#datatableHclsOverview').DataTable({
            "autoWidth": false
          });
        }
      })
      .catch((error: any) => {
        console.log('Query to get HCLS stats overview failed');
        console.log(error);
      });

    axios.get(describe_endpoint + `?query=` + encodeURIComponent(entities_relations_query))
      .then((res: any) => {
        if (res.data.results){
          updateState( { entities_relations_overview_results: res.data.results.bindings } );
          // updateState({ graphsLoading: false });
          // $(this.refs.graphsOverview).DataTable();
          $('#datatableEntitiesRelationOverview').DataTable({
            "autoWidth": false
          });

          let graph_nodes: any = {}
          let graph_edges: any = {}
          let cytoscape_elements: any = []
          let node_count = 1;
          let edge_count = 0;
          const edge_max = 100;

          // Prepare perfect graph and cytoscape data
          res.data.results.bindings.forEach((result_row: any) => {
            let subject_count = 1;
            if (result_row.subjectCount) {
              subject_count = result_row.subjectCount.value;
            }
            // Add subject node to hash if not present
            if (!(result_row.subject.value in graph_nodes)) {
              // If not already in array
              graph_nodes[result_row.subject.value] = {
                id: result_row.subject.value,
                position: { x: node_count * 80, y: node_count * 100 },
                data: { uri: result_row.subject.value, color: 'red', size: subject_count },
              };
              // cytoscape_elements.push({ data: { 
              //   id: result_row.subject.value, 
              //   label: result_row.subject.value, 
              //   size: result_row.subjectCount.value
              // } })
              node_count += 1;
            } else {
              graph_nodes[result_row.subject.value].data.size += subject_count;
            }

            let object_count = 1;
            if (result_row.objectCount) {
              object_count = result_row.objectCount.value;
            }
            // Add object node
            if (result_row.object) {
              if (!(result_row.object.value in graph_nodes)) {
                // If not already in array
                graph_nodes[result_row.object.value] = {
                  id: result_row.object.value,
                  position: { x: node_count * 80, y: node_count * 40 },
                  data: { uri: result_row.object.value, color: 'green', size: object_count },
                };
                // cytoscape_elements.push({ data: { 
                //   id: result_row.object.value, 
                //   label: result_row.object.value,
                //   size: result_row.objectCount.value
                // } })
                node_count += 1;
              } else {
                graph_nodes[result_row.object.value].data.size += object_count;
              }
            }

            // Add edge between the 2 nodes
            if (result_row.object && edge_count < edge_max) {
              const edge_id = result_row.subject.value + result_row.predicate.value + result_row.object.value;
              if (!(edge_id in graph_edges)) {
                if (!(result_row.object.value === result_row.subject.value)) {
                  // Prevents link to itself (too confusing currently)
                  graph_edges[edge_id] = {
                    id: edge_id,
                    source: result_row.subject.value,
                    target: result_row.object.value,
                    data: { uri: result_row.predicate.value, color: 'green' }
                  };
                  cytoscape_elements.push({ data: { 
                    source: result_row.subject.value, 
                    target: result_row.object.value, 
                    label: result_row.predicate.value 
                  } })
                }
                edge_count += 1
              }
            }
          })

        // Convert graph nodes and edges objects to arrays
        const graph_nodes_array = Object.keys(graph_nodes).map(function(node_id){
          cytoscape_elements.push({ data: { 
            id: node_id, 
            label: node_id, 
            size: graph_nodes[node_id].data.size
          } })
          return graph_nodes[node_id];
        });
        const graph_edges_array = Object.keys(graph_edges).map(function(edge_id){
          // cytoscape_elements.push({ data: { 
          //   source: graph_edges[edge_id].source, 
          //   target: graph_edges[edge_id].target, 
          //   label: graph_edges[edge_id].data.uri 
          // } })
          return graph_edges[edge_id];
        });

        console.log('Graph nodes and edges data');
        console.log(graph_nodes_array);
        console.log(graph_edges);


        updateState({
          graph_data: { nodes: graph_nodes_array, edges: graph_edges_array },
          cytoscape_elements: cytoscape_elements,
          isLoading: false
        })
        }
      })
      .catch((error: any) => {
        console.log('Query to get all HCLS entities-relations infos FAILED:');
        console.log(error);
      });


  }, [])  
  // This useless array needs to be added for React to understand he needs to use the state inside...

  // }, [solid_webid])
  // Trying out the SOLID webId hook

  const get_all_graphs_query = `SELECT DISTINCT ?graph WHERE { GRAPH ?graph {?s ?p ?o} }`;

  // TODO: For Bio2RDF documented queries fails
  // https://github.com/bio2rdf/bio2rdf-scripts/wiki/Bio2RDF-Dataset-Summary-Statistics


  const hcls_overview_query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
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

  const entities_relations_query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX bl: <http://w3id.org/biolink/vocab/>
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>
  PREFIX idot: <http://identifiers.org/idot/>
  PREFIX dcat: <http://www.w3.org/ns/dcat#>
  PREFIX void: <http://rdfs.org/ns/void#>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX void-ext: <http://ldf.fi/void-ext#>
  SELECT DISTINCT ?metadataGraph ?graph ?subjectCount ?subject ?predicate ?objectCount ?object
  WHERE {
    GRAPH ?metadataGraph {
      # ?graph a void:Dataset .
      ?graph void:propertyPartition [
        void:property ?predicate ;
        void:classPartition [
          void:class ?subject ;
          void:distinctSubjects ?subjectCount ;
        ];
        void-ext:objectClassPartition [
        void:class ?object ;
        void:distinctObjects ?objectCount ;
        ]
      ] .
      }
    } ORDER BY DESC(?subjectCount)`;

  // Change Cytoscape layout
  // https://js.cytoscape.org/#layouts

  const cytoscape_layout = {
    name: 'cola',
    nodeSpacing: 400,
    edgeLengthVal: 1500,
    animate: false,
    randomize: false,
    maxSimulationTime: 1500
  }
  // const cytoscape_layout = { 
  //   name: 'concentric',
  //   minNodeSpacing: 200
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

      <About />

      {/* <Paper elevation={4} className={classes.paperPadding}>
        <Typography variant="body1" className={classes.margin}>
          Provide the <b>URI to describe</b>, and the <b>SPARQL endpoint</b> queried in the URL parameters, such as:
        </Typography>

        <Typography variant="h5" className={classes.margin}>
          <Link to={{
            pathname: '/describe',
            search: '?uri=https://identifiers.org/drugbank:DB00002&endpoint=https://graphdb.dumontierlab.com/repositories/ncats-red-kg',
            // search: '?uri=http://bio2rdf.org/clinicaltrials:NCT00209495&endpoint=https://bio2rdf.org/sparql',
          }} className={classes.link}>
            /describe?uri=https://identifiers.org/drugbank:DB00002&endpoint=https://graphdb.dumontierlab.com/repositories/ncats-red-kg
          </Link>
        </Typography>
      </Paper>

      <Typography variant="body1" className={classes.margin} style={{textAlign: 'left', marginTop: theme.spacing(5) }}>
        <b>Into the Graph</b> provides a simple RDF web browser that just need a SPARQL endpoint URL to resolve URIs, and explore the available linked data.
      </Typography>
      
      <Typography variant="body1" className={classes.margin} style={{ textAlign: 'left' }}>
        This linked data browser features:
        <br/>🔎 A web-based UI to browse any SPARQL endpoints content easily
        <br/>🕸️ Native support for graphs (nquads)
        <br/>🏗️ Work in progress: visualize and browse concepts using <a href='https://perfectgraph-5c619.web.app' target='_blank' rel="noopener noreferrer"><code>perfect-graph</code></a>
        <br/>🚧 Work in progress: insights about the content of the triplestore and its different graphs, using precomputed HCLS descriptives statistics
      </Typography>

      <Typography variant="body1" className={classes.margin} style={{textAlign: 'left'}}>
        Other relevant libraries:
      </Typography>
      <ul style={{textAlign: 'left'}}>
        <li><Typography variant="body1">
          <a href='https://github.com/micheldumontier/torres-api-platform/' className={classes.link} target='_blank' rel="noopener noreferrer">TORRES API platform</a> to store HCLS descriptive metadata for your dataset
        </Typography></li>
        <li><Typography variant="body1">
          <a href='https://github.com/MaastrichtU-IDS/fair-metadata' className={classes.link} target='_blank' rel="noopener noreferrer">FAIR metadata</a> python lib: to generate HCLS descriptive metadata for your dataset
        </Typography></li>
        <li><Typography variant="body1">
          <a href='https://github.com/MaastrichtU-IDS/d2s-project-template/tree/master/datasets/preppi' className={classes.link} target='_blank' rel="noopener noreferrer">Data2Services workflows</a> to generate RDF knowledge graphs from structured data using RML (RDF Mapping Language)
        </Typography></li>
      </ul> */}

      {/* Display YASGUI */}
      <Paper elevation={4} className={classes.paperPadding} style={{ textAlign: 'left', marginTop: theme.spacing(4) }}>
        <div id="yasguiDiv"></div>
      </Paper>

      {/* Display a datatable with subject, predicate, object, graph retrieved */}
      {Object.keys(state.get_all_graphs_results).length > 0 && (<>
        <Typography variant="h5" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
        <a href={state.describe_endpoint} className={classes.link} >{state.describe_endpoint}</a> endpoint overview
        </Typography>
        <Paper elevation={4} className={classes.paperPadding}>
          <table id='datatableAllGraphs' style={{ wordBreak: 'break-all' }}>
            <thead>
              <tr>
                <th>Graphs</th>
              </tr>
            </thead>
            <tbody>
              {/* Iterate Describe query results array */}
              {state.get_all_graphs_results.map((row: any, key: number) => {
                // return <Tooltip title={displayDescription(row.name, row.description)} key={key}>
                return <tr key={key}>
                    <td><LinkDescribe variant='body2' uri={row.graph.value}/></td>
                  </tr>
                {/* </Tooltip>; */}
              })}
            </tbody>
          </table>
        </Paper>
        </>)}

        {Object.keys(state.hcls_overview_results).length > 0 && (<>
        <Typography variant="h5" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
          Endpoint <b>descriptive metadata</b> (<a href={state.describe_endpoint} className={classes.link}>HCLS</a>)
        </Typography>
        <Paper elevation={4} className={classes.paperPadding}>
          <table id='datatableHclsOverview' style={{ wordBreak: 'break-all' }}>
            <thead>
              <tr>
                <th>Graph</th>
                <th>Date generated</th>
                <th># of triples</th>
                <th># of entities</th>
                <th># of properties</th>
                <th># of classes</th>
              </tr>
            </thead>
            <tbody>
              {/* Iterate Describe query results array */}
              {state.hcls_overview_results.map((row: any, key: number) => {
                // return <Tooltip title={displayDescription(row.name, row.description)} key={key}>
                return <tr key={key}>
                    <td><LinkDescribe variant='body2' uri={row.graph.value}/></td>
                    <td><Typography variant="body2">{displayTableCell(row.dateGenerated)}</Typography></td>
                    <td><Typography variant="body2">{displayTableCell(row.statements)}</Typography></td>
                    <td><Typography variant="body2">{displayTableCell(row.entities)}</Typography></td>
                    <td><Typography variant="body2">{displayTableCell(row.properties)}</Typography></td>
                    <td><Typography variant="body2">{displayTableCell(row.classes)}</Typography></td>
                  </tr>
                {/* </Tooltip>; */}
              })}
            </tbody>
          </table>
        </Paper>
        </>)}

        <Paper elevation={4} className={classes.paperPadding}>
          {state.isLoading && (
            <CircularProgress className={classes.loadSpinner} />
          )}

          {state.graph_data.nodes.length > 0 && (<>
            <Typography variant="h5" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
              <b>Entities-relations</b> metadata (<a href={state.describe_endpoint} className={classes.link}>HCLS</a>)
            </Typography>
            <Typography variant="body1" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
              <a href='https://perfectgraph-5c619.web.app/' className={classes.link} target='_blank' rel="noopener noreferrer">
                <b>Perfect Graph</b>
              </a> visualization
            </Typography>
            <Paper elevation={4} className={classes.paperPadding}>
              <ApplicationProvider>
                <Graph
                  style={{ width: '100%', height: 800 }}
                  config={{ layout: Graph.Layouts.euler }}
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
                        {data.uri.substring(data.uri.lastIndexOf('/') + 1)}
                      </Graph.Text>
                      {/* <LinkDescribe variant='body2' uri={data.uri}/> */}
                    </Graph.View>
                  )}
                />
              </ApplicationProvider>
            </Paper>
          </> )}

          {state.graph_data.nodes.length > 0 && (<>
            <Typography variant="body1" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
              <a href='https://github.com/plotly/react-cytoscapejs' className={classes.link} target='_blank' rel="noopener noreferrer">
                <b>Cytoscape JS</b>
              </a> visualization
            </Typography>
            <Paper elevation={4} className={classes.paperPadding} style={{ height: '80vh', textAlign: 'left' }}>
              <CytoscapeComponent elements={state.cytoscape_elements} layout={cytoscape_layout}
                style={{ width: '100%', height: '100%',  }} 
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
                    }
                  },
                  {
                    selector: 'node',
                    style: {
                      'label': 'data(label)',
                      'text-wrap': 'wrap',
                      'font-size': '30px',
                      // width: 15,
                      // 'width': 'data(size)',
                      // 'height': 'data(size)',
                      // shape: 'rectangle'
                    }
                  }
                ]}
              />
            </Paper>
          </> )}

          {Object.keys(state.entities_relations_overview_results).length > 0 && (<>
            <Typography variant="body1" className={classes.margin} style={{ marginTop: theme.spacing(6) }}>
              <a href='https://datatables.net' className={classes.link} target='_blank' rel="noopener noreferrer">
                Datatable
              </a>
            </Typography>
            <Paper elevation={4} className={classes.paperPadding}>
              <table id='datatableEntitiesRelationOverview' style={{ wordBreak: 'break-all' }}>
                <thead>
                  <tr>
                    <th>Graph</th>
                    <th># of instance of subject</th>
                    <th>Subject class</th>
                    <th>Have relation</th>
                    <th>With Object class</th>
                    <th># of instance of object</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Iterate Describe query results array */}
                  {state.entities_relations_overview_results.map((row: any, key: number) => {
                    return <tr key={key}>
                        <td><LinkDescribe uri={row.graph.value} variant='body2'/></td>
                        <td><Typography variant="body2">{displayTableCell(row.subjectCount)}</Typography></td>
                        <td><LinkDescribe uri={row.subject.value} variant='body2'/></td>
                        <td><LinkDescribe uri={row.predicate.value} variant='body2'/></td>
                        {row.object && (
                          <td><LinkDescribe uri={row.object.value} variant='body2'/></td>
                        )}
                        {!row.object && (
                          <td><Typography variant="body2">Not found</Typography></td>
                        )}
                        <td><Typography variant="body2">{displayTableCell(row.objectCount)}</Typography></td>
                      </tr>
                  })}
                </tbody>
              </table>
            </Paper>
          </>)}

        </Paper>

      {/* <LoggedIn>
        <Typography style={{textAlign: 'center', marginBottom: '20px'}}>
          Welcome <Value src="user.name"/>!
        </Typography>
        <Typography style={{textAlign: 'center', marginBottom: '20px'}}>
          Soon you will be able to use your SOLID account! 
        </Typography>
      </LoggedIn>
      <LoggedOut>
        <Typography style={{textAlign: 'center', marginBottom: '20px'}}>
          Welcome
        </Typography>
      </LoggedOut> */}

    </Container>
  )

}


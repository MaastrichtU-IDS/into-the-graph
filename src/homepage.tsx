import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Container, Box, Button, Chip, Tooltip, Grid, Paper } from "@material-ui/core";
// import { data } from "@solid/query-ldflex";
// import data from "@solid/query-ldflex";

import { LoggedIn, LoggedOut, Value, useWebId } from '@solid/react';

// import { Like } from '@solid/react';
// import SolidStar from "./SolidStar";

// import {newEngine} from '@comunica/actor-init-sparql';
// import {ActorInitSparql} from '@comunica/actor-init-sparql/lib/ActorInitSparql-browser';
// import {IQueryOptions, newEngineDynamicArged} from "@comunica/actor-init-sparql/lib/QueryDynamic";

const useStyles = makeStyles(theme => ({
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
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  },
  cardSubtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  pos: {
    // marginBottom: 12,
  },
}))

export default function Homepage() {
  const classes = useStyles();
  
  const [state, setState] = React.useState({
    webid: '',
    projects_list: [],
    search: '',
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

  // useLocation hook to get SOLID WebID
  let solid_webid = useWebId();


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
  

  // componentDidMount
  React.useEffect(() => {
    // console.log('solid_webid');
    // console.log(solid_webid);

    // Check SOLID pod for a user preferences file
    // https://github.com/solid/react-components/blob/master/demo/app.jsx
    // https://solid.github.io/react-components/

  }, [])  
  // This useless array needs to be added for React to understand he needs to use the state inside...

  // }, [solid_webid])
  // Trying out the SOLID webId hook

  return(
    <Container className='mainContainer'>
      <Typography variant="h4" style={{textAlign: 'center', marginBottom: '15px'}}>
        🧭 Into the Graph
        {/* <img src={idsLogo} style={{maxWidth: '200px'}} alt="IDS Logo" /> */}
      </Typography>

      <Paper elevation={4} className={classes.paperPadding}>
        <Typography variant="body1" style={{textAlign: 'center', marginBottom: '20px', marginTop: '15px'}}>
          Provide the URI to describe and the SPARQL endpoint queried, such as:
        </Typography>

        <Typography variant="h5" style={{textAlign: 'center', marginBottom: '20px'}}>
          <a href="/describe?uri=http://bio2rdf.org/clinicaltrials:NCT00209495&endpoint=https://bio2rdf.org/sparql">/describe?uri=http://bio2rdf.org/clinicaltrials:NCT00209495&endpoint=https://bio2rdf.org/sparql</a>
        </Typography>
      </Paper>

      <Typography variant="body1" style={{textAlign: 'left', marginBottom: '20px'}}>
        <b>Into the Graph</b> provides a simple RDF web browser that just need a SPARQL endpoint URL to resolve URIs, and explore the available linked data.
      </Typography>
      
      <Typography variant="body1" style={{textAlign: 'left', marginBottom: '10px'}}>
        This linked data browser features:
        <br/>🔎 A web-based UI to browse any SPARQL endpoints content easily
        <br/>🕸️ Native support for graphs (nquads)
        <br/>🏗️ Work in progress: visualize and browse concepts using <a href='https://perfectgraph-5c619.web.app' target='_blank'><code>perfect-graph</code></a>
        <br/>🏗️ Work in progress: insights about the content of the triplestore and its different graphs, using precomputed HCLS descriptives statistics
      </Typography>


      <Typography variant="body1" style={{textAlign: 'left'}}>
        Other relevant libraries:
      </Typography>
      <ul>
        <li><a href='https://github.com/micheldumontier/torres-api-platform/'>TORRES API platform</a> to store HCLS descriptive metadata for your dataset</li>
        <li><a href='https://github.com/MaastrichtU-IDS/fair-metadata'>FAIR metadata</a> python lib: to generate HCLS descriptive metadata for your dataset</li>
        <li><a href='https://github.com/MaastrichtU-IDS/d2s-project-template/tree/master/datasets/preppi'>Data2Services workflows</a> to generate RDF knowledge graphs from structured data using RML (RDF Mapping Language)</li>
      </ul>

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


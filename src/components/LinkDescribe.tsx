import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// var Config = require('Config')

const useStyles = makeStyles(theme => ({
  uriLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    '& :hover': {
      color: theme.palette.primary.main,
    },
    overflowWrap: 'break-word'
  }
}));


// Format a link to be displayedby shortening URI
export default function LinkDescribe(props: any) {
  const classes = useStyles();

  // TODO: use centralized service (prefixcommons/prefix.cc?)
  const prefixRegistry = {
    "rdf":         "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs":        "http://www.w3.org/2000/01/rdf-schema#",
    "owl":         "http://www.w3.org/2002/07/owl#",
    "skos":        "http://www.w3.org/2004/02/skos/core#",
    "bl":          "https://w3id.org/biolink/vocab/",
    "d2s":         "https://w3id.org/d2s/",
    "omop":        "http://api.ohdsi.org/WebAPI/vocabulary/concept/",
    "cohd":        "https://w3id.org/trek/cohd/",
    "bio2rdf":     "http://bio2rdf.org/",
    "dbo":         "http://dbpedia.org/ontology/",
    "dbp":         "http://dbpedia.org/property/",
    "wd":          "http://www.wikidata.org/entity/",
    "wdt":         "http://www.wikidata.org/prop/direct/",
    "dc":          "http://purl.org/dc/elements/1.1/",
    "dct":         "http://purl.org/dc/terms/",
    "dctypes":     "http://purl.org/dc/dcmitype/",
    "foaf":        "http://xmlns.com/foaf/0.1/",
    "idot":        "http://identifiers.org/idot/",
    "dcat":        "http://www.w3.org/ns/dcat#",
    "void":        "http://rdfs.org/ns/void#",
    "void-ext":    "http://ldf.fi/void-ext#",
    "obo":         "http://purl.obolibrary.org/obo/",
    "ncit":        "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#",
    "xsd":         "http://www.w3.org/2001/XMLSchema#",
    "schema":      "http://schema.org/",
    "cito":        "http://purl.org/spar/cito/"
  };

  function shortenUri(uriToShorten: string) {
    for (const prefix in prefixRegistry) {
      if (uriToShorten.startsWith(prefixRegistry[prefix])) {
        return uriToShorten.replace(prefixRegistry[prefix], prefix + ':');
      }
    }
    return uriToShorten;
  }

  if(/^(?:node[0-9]+)|((https?|ftp):.*)$/.test(props.uri)) {
    // Process URIs
    return (
      <a href={'/describe?uri=' + props.uri} className={classes.uriLink}>
        <Typography variant={props.variant} className={props.passClass}
        style={{overflowWrap: 'break-word'}}>
          {shortenUri(props.uri)}
        </Typography>
      </a>
    )
  }
  return (
    // For non URI
    <Typography variant={props.variant} className={props.passClass} 
    style={{textAlign: 'left', overflowWrap: 'break-word'}}>
      {props.uri}
    </Typography>
  )
}
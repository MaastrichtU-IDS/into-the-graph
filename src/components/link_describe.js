import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  uriLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    '& :hover': {
      color: theme.palette.primary.main,
    },
  }
}));

// Format a link to be displayedby shortening URI
export function LinkDescribe(props) {
  const classes = useStyles();

  const prefixRegistry = {
    bl: 'http://w3id.org/biolink/vocab/',
    biolink: 'https://w3id.org/biolink/vocab/',
    d2s: 'https://w3id.org/data2services/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    dc: 'http://purl.org/dc/elements/1.1/',
    obo: 'http://purl.obolibrary.org/obo/',
    owl: 'http://www.w3.org/2002/07/owl#',
    ido: 'http://identifiers.org/',
  };

  function shortenUri(uriToShorten) {
    for (const prefix in prefixRegistry) {
      if (uriToShorten.startsWith(prefixRegistry[prefix])) {
        return uriToShorten.replace(prefixRegistry[prefix], prefix + ':');
      }
    }
    return uriToShorten;
  }

  if (props.uri.startsWith('http://') || props.uri.startsWith('https://')) {
    // Process URIs
    return (
      <a href={'/describe?uri=' + props.uri} className={classes.uriLink}>
        {console.log(props.fontWeight)}
        <Typography variant={props.variant} className={props.passClass}>
          {shortenUri(props.uri)}
        </Typography>
      </a>
    )
  }
  return (
    // For non URI
    <Typography variant={props.variant} className={props.passClass} style={{textAlign: 'left'}}>
      {props.uri}
    </Typography>
  )
}
import React, { Component } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
  uriLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
    '& :hover': {
      color: '#2196f3',
    },
  }
}));

// Display the panels showing s,p,o for each graph 
export function LinkDescribe(props) {
  const classes = useStyles();
  // const [value, setValue] = React.useState(0);
  // const { classes } = props;

  const prefixRegistry = {
    bl: 'http://w3id.org/biolink/vocab/',
    biolink: 'https://w3id.org/biolink/vocab/',
    d2s: 'https://w3id.org/data2services/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    dc: 'http://purl.org/dc/elements/1.1/',
    obo: 'http://purl.obolibrary.org/obo/',
    owl: 'http://www.w3.org/2002/07/owl#',
    // ido: 'http://identifiers.org/',
  };

  function shortenUri(uriToShorten) {
    console.log(props);
    if (uriToShorten.startsWith('http://') || uriToShorten.startsWith('https://')) {
      for (const prefix in prefixRegistry) {
        if (uriToShorten.startsWith(prefixRegistry[prefix])) {
          return uriToShorten.replace(prefixRegistry[prefix], prefix + ':');
        }
      }
    }
    return uriToShorten;
  }

  return (
    <a href={'/describe?uri=' + props.uri} className={classes.uriLink}>
      <Typography variant={props.variant}>
        {shortenUri(props.uri)}
      </Typography>
    </a>
  )
}
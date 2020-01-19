import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

var Config = require('Config')

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
export function LinkDescribe(props) {
  const classes = useStyles();

  // TODO: use centralized service (prefixcommons/prefix.cc?)
  const prefixRegistry = Config.prefixes;

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
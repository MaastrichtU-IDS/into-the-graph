import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Config from "./Config";

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

  const prefixRegistry = Config.prefix_registry;

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
      <Link to={{
        pathname: '/describe',
        search: '?uri=' + props.uri,
      }} className={classes.uriLink}>
        <Typography variant={props.variant} className={props.passClass}
        style={{overflowWrap: 'break-word'}}>
          {shortenUri(props.uri)}
        </Typography>
      </Link>
      // <a href={'/describe?uri=' + props.uri} className={classes.uriLink}>
      //   <Typography variant={props.variant} className={props.passClass}
      //   style={{overflowWrap: 'break-word'}}>
      //     {shortenUri(props.uri)}
      //   </Typography>
      // </a>
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
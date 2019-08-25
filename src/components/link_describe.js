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

  function shortenUri(uriToShorten) {
    console.log(props);
    return uriToShorten;
  }
  return (
    <a href={'/describe?uri=' + props.uri} className={classes.uriLink}>
    {/* <a href={'/describe?uri=' + this.state.describeUri}> */}
      <Typography variant={props.variant}>
        {shortenUri(props.uri)}
      </Typography>
    </a>
  )
}
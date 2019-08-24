import React from "react";
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
 
const useStyles = makeStyles(theme => ({
  menuButton: {
    // background: '#fafafa'
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  }
}));
 
export default function Sparql() {
  const classes = useStyles();

  return (
    <Container>
      <Typography component="p">
        This is the SPARQL me page.
      </Typography >
    </Container>
  );
}
 
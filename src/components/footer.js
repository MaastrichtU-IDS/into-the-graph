import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // minHeight: '100%',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  darkLink: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.light,
      textDecoration: 'none',
    },
  },
  whiteLink: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: theme.palette.primary.dark,
      textDecoration: 'none',
    },
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
  },
}));

function Copyright() {
  const classes = useStyles();
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a className={classes.darkLink} target="_blank"
      href="https://maastrichtuniversity.nl/ids">
        Institute of Data Science at Maastricht University
      </a>{' '}
      {'2019-2020.'}
    </Typography>
  );
}

export default function Footer() {
  const classes = useStyles();

  return (
      <footer className={classes.footer}>
        <Container maxWidth="md">
          <a href="https://github.com/MaastrichtU-IDS/into-the-graph" target="_blank">
            <img alt="GitHub repository" src="https://img.shields.io/github/stars/MaastrichtU-IDS/into-the-graph?label=into-the-graph&style=social"/>
          </a>
          <Typography variant="body2">
            The code of this site is licensed under the&nbsp;
            <a className={classes.whiteLink} target="_blank"
            href="https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/LICENSE">
              MIT license
            </a>
            <br/>License of the displayed data is defined by the SPARQL endpoint provider
          </Typography>
          <Copyright />
        </Container>
      </footer>
  );
}
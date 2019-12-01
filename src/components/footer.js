import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

// import CssBaseline from '@material-ui/core/CssBaseline';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://maastrichtuniversity.nl/ids">
        Institute of Data Science at Maastricht University
      </Link>{' '}
      {'2019-2020.'}
      {/* <Link color="inherit" href="https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/LICENSE">
        MIT license
      </Link> */}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // minHeight: '100vh',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    color: 'white',
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    // <div className={classes.root}>
    //   <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body2">
            The code of this site is licensed under the&nbsp;
            <Link color="inherit" href="https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/LICENSE">
              MIT license
            </Link>
            <br/>License of the displayed data is defined by the provider
          </Typography>
          <Copyright />
        </Container>
      </footer>
    // </div>
  );
}
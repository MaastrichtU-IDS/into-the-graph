import * as React from 'react';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const styles = ({ spacing, palette }: Theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // minHeight: '100%',
  },
  main: {
    marginTop: spacing(8),
    marginBottom: spacing(2),
  },
  darkLink: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: palette.primary.light,
      textDecoration: 'none',
    },
  },
  whiteLink: {
    textDecoration: 'none',
    color: 'inherit',
    '&:hover': {
      color: palette.primary.dark,
      textDecoration: 'none',
    },
  },
  footer: {
    padding: spacing(2),
    marginTop: 'auto',
    color: 'white',
    backgroundColor: palette.primary.main,
  },
});

// type Props = {
interface Props {
  classes: any
}

const Copyright = withStyles(styles)(({ classes }: Props) => (
  <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <a className={classes.darkLink} target="_blank"
      href="https://maastrichtuniversity.nl/ids">
        Institute of Data Science at Maastricht University
      </a>{' '}
      {'2019-2020.'}
    </Typography>
));

function Footer({classes}: Props) {
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
            {/* <img src={require('../assets/images/mit_license.png')} /> */}
          </Typography>
          <Copyright />
        </Container>
      </footer>
  );
}
export default withStyles(styles)(Footer)

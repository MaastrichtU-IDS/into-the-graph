import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';

// Everything freezes when we import YASGUI.
// Such a robust and reliable framework
import '../assets/css/yasgui.min.css';
import YASGUI from '../assets/js/yasgui.min.js'

const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  }
})

class Sparql extends Component {
  state = {}

  componentDidMount() {
    YASGUI.defaults.yasqe.sparql.endpoint = 'http://graphdb.dumontierlab.com/repositories/test';
    // var config = {"api":{"urlShortener":"//yasgui.org/shorten"}};
    const yasgui = YASGUI(document.getElementById('yasguiDiv'));
    yasgui.addTab('statisticsTab');
    yasgui.selectTab('statisticsTab').rename('Graphs statistics');
    yasgui.selectTab('statisticsTab').setQuery(this.statisticsQuery);
    yasgui.addTab('entitiesRelationsTab');
    yasgui.selectTab('entitiesRelationsTab').rename('Explore entities relations');
    yasgui.selectTab('entitiesRelationsTab').setQuery(this.entitiesRelationsQuery);
  }

  render () {
    const { classes } = this.props;

    return <Container>
        <Typography component="p">
          This is the SPARQL me page.
          <div id="yasguiDiv"></div>
        </Typography >
      </Container>
  }
}

export default withStyles(styles)(Sparql);


 
import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import Footer from './footer';
import TriplestoreContext from '../TriplestoreContext';

var Config = require('Config')

const styles = theme => ({
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(2, 2),
  }
})

class DeployYasgui extends Component {
  static contextType = TriplestoreContext;

  defaultQuery = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
      "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
      "SELECT * WHERE {\n" +
      "  ?sub ?pred ?obj .\n" +
      "} LIMIT 10";

  componentDidMount() {
    // Documentation: https://triply.cc/docs/yasgui-api

    // const yasguiConfig = {
    //   requestConfig: {
    //     endpoint: 'this.context.triplestore.sparql_endpoint',
    //     method: 'POST',
    //     //Example of using a getter function to define the headers field:
    //     // headers: () => ({
    //     //   'key': 'value'
    //     // }),
    //   },
    //   resizeable: true,  // Allow resizing of the Yasqe editor
    //   autofocus: true, // Whether to autofocus on Yasqe on page load
    //   copyEndpointOnNewTab: false  // Use the default endpoint when a new tab is opened
    //   // Configuring which endpoints appear in the endpoint catalogue list
    //   // endpointCatalogueOptions.getData = () => {}
    // }
    // Yasgui.defaults = yasguiConfig;
    // Yasgui.Yasqe.defaults = yasguiConfig;

    Yasgui.defaults.endpoint = this.context.triplestore.sparql_endpoint;
    Yasgui.defaults.requestConfig.endpoint = this.context.triplestore.sparql_endpoint;
    Yasgui.Yasqe.defaults.requestConfig.endpoint = this.context.triplestore.sparql_endpoint;
    // TODO: fix this, and add catalog in settings.xml
    // const catalogEndpoint = { endpoint: this.context.triplestore.sparql_endpoint }
    Yasgui.defaults.endpointCatalogueOptions.getData = () => {
      return [
        { endpoint: "https://graphdb.dumontierlab.com/repositories/trek" },
        { endpoint: "https://graphdb.dumontierlab.com/repositories/bio2rdf-ammar" },
        { endpoint: "https://graphdb.dumontierlab.com/repositories/ncats-red-kg" },
        { endpoint: "https://bio2rdf.org/sparql" },
        { endpoint: "http://localhost:8890/sparql" },
        { endpoint: "http://localhost:7200/repositories/test" },
        { endpoint: "http://localhost:8082/bigdata/sparql" }
      ];
    };

    // Define Yasr prefixes don't change the namespaces resolved in the results
    // TODO: update the prefixes
    Yasgui.Yasr.defaults.prefixes = Config.prefixes;
    Yasgui.defaults.yasr.prefixes = Config.prefixes;
    console.log(Yasgui);

    const yasgui = new Yasgui(document.getElementById('yasguiDiv'));

    // if less than 1 tabs, add one
    if (Object.keys(yasgui._tabs).length < 1) {
      yasgui.addTab(
        true, // set as active tab
        { ...Yasgui.Tab.getDefaults(), id: "defaultQuery", name: "Query" }
      );
      yasgui.getTab("defaultQuery").setQuery(this.defaultQuery);
      // yasgui.addTab(
      //   true, // set as active tab
      //   { ...Yasgui.Tab.getDefaults(), id: "entitiesRelations", name: "Explore entities relations" }
      // );
      // yasgui.getTab("entitiesRelations").setQuery(this.entitiesRelationsQuery);
    }
  }

  render () {
    const { classes } = this.props;
    return <React.Fragment>
      <Container 
        // className='mainContainer' 
        style={{height: '100%', padding: '5px', width: '100%'}}>
        <Paper elevation={2} style={{textAlign: 'left'}}
        className={classes.paperPadding}
        >
          <div id="yasguiDiv"></div>
        </Paper>
      </Container>
      <Footer />
    </React.Fragment>
  }
}
export default withStyles(styles)(DeployYasgui);
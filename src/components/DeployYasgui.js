import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";

var Config = require('Config')

const styles = theme => ({
  paperPadding: {
    padding: theme.spacing(2, 2),
  }
})

class DeployYasgui extends Component {

  graphOverviewQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX dctypes: <http://purl.org/dc/dcmitype/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT ?graph ?description ?homepage ?dateGenerated ?statements ?entities ?properties ?classes
WHERE {
  GRAPH ?graph {
    [] ?dummyProp [] .
  }
  GRAPH ?metadataGraph {
    OPTIONAL {
      ?dataset a dctypes:Dataset ;
        dct:description ?description ;
        foaf:page ?homepage .
      ?version dct:isVersionOf ?dataset ;
        dcat:distribution ?graph .
    }
    OPTIONAL {
      ?graph a void:Dataset ;
        void:triples ?statements ;
        void:entities ?entities ;
        void:properties ?properties .
    }
    OPTIONAL {
      ?graph dct:created ?dateGenerated .
    }
    OPTIONAL {
      ?graph void:classPartition [
        void:class rdfs:Class ;
        void:distinctSubjects ?classes
      ] .
    }
  }
} ORDER BY DESC(?statements)`;

  entitiesRelationsQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX bl: <http://w3id.org/biolink/vocab/>
PREFIX dctypes: <http://purl.org/dc/dcmitype/>
PREFIX idot: <http://identifiers.org/idot/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX void-ext: <http://ldf.fi/void-ext#>
SELECT DISTINCT ?graph ?classCount1 ?class1 ?relationWith ?classCount2 ?class2
WHERE {
GRAPH ?metadataGraph {
  ?graph a void:Dataset .
  ?graph void:propertyPartition [
    void:property ?relationWith ;
    void:classPartition [
      void:class ?class1 ;
      void:distinctSubjects ?classCount1 ;
    ];
    void-ext:objectClassPartition [
    void:class ?class2 ;
    void:distinctObjects ?classCount2 ;
    ]] .
  }
} ORDER BY DESC(?classCount1)`;
  
  componentDidMount() {
    // Documentation: https://triply.cc/docs/yasgui-api

    // const yasguiConfig = {
    //   requestConfig: {
    //     endpoint: 'Config.sparql_endpoint',
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

    Yasgui.defaults.endpoint = Config.sparql_endpoint;
    Yasgui.defaults.requestConfig.endpoint = Config.sparql_endpoint;
    Yasgui.Yasqe.defaults.requestConfig.endpoint = Config.sparql_endpoint;
    // TODO: fix this, and add catalog in settings.xml
    // const catalogEndpoint = { endpoint: Config.sparql_endpoint }
    Yasgui.defaults.endpointCatalogueOptions.getData = () => {
      return [
        { endpoint: "http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar" },
        { endpoint: "http://graphdb.dumontierlab.com/repositories/ncats-red-kg" },
        { endpoint: "https://bio2rdf.org/sparql" },
        { endpoint: "http://localhost:8890/sparql" },
        { endpoint: "http://localhost:7200/repositories/test" },
        { endpoint: "http://localhost:8082/bigdata/sparql" }
      ];
    };

    // Define Yasr prefixes don't change the namespaces resolved in the results
    Yasgui.Yasr.defaults.prefixes = Config.prefixes;
    Yasgui.defaults.yasr.prefixes = Config.prefixes;
    console.log(Yasgui);

    const yasgui = new Yasgui(document.getElementById('yasguiDiv'));

    // Only add HCLS stats tabs if less than 3 tabs
    if (Object.keys(yasgui._tabs).length < 3) {
      yasgui.addTab(
        true, // set as active tab
        { ...Yasgui.Tab.getDefaults(), id: "graphsOverview", name: "Graphs statistics" }
      );
      yasgui.getTab("graphsOverview").setQuery(this.graphOverviewQuery);
      yasgui.addTab(
        true, // set as active tab
        { ...Yasgui.Tab.getDefaults(), id: "entitiesRelations", name: "Explore entities relations" }
      );
      yasgui.getTab("entitiesRelations").setQuery(this.entitiesRelationsQuery);
    }
  }

  render () {
    const { classes } = this.props;
    return <Container maxWidth="xl">
        <Paper elevation={2} style={{textAlign: 'left'}}
        className={['mainContainer', classes.paperPadding].join(' ')}>
          <div id="yasguiDiv"></div>
        </Paper>
      </Container>
  }
}
export default withStyles(styles)(DeployYasgui);
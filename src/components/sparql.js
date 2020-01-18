import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
var Config = require('Config')

const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
  }
})

class Sparql extends Component {
  state = {}

  statisticsQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX dctypes: <http://purl.org/dc/dcmitype/>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT DISTINCT ?graph ?description ?homepage ?dateGenerated ?statements ?entities ?properties ?classes
WHERE {
  GRAPH ?g {
    OPTIONAL {
      ?dataset a dctypes:Dataset ;
        dct:description ?description ;
        foaf:page ?homepage .
      ?version dct:isVersionOf ?dataset ;
        dcat:distribution ?graph .
    }
    ?graph a void:Dataset ;
      void:triples ?statements ;
      void:entities ?entities ;
      void:properties ?properties .
    OPTIONAL {
      ?graph dct:issued ?dateGenerated .
    }
    ?graph void:classPartition [
      void:class rdfs:Class ;
      void:distinctSubjects ?classes
    ] .
  }
} ORDER BY DESC(?statements)`;

  entitiesRelationsQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX void-ext: <http://ldf.fi/void-ext#>
SELECT DISTINCT ?graph ?classCount1 ?class1 ?relationWith ?classCount2 ?class2
WHERE {
  GRAPH ?g {
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
    
    console.log("fetchData");
    console.log(Config.sparql);

    // const yasguiConfig = {
    //   requestConfig: {
    //     endpoint: 'http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar',
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

    Yasgui.defaults.endpoint = 'http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar';
    Yasgui.defaults.requestConfig.endpoint = 'http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar';
    Yasgui.Yasqe.defaults.requestConfig.endpoint = 'http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar';
    Yasgui.defaults.endpointCatalogueOptions.getData = () => {
      return [
        { endpoint: "http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar" },
        { endpoint: "http://graphdb.dumontierlab.com/repositories/ncats-red-kg" }
      ];
    };

    const yasgui = new Yasgui(document.getElementById('yasguiDiv'));

    // Only add HCLS stats tabs if less than 3 tabs
    if (Object.keys(yasgui._tabs).length < 3) {
      yasgui.addTab(
        true, // set as active tab
        { ...Yasgui.Tab.getDefaults(), id: "graphsOverview", name: "Graphs statistics" }
      );
      yasgui.getTab("graphsOverview").setQuery(this.statisticsQuery);
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
export default withStyles(styles)(Sparql);
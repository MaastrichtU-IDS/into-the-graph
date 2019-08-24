import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import YASGUI from 'yasgui/dist/yasgui.bundled.min.js';
import 'yasgui/dist/yasgui.min.css'

// Everything freezes when we import YASGUI.
// Such a robust and reliable framework

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

  statisticsQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX bl: <http://w3id.org/biolink/vocab/>
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>
  PREFIX idot: <http://identifiers.org/idot/>
  PREFIX dcat: <http://www.w3.org/ns/dcat#>
  PREFIX void: <http://rdfs.org/ns/void#>
  SELECT distinct ?source ?statements ?entities ?properties ?classes ?graph
  WHERE {
    GRAPH ?g {
      ?dataset a dctypes:Dataset ; idot:preferredPrefix ?source .
      ?version dct:isVersionOf ?dataset ; dcat:distribution ?rdfDistribution .
      ?rdfDistribution a void:Dataset ;
        dcat:accessURL ?graph ;
        void:triples ?statements ;
        void:entities ?entities ;
        void:properties ?properties .
      ?rdfDistribution void:classPartition [
        void:class rdfs:Class ;
        void:distinctSubjects ?classes
      ] .
    }
  } ORDER BY DESC(?statements)`;

  entitiesRelationsQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>
  PREFIX idot: <http://identifiers.org/idot/>
  PREFIX dcat: <http://www.w3.org/ns/dcat#>
  PREFIX void: <http://rdfs.org/ns/void#>
  PREFIX void-ext: <http://ldf.fi/void-ext#>
  SELECT distinct ?source ?classCount1 ?class1 ?relationWith ?classCount2 ?class2
  WHERE {
    GRAPH ?g {
      ?dataset a dctypes:Dataset ; idot:preferredPrefix ?source .
      ?version dct:isVersionOf ?dataset ; dcat:distribution ?rdfDistribution .
      ?rdfDistribution a void:Dataset ;
        dcat:accessURL ?graph .
      ?rdfDistribution void:classPartition [
        void:class rdfs:Class ;
        void:distinctSubjects ?classes
      ] .
      ?rdfDistribution void:propertyPartition [
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
  } ORDER BY ?source DESC(?classCount1) DESC(?classCount2)`;
  

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
        <div id="yasguiDiv" style={{marginTop: '40px'}}></div>
      </Container>
  }
}

export default withStyles(styles)(Sparql);


 
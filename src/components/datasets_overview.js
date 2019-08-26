import React, { Component } from "react"; 
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import axios from 'axios';

import 'datatables.net-dt/css/jquery.dataTables.min.css'
const $ = require('jquery');
$.DataTable = require('datatables.net');
// Shoud also work:
// import $ from 'jquery'
// import DataTable from 'datatables.net'
// $.DataTable = DataTable

class DatasetsOverview extends Component {
  state = {statsOverview: [], entitiesRelations:[]}

  componentDidMount() {

    axios.get(`http://graphdb.dumontierlab.com/repositories/ncats-red-kg?query=` + encodeURIComponent(this.statsOverviewQuery))
      .then(res => {
        this.setState( { statsOverview: res.data.results.bindings } );
        $(this.refs.main).DataTable();
      });

  }

  componentWillUnmount(){
    $('.data-table-wrapper')
    .find('table')
    .DataTable()
    .destroy(true);
  }

  shouldComponentUpdate() {
      return true;
  }

  render() {
    let myTable = '';
    if (this.state.statsOverview.length > 0) {
      myTable = ( <table table ref="main" className="row-border">
        <thead>
          <tr>
            <th>Dataset</th>
            <th>date generated</th>
            <th># of triples</th>
            <th># of entities</th>
            <th># of properties</th>
            <th># of classes</th>
            <th>Download as RDF/XML</th>
          </tr>
        </thead>
        <tbody>
          {console.log('before statsOverview map')}
          {console.log(this.state)}
          {this.state.statsOverview.map((row, key) => {
            {console.log('in statsOverview map')}
            {console.log(row)}
            return <tr>
              <td>
                {row.source.value}
              </td>
              <td>
                {row.dateGenerated.value}
              </td>
              <td>
                {row.statements.value}
              </td>
              <td>
                {row.entities.value}
              </td>
              <td>
                {row.properties.value}
              </td>
              <td>
                {row.classes.value}
              </td>
              <td>
                Download
              </td>
            </tr>;
          })}
      </tbody>
    </table> )
    }
      return (
          <Container>
            <Card className='mainContainer'>
              <CardContent>
                {myTable}
            </CardContent>
          </Card>
        </Container>);
  }

  statsOverviewQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX dct: <http://purl.org/dc/terms/>
  PREFIX bl: <http://w3id.org/biolink/vocab/>
  PREFIX dctypes: <http://purl.org/dc/dcmitype/>
  PREFIX idot: <http://identifiers.org/idot/>
  PREFIX dcat: <http://www.w3.org/ns/dcat#>
  PREFIX void: <http://rdfs.org/ns/void#>
  PREFIX dc: <http://purl.org/dc/elements/1.1/>
  PREFIX foaf: <http://xmlns.com/foaf/0.1/>
  PREFIX void-ext: <http://ldf.fi/void-ext#>
  SELECT DISTINCT ?source ?description ?homepage ?dateGenerated ?statements ?entities ?properties ?classes ?graph
  WHERE {
    GRAPH ?g {
      ?dataset a dctypes:Dataset ;
        dct:description ?description ;
        foaf:page ?homepage ;
        idot:preferredPrefix ?source .
      ?version dct:isVersionOf ?dataset ;
        dcat:distribution ?rdfDistribution .
      ?rdfDistribution a void:Dataset ;
        dcat:accessURL ?graph ;
        void:triples ?statements ;
        void:entities ?entities ;
        void:properties ?properties ;
        dct:issued ?dateGenerated .
      ?rdfDistribution void:classPartition [
        void:class rdfs:Class ;
        void:distinctSubjects ?classes
      ] .
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
  SELECT DISTINCT ?source ?graph ?classCount1 ?class1 ?relationWith ?classCount2 ?class2
  WHERE {
    GRAPH ?g {
      ?dataset a dctypes:Dataset ;
        idot:preferredPrefix ?source .
      ?version dct:isVersionOf ?dataset ;
        dcat:distribution ?rdfDistribution .
      ?rdfDistribution a void:Dataset ;
        dcat:accessURL ?graph .
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
  } ORDER BY DESC(?classCount1)`;
}

export default DatasetsOverview;

// Turgay snippet:
// state ={
//   number: 5,
//   data: []
// }
// The component has been loaded
// componentDidMount() {
//   this.x =6
//   setInterval(()=> {
//     const {x, state: { data, number }} = this;

//     console.log(x, data, number)

//     //const data = this.state.data;

//     data.push(number)
//     this.setState({data})
//   }, 1000)
// }
// render() {
//   const { state: { number, data }} = this;
//   return (
//     <div className="Sparql">
//       <p>
//         This is the {number} sparql me page. 
//       </p>
//       {
//         data.map(val => <p>{val}</p>)
//       }
//     </div>
//   );
// }
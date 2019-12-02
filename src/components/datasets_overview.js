import React, { Component } from "react"; 
import { withStyles } from '@material-ui/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import { LinkDescribe } from "./link_describe";

import 'datatables.net-dt/css/jquery.dataTables.min.css'
import { Typography } from "@material-ui/core";
const $ = require('jquery');
$.DataTable = require('datatables.net');
// Shoud also work:
// import $ from 'jquery'
// import DataTable from 'datatables.net'
// $.DataTable = DataTable

const styles = theme => ({
  menuButton: {
    color: '#fafafa',
    marginRight: '1em',
    marginLeft: '1em',
    textTransform: 'none'
  },
  noCap: {
    textTransform: 'none'
  },
  uriLink: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  alignRight: {
    textAlign: 'right'
  },
  alignLeft: {
    textAlign: 'left'
  },
  paperPadding: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(4, 4),
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
  divider: {
    margin: theme.spacing(1, 1),
  },
  font300: {
    fontWeight: 300
  },
  hclsNotice: {
    fontWeight: 300,
    textAlign: "left"
  }
})

function displayDate(dateToDisplay) {
  if (dateToDisplay) {
    const parsedDate = new Date(dateToDisplay.value);
    return parsedDate.getFullYear() + '-'
    + (parsedDate.getMonth() + 1).toString() + '-' + parsedDate.getDate().toString();
  } else {
    return 'Not provided';
  }
}

class DatasetsOverview extends Component {
  state = {statsOverview: [], entitiesRelations:[]}

  componentDidMount() {
    axios.get(`http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar?query=` + encodeURIComponent(this.statsOverviewQuery))
      .then(res => {
        this.setState( { statsOverview: res.data.results.bindings } );
        $(this.refs.statsOverview).DataTable();
      });

    axios.get(`http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar?query=` + encodeURIComponent(this.entitiesRelationsQuery))
      .then(res => {
        this.setState( { entitiesRelations: res.data.results.bindings } );
        $(this.refs.entitiesRelations).DataTable();
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
    const { classes } = this.props;
    let statsOverviewTable;
    // We don't render the table before the data has been retrieved
    // To avoid No data in table message
    if (this.state.statsOverview.length > 0) {
      statsOverviewTable = ( <table table="true" ref="statsOverview">
        <thead>
          <tr>
            <th>Graph</th>
            <th>Date generated</th>
            <th># of triples</th>
            <th># of entities</th>
            <th># of properties</th>
            <th># of classes</th>
          </tr>
        </thead>
        <tbody>
          {this.state.statsOverview.map((row, key) => {
            return <tr key={key}>
              <td>{row.graph.value}</td>
              <td>{displayDate(row.dateGenerated)}</td>
              <td>{row.statements.value}</td>
              <td>{row.entities.value}</td>
              <td>{row.properties.value}</td>
              <td>{row.classes.value}</td>
            </tr>;
          })}
        </tbody>
      </table> )
    }
    let entitiesRelationsTable;
    if (this.state.entitiesRelations.length > 0) {
      entitiesRelationsTable = ( <table table="true" ref="entitiesRelations">
      {/* Default class: className="row-border" */}
        <thead>
          <tr>
            <th>Graph</th>
            <th># of instance of subject</th>
            <th>Subject class</th>
            <th>Have relation with</th>
            <th>Object class</th>
            <th># of instance of object</th>
          </tr>
        </thead>
        <tbody>
          {this.state.entitiesRelations.map((row, key) => {
            return <tr key={key}>
              <td>{row.graph.value}</td>
              <td>{row.classCount1.value}</td>
              <td><LinkDescribe uri={row.class1.value} variant='body2'/></td>
              <td><LinkDescribe uri={row.relationWith.value} variant='body2'/></td>
              <td><LinkDescribe uri={row.class2.value} variant='body2'/></td>
              <td>{row.classCount2.value}</td>
            </tr>;
          })}
        </tbody>
      </table> )
    }
    // Now render the tables!
    return (
      <Container maxWidth="xl">
        <Paper elevation={2} className={['mainContainer', classes.paperPadding].join(' ')}>
          <Typography variant="body2" className={classes.hclsNotice}>
            Graphs statistics have been generated following the&nbsp;
            <a href="https://www.w3.org/TR/hcls-dataset/" className={classes.uriLink} target="_blank">HCLS descriptive statistics</a>
            .
          </Typography>
          <Typography variant="body2" className={classes.hclsNotice} style={{marginTop: '10px'}}>
            They can be easily precomputed and inserted in your triplestore using a simple docker container.
            Follow <a href="https://github.com/MaastrichtU-IDS/data2services-transform-repository/tree/master/sparql/compute-hcls-stats"
            className={classes.uriLink} target="_blank">those instructions</a> to run it. 
          </Typography>
        </Paper>
        <Typography variant="h4" className={classes.font300} style={{marginTop: '50px'}}>
          Graphs overview
        </Typography>
        <Paper elevation={2} className={['mainContainer', classes.paperPadding].join(' ')}>
          {statsOverviewTable}
        </Paper>
        <br/>
        <Typography variant="h4" className={classes.font300}>
          Explore entities and relations
        </Typography>
        <Paper elevation={2} className={['mainContainer', classes.paperPadding].join(' ')}>
          {entitiesRelationsTable}
        </Paper>
      </Container>);
  }

  statsOverviewQuery = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
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
}
export default withStyles(styles) (DatasetsOverview);

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
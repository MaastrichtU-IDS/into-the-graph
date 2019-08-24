import React, { Component } from "react"; 
import Container from '@material-ui/core/Container';
// import $ from 'jquery'

// import DataTable from 'datatables.net'
// $.DataTable = DataTable

// import DataTableDt from 'datatables.net-dt'

import 'datatables.net-dt/css/jquery.dataTables.min.css'
const $ = require('jquery');
$.DataTable = require('datatables.net');

const columns = [{title: 'Name', width: 120,data: 'name'},{title: 'Nickname',width: 180,data: 'nickname'}];

// Following this post: https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfa

class Sparql extends Component {
  // state = {columns: [{title: 'Name', width: 120,data: 'name'},{title: 'Nickname',width: 180,data: 'nickname'}]}

  componentDidMount() {
    // This fails to get columns data,so the test data is in the render.
    // $(this.refs.main).DataTable({
    //    dom: '<"data-table-wrapper"t>',
    //    data: this.props.names,
    //    columns,
    //    ordering: true
    // });

    $(this.refs.main).DataTable();
  }

  componentWillUnmount(){
    $('.data-table-wrapper')
    .find('table')
    .DataTable()
    .destroy(true);
  }

  shouldComponentUpdate() {
      return false;
  }

  render() {
      return (
          <Container>
              <table table ref="main" className="row-border">
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
                  <tr>
                    <td>
                      Datas1
                    </td>
                    <td>
                      date
                    </td>
                    <td>
                      1
                    </td>
                    <td>
                      2  
                    </td>
                    <td>
                      3
                    </td>
                    <td>
                      4
                    </td>
                    <td>
                      5
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Datas2
                    </td>
                    <td>
                      date2
                    </td>
                    <td>
                      2
                    </td>
                    <td>
                      3
                    </td>
                    <td>
                      4
                    </td>
                    <td>
                      1
                    </td>
                    <td>
                      2
                    </td>
                  </tr>
                </tbody>
              </table>
          </Container>);
  }
}

export default Sparql;

// Another failing solution
// componentDidMount(nextProps, nextState) {
//   this.table = $(this.refs.main).DataTable({
//     dom: '<"data-table-wrapper"tip>',
//     data: [],
//     columns,
//     language: {
//       info: 'Mostrando _START_-_END_ de _TOTAL_ puntos',
//       infoEmpty: 'No hay puntos',
//       paginate: {
//         next: 'Siguiente',
//         previous: 'Anterior',
//       },
//     },
//   })
// }
// render() {
//   return (
//       <table
//         className="table table-striped hover"
//         cellSpacing="0"
//         width="100%"
//         ref="main"
//       />
//   )
// }

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
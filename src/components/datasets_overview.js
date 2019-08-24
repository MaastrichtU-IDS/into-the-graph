import React, { Component } from "react"; 
// import $ from 'jquery'

// import DataTable from 'datatables.net'
// $.DataTable = DataTable

const $ = require('jquery');
$.DataTable = require('datatables.net');

const columns = [{title: 'Name', width: 120,data: 'name'},{title: 'Nickname',width: 180,data: 'nickname'}];

// Following this post: https://medium.com/@zbzzn/integrating-react-and-datatables-not-as-hard-as-advertised-f3364f395dfa

class Sparql extends Component {
  // state = {columns: [{title: 'Name', width: 120,data: 'name'},{title: 'Nickname',width: 180,data: 'nickname'}]}

  componentDidMount() {
    $(this.refs.main).DataTable({
       dom: '<"data-table-wrapper"t>',
       data: this.props.names,
       columns,
       ordering: false
    });
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
          <div>
              <table ref="main" />
          </div>);
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
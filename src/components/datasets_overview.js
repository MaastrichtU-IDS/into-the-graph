import React, { Component } from "react"; 
 
class Sparql extends Component {
  state ={
    number: 5,
    data: []
  }

  // The component has been loaded
  componentDidMount() {
    this.x =6
    setInterval(()=> {
      const {x, state: { data, number }} = this;

      console.log(x, data, number)

      //const data = this.state.data;

      data.push(number)
      this.setState({data})
    }, 1000)
  }
  render() {
    const { state: { number, data }} = this;
    return (
      <div className="Sparql">
        <p>
          This is the {number} sparql me page. 
        </p>
        {
          data.map(val => <p>{val}</p>)
        }
      </div>
    );
  }
}
 
export default Sparql;
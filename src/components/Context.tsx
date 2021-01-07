import React from "react";

// TODO: NOT USED anymore, using localStorage now
// @ts-ignore useless warning about 1 expected argument
const Context = React.createContext();

export default Context;


// Default values and structure defined in App.js
// const Context = React.createContext('https://bio2rdf.org/sparql');

// const Context = React.createContext([{
//   context: 'https://bio2rdf.org/sparql',
//   setContext: () => {}
//   // describe_uri: '',
//   // solid_webid: '',
// // }, () => {}]);
// }]);
// }, (describe_endpoint: string) => {}]);

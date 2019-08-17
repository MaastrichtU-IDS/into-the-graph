import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Import all page components here
 */
import App from './App';
import SparqlPage from './components/sparql';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={SparqlPage}>
    {/* <IndexRoute component={App} /> */}
    <Route path="/sparql" component={SparqlPage} />
    <Route path="/describe" component={SparqlPage} />
  </Route>
);
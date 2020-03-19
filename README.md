# Lightweight linked data browser

The motivation behind this linked data browser was to provide a fast [RDF](https://www.w3.org/RDF/) browser that just need a SPARQL endpoint URL to give a comfortable experience when exploring differents triplestores.

This browser supports graphs natively (n-quads), which most RDF linked data browser don't at the moment, this gives a net gain of 33% of informations for each statement! 📈 

**Browse a RDF triplestore by providing the SPARQL endpoint URL directly in the browser.** 

> See an example deployment of into-the graph at [trek.semanticscience.org](http://trek.semanticscience.org). Settings can be [easily changed](http://trek.semanticscience.org/settings) to browse various triplestores.

This RDF linked data browser features:

* A web-based UI to browse the triplestore statements easily.
  * Stateful URL to resolve a specific URI in a specific SPARQL endpoint can be defined using the `uri` and `endpoint` parameters
  * Example to resolve the [URI of a Gene-Disease association](http://rdf.disgenet.org/resource/gda/DGN06012220986003d9ecac664f0865140b ) in the [DisGeNET SPARQL endpoint](http://rdf.disgenet.org/sparql/):
  * http://trek.semanticscience.org/describe?uri=http://rdf.disgenet.org/resource/gda/DGN06012220986003d9ecac664f0865140b&endpoint=http://rdf.disgenet.org/sparql/
  * Works well with RDF4J (GraphDB) and Virtuoso SPARQL endpoints.
* Easily search for concepts in the triplestore. Possibility to change the SPARQL query to define the custom query to use the Search index of different triplestores in [settings](http://trek.semanticscience.org/settings) (GraphDB and Virtuoso documented).
* A [YASGUI](http://doc.yasgui.org/) SPARQL endpoint web editor.
* A [Comunica widget](http://query.linkeddatafragments.org/) to query Linked Data Fragments with SPARQL and GraphQL.
* Insights about the content of the triplestore and its different graphs, using precomputed [HCLS descriptives statistics](https://www.w3.org/TR/hcls-dataset/).

> [HCLS descriptive statistics](https://www.w3.org/TR/hcls-dataset/) for a graph can simply be computed and inserted running a `docker run` command. Follow [those instructions](https://github.com/MaastrichtU-IDS/data2services-transform-repository/tree/master/sparql/compute-hcls-stats) to run it.

Into-the-graph is built with [ReactJS](https://reactjs.org) and [Material-UI](https://material-ui.com/) to serve and explore RDF data from any SPARQL endpoint.

This service has been developed and used as part of the [Data2Services](http://d2s.semanticscience.org/) framework. 

[Data2Services](http://d2s.semanticscience.org/) provides tools and guideline to easily integrate multiple structured data sources (CSV, RDB, XML) to a RDF knowledge graph, complying with a defined data model.

> Checkout the documentation at [d2s.semanticscience.org](http://d2s.semanticscience.org/)

# Development

### Install dependencies

```shell
yarn install

# Add package to dev
yarn add my-package --dev

# Upgrade packages
yarn upgrade --latest
```

### Start the development server

```bash
yarn dev
```

> Access at http://localhost:19006

# Docker

### Use the DockerHub build

You can use the prebuilt image available on [DockerHub](https://hub.docker.com/repository/docker/umids/into-the-graph).

```shell
# Pull
docker pull umids/into-the-graph

# Run
docker run --rm -it -p 8082:5000 umids/into-the-graph
```

> Access at http://localhost:8082/

### Do a local build

Or build it locally, various parameters can be changed before build in [settings.json](https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/settings.json).

```powershell
# Build
docker build -t into-the-graph .

# Run
docker run --rm -it -p 8082:5000 into-the-graph
```

## Settings details

Details about some of the parameters that can be changed in  [settings](http://trek.semanticscience.org/settings):

* `sparql_endpoint`: the SPARQL endpoint to browse
  * e.g. http://graphdb.dumontierlab.com/repositories/ncats-red-kg

* `comunica_url`: Comunica widget URL that will be displayed as an iFrame in the Comunica page

  * e.g. http://query.linkeddatafragments.org/
  * Deploy your own instance of [comunica-sparql-widget](https://github.com/vemonet/jQuery-Widget.js) using Docker.

* `search_query`: the SPARQL query used when doing a search (allow to define SPARQL query using custom search indexes)

  * The SPARQL query should return `?foundUri` and `?foundLabel` as results of the search
  * Use `$TEXT_TO_SEARCH` to define the emplacement for the search text in the query

The following parameters can be changed in [settings.json](https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/settings.json):

* `prefixes`: dictionary of prefixes and the corresponding namespaces used to resolve URIs in the web UI

* `default_search_query`: the SPARQL query used when doing a search if an empty string has been passed to the `uri` param (allow to show some concepts in the triplestore by default)
* The SPARQL query should return `?foundUri` and `?foundLabel` as results of the search
  * Use `$TEXT_TO_SEARCH` to define the emplacement for the search text in the query
  

**TODO**: pass [settings.json](https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/settings.json) at runtime

```bash
# Something like
docker run -v $(pwd)/settings.json:/usr/share/nginx/html/settings.json --rm -it -p 8082:80 into-the-graph
```

### Restart script

Convenience script to `git pull`, `docker build` and restart docker.

```bash
./restart_docker.sh
```

> Access at http://localhost:8082



# Search queries

Optimized search query for different triplestores.

### Generic

Support the [BioLink model](https://biolink.github.io/biolink-model/) (get [rdfs:label](http://www.w3.org/2000/01/rdf-schema#label) and [bl:name](https://biolink.github.io/biolink-model/docs/name.html))

```SPARQL
SELECT ?foundUri ?foundLabel WHERE {?foundUri ?p ?foundLabel . VALUES ?p {<http://www.w3.org/2000/01/rdf-schema#label> <https://w3id.org/biolink/vocab/name>} . FILTER(isLiteral(?foundLabel)) FILTER contains(?foundLabel, '$TEXT_TO_SEARCH')} LIMIT 5
```

### GraphDB

See [GraphDB full text search documentation](http://graphdb.ontotext.com/documentation/free/full-text-search.html) to create a search index (uses [Apache Lucene](https://lucene.apache.org/core/) under the hood).

```SPARQL
PREFIX luc: <http://www.ontotext.com/owlim/lucene#> SELECT ?foundUri ?foundLabel { ?foundLabel luc:searchIndex '$TEXT_TO_SEARCH*' . ?foundUri ?p ?foundLabel . } LIMIT 100
```

Order by Lucene score

```SPARQL
PREFIX luc: <http://www.ontotext.com/owlim/lucene#> SELECT ?foundUri ?foundLabel { ?foundLabel luc:searchIndex '$TEXT_TO_SEARCH*' ; luc:score ?score . ?foundUri ?p ?foundLabel . } ORDER BY ?score LIMIT 100
```

### DBpedia Virtuoso

```SPARQL
SELECT ?foundUri ?foundLabel WHERE {?foundUri <http://www.w3.org/2000/01/rdf-schema#label> ?foundLabel . ?foundLabel bif:contains '$TEXT_TO_SEARCH' . } LIMIT 200
```

### OpenCitation

```SPARQL
SELECT ?foundUri ?foundLabel WHERE {?foundUri ?p ?foundLabel . VALUES ?p {<http://purl.org/spar/cito/hasCitationCreationDate> <http://purl.org/spar/cito/hasCitationTimeSpan>} . FILTER(str(?foundLabel) =  '$TEXT_TO_SEARCH')} LIMIT 5
```

> Text operations really slow on OpenCitation SPARQL, so we do a full match (for date mainly).

# Publish using Expo (experimental)

This feature is just a test,only try it if you know what you are doing!

Install `expo-cli`

```bash
npm install -g expo-cli
```

See [GitHub repository](https://github.com/expo/expo-cli) and [documentation to build standalone app](https://docs.expo.io/versions/latest/distribution/building-standalone-apps/).

Using [bycedric/expo-cli](https://hub.docker.com/r/bycedric/expo-cli) Docker image. On Docker: use `yarn start` to build using `serve`

> First you need to have your app built in the `web-build` folder.

```bash
# To remove:
docker run --tty --interactive \
    --workdir /srv \
    --volume $HOME/into-the-graph:/srv \
    --env EXPO_CLI_USERNAME=vemonet \
    --env EXPO_CLI_PASSWORD=password \
    bycedric/expo-cli publish
```

> Don't forget to change the path to the git repository (`$HOME` at the moment).

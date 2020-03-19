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

## Example SPARQL endpoints

Start browsing different SPARQL endpoints using into-the-graph:

* A Clinical trial in [Bio2RDF](https://bio2rdf.org):
  * http://trek.semanticscience.org/describe?uri=http://bio2rdf.org/clinicaltrials:NCT00209495&endpoint=https://bio2rdf.org/sparql
* A Protein in [NextProt](https://www.nextprot.org/):
  * http://trek.semanticscience.org/describe?uri=http://nextprot.org/rdf/entry/NX_Q96Q91&endpoint=https://sparql.nextprot.org
* A [Gene-Disease association](http://rdf.disgenet.org/resource/gda/DGN06012220986003d9ecac664f0865140b ) in the [DisGeNET SPARQL endpoint](http://rdf.disgenet.org/sparql/):
  * http://trek.semanticscience.org/describe?uri=http://rdf.disgenet.org/resource/gda/DGN06012220986003d9ecac664f0865140b&endpoint=http://rdf.disgenet.org/sparql/
* A Protein (UniProt) in [AgroLD](http://agrold.southgreen.fr/agrold/):
  * http://trek.semanticscience.org/describe?uri=http://purl.uniprot.org/uniprot/M7Y493&endpoint=http://sparql.southgreen.fr
* A City in DBpedia
  * http://trek.semanticscience.org/describe?uri=http://dbpedia.org/resource/Menton&endpoint=http://dbpedia.org/sparql
* A Citation in the [EU Law OpenCitation](http://opencitations.net/) corpus
  * http://trek.semanticscience.org/describe?uri=https://w3id.org/oc/index/coci/ci/020010000073609070863036303010963090209070963084905-02001000007362800000401006300010363000806006334&endpoint=http://publications.europa.eu/webapi/rdf/sparql
* A publication in the [EU Cellar Law dataset](https://data.europa.eu/euodp/en/data/dataset/sparql-cellar-of-the-publications-office): 
  * http://trek.semanticscience.org/describe?uri=http://publications.europa.eu/resource/cellar/c721f802-9ce7-11e7-b92d-01aa75ed71a1&endpoint=http://publications.europa.eu/webapi/rdf/sparql
  * Browsing not really good due to the use of graphs for entities.
* A product in the [LOD SPARQL endpoint](http://lod.openlinksw.com/sparql) 
  * http://trek.semanticscience.org/describe?uri=http://openean.kaufkauf.net/id/EanUpc_0820725102496&endpoint=http://lod.openlinksw.com/sparql
  * Browsing not really good due to the use of graphs for entities.
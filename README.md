# 🧭 Lightweight linked data browser

[![Deploy to GitHub Pages](https://github.com/MaastrichtU-IDS/into-the-graph/workflows/Deploy%20website%20to%20GitHub%20Pages/badge.svg)](https://github.com/MaastrichtU-IDS/into-the-graph/actions?query=workflow%3A%22Deploy+website+to+GitHub+Pages%22) [![CodeQL analysis](https://github.com/MaastrichtU-IDS/into-the-graph/workflows/CodeQL%20analysis/badge.svg)](https://github.com/MaastrichtU-IDS/into-the-graph/actions?query=workflow%3A%22CodeQL+analysis%22) 

Lightweight and fast [RDF](https://www.w3.org/RDF/) browser that just need a SPARQL endpoint URL to give a comfortable experience when exploring differents graphs.

**Browse a RDF triplestore by providing the SPARQL endpoint URL directly in the browser.** 

> See an example deployment of into-the graph at [https://maastrichtu-ids.github.io/into-the-graph](https://maastrichtu-ids.github.io/into-the-graph).

This RDF linked data browser features:

* A web-based UI to browse SPARQL endpoints content easily. Stateful URL to resolve a specific URI in a specific SPARQL endpoint can be defined using the `uri` and `endpoint` parameters. Tested with RDF4J (Ontotext GraphDB) and Virtuoso SPARQL endpoints.
* Easily search for concepts in the triplestore. Possibility to change the SPARQL query to define the custom query to use the Search index of different triplestores in [settings](http://trek.semanticscience.org/settings) (Ontotext GraphDB and Virtuoso triplestores documented).
* Work in progress: insights about the content of the triplestore and its different graphs, using precomputed [HCLS descriptives statistics](https://www.w3.org/TR/hcls-dataset/).

> [HCLS descriptive statistics](https://www.w3.org/TR/hcls-dataset/) for a graph can simply be computed and inserted running a `docker run` command. Follow [those instructions](https://github.com/MaastrichtU-IDS/data2services-transform-repository/tree/master/sparql/compute-hcls-stats) to run it. Or check the [`fair-metadata`](https://github.com/MaastrichtU-IDS/fair-metadata) Python library in development.

Into-the-graph is built with [TypeScript](https://www.typescriptlang.org/) , [ReactJS](https://reactjs.org), and [Material-UI](https://material-ui.com/) to serve and explore RDF data from any SPARQL endpoint.

> This service has been developed and used as part of the [Data2Services](http://d2s.semanticscience.org/) framework.  [Data2Services](http://d2s.semanticscience.org/) provides tools and guideline to easily integrate multiple structured data sources (CSV, RDB, XML) to a RDF knowledge graph, complying with a defined data model. Checkout the documentation at [d2s.semanticscience.org](http://d2s.semanticscience.org/)

# 👨‍💻 Contribute

Contributions are welcome! See the [guidelines to contribute](/CONTRIBUTING.md).

# 🎬 Into-the-graph in action

> ⚠️ Trying to query a HTTP SPARQL endpoint from into-the-graph which is provided through HTTPS might cause issues.

Start browsing various SPARQL endpoints using into-the-graph in one click:

* A Clinical trial in [Bio2RDF](https://bio2rdf.org):
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://bio2rdf.org/clinicaltrials:NCT00209495&endpoint=https://bio2rdf.org/sparql
* A Pathway in [PathwayCommons](http://pathwaycommons.org/):
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://identifiers.org/reactome/R-HSA-8852135&endpoint=http://rdf.pathwaycommons.org/sparql/
* A Protein in [NextProt](https://www.nextprot.org/):
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://nextprot.org/rdf/entry/NX_Q96Q91&endpoint=https://sparql.nextprot.org
* A [Gene-Disease association](http://rdf.disgenet.org/resource/gda/DGN06012220986003d9ecac664f0865140b ) in the [DisGeNET SPARQL endpoint](http://rdf.disgenet.org/sparql/):
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://rdf.disgenet.org/resource/gda/DGN06012220986003d9ecac664f0865140b&endpoint=http://rdf.disgenet.org/sparql/
* A Protein (UniProt) in [AgroLD](http://agrold.southgreen.fr/agrold/):
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://purl.uniprot.org/uniprot/M7Y493&endpoint=http://sparql.southgreen.fr
* A City in DBpedia
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://dbpedia.org/resource/Menton&endpoint=http://dbpedia.org/sparql
* A Citation in the [EU Law OpenCitation](http://opencitations.net/) corpus
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=https://w3id.org/oc/index/coci/ci/020010000073609070863036303010963090209070963084905-02001000007362800000401006300010363000806006334&endpoint=http://opencitations.net/index/sparql
* A Publication in the [EU Cellar Law dataset](https://data.europa.eu/euodp/en/data/dataset/sparql-cellar-of-the-publications-office): 
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://publications.europa.eu/resource/cellar/c721f802-9ce7-11e7-b92d-01aa75ed71a1&endpoint=http://publications.europa.eu/webapi/rdf/sparql
  * Browsing not really good due to the use of graphs for entities.
* A City in the [LOD SPARQL endpoint](http://lod.openlinksw.com/sparql) 
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://www.wikidata.org/entity/Q180083&endpoint=http://lod.openlinksw.com/sparql
  * Browsing not really good due to the use of graphs for entities.
* A Dataset in OpenEuropa Joinup SPARQL
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://data.europa.eu/w21/dfba1169-806f-4c9e-a42e-a5c5830a2221&endpoint=https://joinup.ec.europa.eu/sparql/
* A Statistic in the EU Open Data Portal
  * http://maastrichtu-ids.github.io/into-the-graph/describe?uri=http://data.lod2.eu/scoreboard/indicators/FOA_cit_Country__of_pub_serv_for_citizen&endpoint=http://data.europa.eu/euodp/sparqlep

You can even directly use http://maastrichtu-ids.github.io/into-the-graph to browse a locally deployed endpoint! e.g. http://localhost:8890/sparql

# 🏗️ Run in development

Requirements:  [npm](https://www.npmjs.com/get-npm) and [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) installed.

Clone the repository:

```bash
git clone https://github.com/MaastrichtU-IDS/into-the-graph
cd into-the-graph
```

Install dependencies :inbox_tray:

```bash
yarn
```

Run the web app in development at http://localhost:19006

```bash
yarn dev
```

> The website should reload automatically at each changes to the code :arrows_clockwise:

Upgrade the packages versions in `yarn.lock`

```bash
yarn upgrade perfect-graph unitx-ui unitx
```

# 🚀 Run in production 

> This website is automatically deployed by a [GitHub Actions worklow](https://github.com/MaastrichtU-IDS/into-the-graph/actions?query=workflow%3A%22Deploy+to+GitHub+Pages%22) to GitHub Pages at https://maastrichtu-ids.github.io/into-the-graph

You can build locally in `/web-build` folder and serve on [http://localhost:5000 :package:](http://localhost:5000)

```bash
yarn build
yarn serve
```

Or run directly using [Docker :whale:](https://docs.docker.com/get-docker/) (requires [docker installed](https://docs.docker.com/get-docker/))

```bash
docker-compose up
```

> Checkout the [docker-compose.yml](/docker-compose.yml) file to see how we run the Docker image.

# 🔎 Search queries

Optimized SPARQL query to perform full text search in different triplestores.

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
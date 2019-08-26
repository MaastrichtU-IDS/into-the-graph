# Linked Data Browser

Linked Data Browser built with [ReactJS](https://reactjs.org) and [Material-UI](https://material-ui.com/) to serve and explore a SPARQL endpoint (preferably deployed using [RDF4J server](https://rdf4j.eclipse.org/documentation/server-workbench-console/)).

This Linked Data Browser gives you access to a [YASGUI](http://doc.yasgui.org/) SPARQL endpoint and enables you to browse the triplestores statements easily.  The app will extract metadata and provide insights about the content of your triplestore's graphs using precomputed [HCLS descriptives statistics](https://www.w3.org/TR/hcls-dataset/).

Statistics can simply be computed and inserted in one docker command. See [data2services-sparql-operations](https://github.com/MaastrichtU-IDS/data2services-transform-repository/tree/master/sparql/compute-hcls-stats).

A few things to know:

* Runs on http://graphdb.dumontierlab.com/repositories/ncats-red-kg by default.
* Can be plugged to any SPARQL endpoint, but URL needs to be changed in the JavaScript before [Docker](https://docs.docker.com/install/) build at the moment.
* The RDF bulk download links are generated for a [RDF4J server](https://rdf4j.eclipse.org/documentation/server-workbench-console/), they will not work for any other triplestores.

## Development

Install dependencies

```shell
npm install
```

Starts the development server.

```shell
npm start
```

Bundles the app into static files for production.

```shell
npm run build
```

## Docker

### Build

```powershell
docker build -t linked-data-browser .
```

### Run

```shell
docker run --rm -it -p 3000:80 linked-data-browser
```

* Access on http://localhost:3000/


# Lightweight RDF linked data browser

Browse a RDF triplestore by providing the SPARQL endpoint URL, browser supports graphs, includes a YASGUI editor and provide insights using precomputed [HCLS descriptive statistics](https://www.w3.org/TR/hcls-dataset/). 

It has been developped and used as part of the [Data2Services](http://d2s.semanticscience.org/) framework. [Data2Services](http://d2s.semanticscience.org/) provides tools and guideline to easily integrate multiple structured data sources (CSV, RDB, XML) to a RDF knowledge graph, complying with a defined data model.

> Explore the documentation at [d2s.semanticscience.org](http://d2s.semanticscience.org/)

Into-the-graph is built with [ReactJS](https://reactjs.org) and [Material-UI](https://material-ui.com/) to serve and explore RDF data from any SPARQL endpoint (better performance using [RDF4J server](https://rdf4j.eclipse.org/documentation/server-workbench-console/)).

This RDF linked data browser gives you access to a [YASGUI](http://doc.yasgui.org/) SPARQL endpoint and enables you to browse the triplestore statements easily.  The app will extract metadata and provide insights about the content of your triplestore's graphs using precomputed [HCLS descriptives statistics](https://www.w3.org/TR/hcls-dataset/).

> [HCLS descriptive statistics](https://www.w3.org/TR/hcls-dataset/) can simply be computed and inserted running a `docker run` command. Follow [those instructions](https://github.com/MaastrichtU-IDS/data2services-transform-repository/tree/master/sparql/compute-hcls-stats) to run it.

A few things to know:

* Runs on http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar by default.

* Can be changed to any SPARQL endpoint, but URL needs to be changed in the JavaScript before [Docker](https://docs.docker.com/install/) build at the moment.

  > Search for `http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar` in the repo.

## Development

### Install dependencies

```shell
npm install
```

### Starts the development server

```shell
npm start
```

> Known issues:
>
> * Error: `System limit for number of file watchers reached`
>
> ```bash
> echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
> ```

### Bundles the app to static files for production

```shell
npm run build
```

## Docker

### Build

```powershell
docker build -t into-the-graph .
```

### Run

```shell
docker run --rm -it -p 3000:80 into-the-graph
```

> Access on http://localhost:3000/

### Restart on IDS server

```bash
./restart_docker.sh
```

> Access on http://into-bio2rdf.137.120.31.101.nip.io


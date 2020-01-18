# Lightweight RDF linked data browser

Browse a RDF triplestore by providing the SPARQL endpoint URL. The browser supports graphs, includes a YASGUI editor, and provides insights using precomputed [HCLS descriptive statistics](https://www.w3.org/TR/hcls-dataset/). 

Into-the-graph is built with [ReactJS](https://reactjs.org) and [Material-UI](https://material-ui.com/) to serve and explore RDF data from any SPARQL endpoint (better performance using [RDF4J server](https://rdf4j.eclipse.org/documentation/server-workbench-console/)).

This RDF linked data browser features:

* A [YASGUI](http://doc.yasgui.org/) SPARQL endpoint.
* A [Comunica widget](http://query.linkeddatafragments.org/) to query Linked Data Fragments with SPARQL and GraphQL.
* A web-based browser to browse the triplestore statements easily.
* Insights about the content of the triplestore and its different graphs, using precomputed [HCLS descriptives statistics](https://www.w3.org/TR/hcls-dataset/).

> [HCLS descriptive statistics](https://www.w3.org/TR/hcls-dataset/) can simply be computed and inserted running a `docker run` command. Follow [those instructions](https://github.com/MaastrichtU-IDS/data2services-transform-repository/tree/master/sparql/compute-hcls-stats) to run it.

### Things to know

* Runs on http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar by default.

* Can be changed to any SPARQL endpoint, but URL needs to be changed in the JavaScript before [Docker](https://docs.docker.com/install/) build at the moment. See [related issue](https://github.com/MaastrichtU-IDS/into-the-graph/issues/8) for more details.

  > Search for `http://graphdb.dumontierlab.com/repositories/bio2rdf-ammar` in the repo.

### The Data2Services framework

It has been developped and used as part of the [Data2Services](http://d2s.semanticscience.org/) framework. 

[Data2Services](http://d2s.semanticscience.org/) provides tools and guideline to easily integrate multiple structured data sources (CSV, RDB, XML) to a RDF knowledge graph, complying with a defined data model.

> Checkout the documentation at [d2s.semanticscience.org](http://d2s.semanticscience.org/)

# Development

### Install dependencies

```shell
yarn

# Add package to dev
yarn add my-package --dev
```

### Start the development server

Use Yarn (recommended)

```bash
yarn web
```

> Access on http://localhost:19006

Or Expo (test if one work better for your machine)

```bash
expo web
```

> Access on http://localhost:19006

# Docker

### Use the DockerHub build

You can use the prebuilt image available on [DockerHub](https://hub.docker.com/repository/docker/umids/into-the-graph).

```shell
# Pull
docker pull umids:into-the-graph

# Run
docker run --rm -it -p 8082:80 umids:into-the-graph
```

> Access on http://localhost:8082/

### Do a local build

Or build it locally, eventually after changing [settings.json](https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/settings.json) to set your SPARQL endpoint.

```powershell
# Build
docker build -t into-the-graph .

# Run
docker run --rm -it -p 8082:80 into-the-graph
```

**TODO**: pass [settings.json](https://github.com/MaastrichtU-IDS/into-the-graph/blob/master/settings.json) at runtime:

```bash
docker run -v $(pwd)/settings.json:/usr/share/nginx/html/settings.json --rm -it -p 8082:80 into-the-graph
```

### Restart script

```bash
./restart_docker.sh
```

> Access at http://localhost:3000

# Publish using Expo (not tested)

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

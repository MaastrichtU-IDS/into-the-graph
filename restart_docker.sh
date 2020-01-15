#!/bin/bash
git pull
docker build -t into-the-graph .
docker stop into-the-graph
docker rm into-the-graph
docker run -d --name into-the-graph -p 3000:80 -e VIRTUAL_HOST=into-bio2rdf.137.120.31.101.nip.io into-the-graph

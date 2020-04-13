#!/bin/bash
git pull
docker build -t umids/into-the-graph .
docker stop into-the-graph

docker run -d --rm --name into-the-graph -p 8082:5000 -e VIRTUAL_HOST=into-the-graph.137.120.31.102.nip.io umids/into-the-graph:latest

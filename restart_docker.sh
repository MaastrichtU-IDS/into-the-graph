#!/bin/bash
git pull
docker build -t linked-data-browser .
docker stop linked-data-browser
docker rm linked-data-browser
docker run -d --name linked-data-browser -e VIRTUAL_HOST=ld-browser.137.120.31.101.nip.io linked-data-browser

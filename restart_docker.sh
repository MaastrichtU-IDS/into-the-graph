#!/bin/bash
docker stop linked-data-browser
docker run --rm -it --name linked-data-browser -e VIRTUAL_HOST=ld-browser.137.120.31.101.nip.io linked-data-browser

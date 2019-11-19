#!/bin/bash

echo Build Image
docker image build -t linking_server:latest /home/linking/api-server/
echo Create container
docker rm -f LINKING_SERVER
docker create --name LINKING_SERVER -p 1024:1024 linking_server:latest

echo Start Server
docker start LINKING_SERVER


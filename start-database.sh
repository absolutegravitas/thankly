#!/usr/bin/env bash

DB_CONTAINER_NAME="payload"

if ! [ -x "$(command -v docker)" ]; then
  echo "Docker is not installed. Please install docker and try again.\nDocker install guide: https://docs.docker.com/engine/install/"
  exit 1
fi

if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
  docker start $DB_CONTAINER_NAME
  echo "Database container started"
  exit 0
fi

set -a
source .env

DB_PASSWORD=$(echo $POSTGRES_URL | awk -F':' '{print $3}' | awk -F'@' '{print $1}')

if [ "$DB_PASSWORD" = "password" ]; then
  echo "You are using the default database password"
fi

# docker run --name $DB_CONTAINER_NAME -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_USER=postgres -e POSTGRES_DB=$DB_CONTAINER_NAME -d -p 5432:5432 docker.io/postgres
docker run --name $DB_CONTAINER_NAME \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=$DB_CONTAINER_NAME \
  -d -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  docker.io/postgres

echo "Database container was successfully created"
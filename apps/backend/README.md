# Zuugle API

## First time installation

To install nvm see e.g. https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

### Install all modules

Execute in the project directory:

    nvm install 20.19.6

    nvm use

    npm install

and install all dependencies.

### Setup database PostgreSQL 16

1. Install (https://www.docker.com/) on your local machine
2. Execute these two commands:

    ```bash
    docker build -t zuugle-postgres-db ./

    docker run -d --name zuugle-container -p 5433:5432 zuugle-postgres-db
    ```

### Setup database connection files

Create a copy of each connection file and rename it. We need four "knexfile\*" files in the end.

    cp ./src/knexfileTourenDb.js.example ./src/knexfileTourenDb.js

    cp ./src/knexfile.js.example ./src/knexfile.js

## Load data and run backend

### Restore database into local docker instance

The PostgrSQL dump file is daily (at night) updated and can be downloaded from https://uat-dump.zuugle.at/zuugle_postgresql.dump
Run the following commands to update your local docker container:

    npm run build

    npm run import-data-docker

Or do manual restoring of the tables:

    pg_restore zuugle_postgresql.dump -d zuugle-postgres-db -U postgres

### Create GPX files and images

Start API locally:

    npm run start

And in a new terminal start the update script:

    npm run import-files

### Execute backend locally

    npm run start

Hint: On local environment using the function logger('anytext'); writes to the file api.logs in your zuugle-api/logs directory. This is helpful, when debugging SQL code, etc.

## Follow frontend Readme

Follow the steps described at https://github.com/bahnzumberg/zuugle-suchseite#zuugleat-suchseite

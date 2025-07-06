# Zuugle API

## First time installation
To install nvm see e.g. https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

### Install all modules
Execute in the project directory:

    nvm install 20.5.0
    
    nvm use

    npm install

and install all dependencies.

### Setup database PostgreSQL 16
1. Install (https://www.docker.com/) on your local machine
2. Execute these two commands: 
    ```
    docker build -t zuugle-postgres-db ./

    docker run -d --name zuugle-container -p 5433:5432 zuugle-postgres-db 
    ```
### Setup database connection files
Create a copy of each connection file and rename it. We need four "knexfile*" files in the end. 

    cp ./src/knexfileTourenDb.js.example ./src/knexfileTourenDb.js

    cp ./src/knexfile.js.example ./src/knexfile.js


## Load data and run backend
### Restore database into local docker instance

    npm run build

    npm run import-data-docker

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

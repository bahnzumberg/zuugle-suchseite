# Zuugle API

## First time installation
To install nvm see e.g. https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

### Install all modules
Execute in the project directory:

    nvm install 20.3.0
    
    nvm use

    npm install

and install all dependencies.

### Setup database PostgreSQL 13.9
1. Install (https://www.docker.com/) on your local machine
2. Execute these two commands: 

    docker build -t zuugle-postgres-db ./

    docker run -d --name zuugle-container -p 5433:5432 zuugle-postgres-db

### Setup database connection files
Create a copy of each connection file and rename it. We need four "knexfile*" files in the end. 

    cp knexfileTourenDb.js.example knexfileTourenDb.js

    cp knexfile.js.example knexfile.js


## Load data and run backend
### Import data locally

    npm run build

    npm run import-data-full

    npm run import-files

### Execute backend locally
    npm run start
    Hint: On local environment using the function logger('anytext'); writes to the file api.logs in your zuugle-api/logs directory. This is helpful, when debugging SQL code, etc.

## Follow frontend Readme 
Follow the steps described at https://github.com/bahnzumberg/zuugle-suchseite#zuugleat-suchseite

# Zuugle API

## First time installation
### Install all modules
Execute in the project directory:

    nvm use

    npm install

and install all dependencies.

### Necessary directories
Create the folowing directories (if they do not exist):
* public/gpx
* public/gpx-image
* public/gpx-image-with-track
* public/gpx-track
* public/headless-leaflet
* public/range-image

### Setup database PostgreSQL 13.9
1. Install (https://www.docker.com/) on your local machine
2. Execute these two commands: 

    docker build -t zuugle-postgres-db ./

    docker run -d --name zuugle-container -p 5433:5432 zuugle-postgres-db

### Setup database connection files
Create a copy of each connection file and rename it. We need four files in the end. 

    cp knexfileTourenDb.js.example knexfileTourenDb.js

    cp knexfile.js.example knexfile.js


## Load data and run backend
### Execute backend locally
    npm run start

### Import data locally

    npm run build

    npm run import-data-full

    npm run import-files

## Follow frontend Readme 
Follow the steps described at https://github.com/bahnzumberg/zuugle-suchseite#zuugleat-suchseite

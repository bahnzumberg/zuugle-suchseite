# Zuugle API

## First time installation

To install nvm see e.g. https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

### Install all modules

Execute in the project directory:

    nvm install 20.19.6

    nvm use

    npm install

and install all dependencies.

### Setup Docker containers (PostgreSQL + Valkey)

1. Install [Docker](https://www.docker.com/) on your local machine

2. Start all containers using docker compose:

    ```bash
    docker compose up -d
    ```

    This starts:
    - **PostgreSQL** (zuugle-container) on port `5433`
    - **Valkey Cache** (zuugle-valkey) on port `6379`

3. Verify the containers are running:

    ```bash
    docker ps
    ```

    You should see `zuugle-container` and `zuugle-valkey` in the list.

> **Note:** For UAT environment with two PostgreSQL instances, use `docker compose -f docker-compose.uat.yaml up -d` instead.

### Setup database connection files

Create a copy of each connection file and rename it. We need two "knexfile\*" files:

    cp ./src/knexfileTourenDb.js.example ./src/knexfileTourenDb.js

    cp ./src/knexfile.js.example ./src/knexfile.js

## Load data and run backend

### Restore database

First, build the project:

```bash
npm run build
```

Then choose one of these options:

**Option 1: Automatic download (recommended)**

Downloads the dump file and imports it in one step:

```bash
npm run import-data-docker-download
```

**Option 2: Manual download**

1. Download the dump file: https://uat-dump.zuugle.at/zuugle_postgresql.dump
2. Save it to the project root as `zuugle_postgresql.dump`
3. Run the import:

    ```bash
    npm run import-data-docker
    ```

### Create GPX files and images

Start API locally:

    npm run start

And in a new terminal start the update script:

    npm run import-files

### Execute backend locally

    npm run start

> **Hint:** On local environment using the function `logger('anytext');` writes to the file `api.log` in your `zuugle-api/` directory. This is helpful when debugging SQL code, etc.

## Managing Docker containers

Stop all containers:

    docker compose down

Start containers again:

    docker compose up -d

View logs:

    docker compose logs -f

## Follow frontend Readme

Follow the steps described at https://github.com/bahnzumberg/zuugle-suchseite#zuugleat-suchseite

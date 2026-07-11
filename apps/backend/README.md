# Zuugle API (backend)

Express + Knex API. Part of the **zuugle-suchseite monorepo** — see the repo-root
[`README.md`](../../README.md) for the overall map.

## First time installation

To install nvm see e.g. https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/

### Install all modules

Execute in the project directory:

    nvm install 24.18.0

    nvm use

    npm install

and install all dependencies.

### Configure the environment

All settings are read from a gitignored `.env` (see `src/knexfile.js`,
`src/knexfileTourenDb.js`, `src/config.js`). Create one from the template:

    cp ./.env.example ./.env

The defaults already match the Docker stack below, so for local development you can
usually leave them as-is. `COMPOSE_PROJECT_NAME` names/namespaces your compose stack.

### Start the database stack (Docker Compose)

This is the one supported local setup — it works the same with or without VS Code.

1. Install [Docker](https://www.docker.com/) on your machine (that is the only
   prerequisite — the database client tools come from the container).

2. Start PostgreSQL + Valkey:

    ```bash
    docker compose up -d
    ```

    This starts, from a single `docker-compose.yaml`:
    - **PostgreSQL** (pgvector) on port `5433`
    - **Valkey cache** on port `6379`

3. Verify they are running:

    ```bash
    docker compose ps
    ```

## Load data and run backend

First, build the project:

```bash
npm run build
```

Create the database schema (knex migrations — the container starts empty):

```bash
npm run migrate
```

Download the production dump and import it:

```bash
npm run import-data
```

`import-data` restores the dump over the database connection. It streams into the
running Compose `postgres` container (no local `psql`/`pg_restore` needed); in the dev
container or on a native host it uses the local `pg_restore` instead.

> **PROD only:** `import-data-prod` (`syncDataProd.js`) is the production sync path — it
> reads tour data directly from the live MySQL source database via `knexTourenDb` and
> requires `TOUREN_DB_HOST/USER/PASSWORD/NAME` to be set. Local, DEV, and UAT
> environments all use `import-data` (the dump) and leave those vars blank.



### Execute backend locally

    npm run start

> **Hint:** On the local environment `logger('anytext');` writes to `api.log` in your
> `zuugle-api/` directory. Helpful when debugging SQL, etc.

### Create GPX files and images

Start the API locally, and in a new terminal run the update script:

    npm run import-files

## Database changes
The database is built from `src/migrations/`. Create a new migration with
`npm run migrate:make <name>`, then apply it with `npm run migrate`. 

## Managing the Docker stack

```bash
docker compose down          # stop
docker compose up -d         # start
docker compose logs -f       # logs
npm run rebuild-docker       # recreate the postgres container + re-apply migrations
```

After `rebuild-docker`, re-run `npm run import-data` to repopulate.

## Branches & deployment

Three branches auto-deploy via path-filtered GitHub Actions: `dev`→dev.zuugle.at,
`uat`→www2.zuugle.at, `main`→www.zuugle.at. Each environment differs only by its server-side
`.env`. 

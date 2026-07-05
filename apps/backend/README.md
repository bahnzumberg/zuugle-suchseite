# Zuugle API

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

> **Prefer a sandbox?** The optional dev container in `.devcontainer/` runs Claude Code
> with restricted network egress. It ships its own PostgreSQL + pgvector (started
> automatically on `127.0.0.1:5433`) so it stays self-contained; it has no Valkey, but
> the cache degrades gracefully so the API still runs (uncached). See the note in
> `.devcontainer/` — it is a security tool, not a replacement for the Compose setup.

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

> **Schema changes:** the schema lives in `src/migrations/`. Create a new migration with
> `npm run migrate:make <name>`, then apply it with `npm run migrate`. There is no
> `database.sql` file.

### Create GPX files and images

Start the API locally, and in a new terminal run the update script:

    npm run start
    npm run import-files

### Execute backend locally

    npm run start

> **Hint:** On the local environment `logger('anytext');` writes to `api.log` in your
> `zuugle-api/` directory. Helpful when debugging SQL, etc.

## Managing the Docker stack

```bash
docker compose down       # stop
docker compose up -d      # start
docker compose logs -f    # logs
```

### Rebuild the database container (version upgrade or clean rebuild)

To upgrade the PostgreSQL image or rebuild from scratch:

1. Build: `npm run build`
2. Rebuild: `npm run rebuild-docker` (recreates the `postgres` container **and** applies migrations)
3. Import data: `npm run import-data`

## Branches & deployment

Three branches auto-deploy via GitHub Actions (see `.github/workflows/`). All three
share one reusable workflow; each environment differs only by its server-side `.env`.
See `README_UAT.md` for the server setup.

| Branch | Environment | URL            |
| ------ | ----------- | -------------- |
| `dev`  | DEV         | dev.zuugle.at  |
| `uat`  | UAT         | www2.zuugle.at |
| `main` | PROD        | www.zuugle.at  |

`dev` and `uat` are both deployable development branches (UAT is the primary one — branch
your feature work from `uat`). **Never push directly to `main`.** See `CLAUDE.md` for the
full workflow.

## Follow frontend Readme

Follow the steps described at https://github.com/bahnzumberg/zuugle-suchseite#zuugleat-suchseite

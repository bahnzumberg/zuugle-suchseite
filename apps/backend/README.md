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
`src/config.js`). Create one from the template:

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

> **PROD only:** `import-data-prod` (`syncDataProd.js`) is the production sync path.
> It expects the `tour_load` staging table to be already populated (by an external
> loader) and then applies image-URL fixes and swaps the data into the live `tour`
> table. Local, DEV, and UAT environments use `import-data` (the dump) instead.



### Execute backend locally

```bash
npm run start
```

Starts the Express API with file watching (`tsx watch src/index.js`).

> **Hint:** The backend logger (`src/utils/logger.ts`) formats output with consistent
> timestamps to `stdout`/`stderr` using `logger.info(...)`, `logger.warn(...)`,
> `logger.error(...)`, and `logger.debug(...)`.

### Create GPX files and images

Ensure the project is built (`npm run build`) and the API is running locally (`npm run start`), then in a new terminal run the file sync script:

```bash
npm run import-files
```

This synchronizes GPX files, generates map preview images via headless Puppeteer against the running API, generates weather overlays, and flushes the Valkey cache.

## Database changes

The database schema is managed via Knex migrations in `src/migrations/`. Create a new migration with `npm run migrate:make <name>`, then apply it with `npm run migrate`.

## Managing the Docker stack

```bash
docker compose down          # stop
docker compose up -d         # start
docker compose logs -f       # logs
npm run rebuild-docker       # recreate the postgres container + re-apply migrations
```

After `rebuild-docker`, re-run `npm run import-data` to repopulate.

## Code quality & testing

Run the checks before pushing (these mirror the CI pipeline in `.github/workflows/code-checks.yml`):

```bash
npm run format:check  # verify formatting with Prettier (fix with: npm run format)
npm run lint          # run ESLint (fix with: npm run lint:fix)
npm run tsc           # type-check with TypeScript
npm test              # run Jest test suite
node scripts/check-cron-scripts.mjs  # guard cron-invoked npm scripts
```

## Branches & deployment

Three branches auto-deploy via path-filtered GitHub Actions: `dev`→dev.zuugle.at,
`uat`→www2.zuugle.at, `main`→www.zuugle.at. Each environment differs only by its server-side
`.env`.

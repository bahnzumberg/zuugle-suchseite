# UAT Server Setup (www2.zuugle.at)

This guide documents the UAT server (`www2.zuugle.at`), which runs both the `uat` and
`dev` branches in isolated environments **from the same `docker-compose.yaml`**. Each
environment lives in its own app directory with its own `.env`; `COMPOSE_PROJECT_NAME`
selects and namespaces its stack, so the two never collide.

## Overview

Each environment runs its own PostgreSQL + Valkey stack (one compose file, two projects):

| Environment | App dir `.env` | `COMPOSE_PROJECT_NAME` | `DB_PORT` | `CACHE_PORT` | pm2 app          |
| ----------- | -------------- | ---------------------- | --------- | ------------ | ---------------- |
| UAT         | UAT app dir    | `zuugle-uat`           | `5434`    | `6379`       | `zuugle_api`     |
| DEV         | DEV app dir    | `zuugle-dev`           | `5433`    | `6380`       | `dev-zuugle_api` |

> Two independent stacks on one host must publish **different** host ports — hence the
> distinct `DB_PORT` and `CACHE_PORT` per environment. Do NOT use `5432` (reserved for
> production-style native databases).

| Environment | DB Name                | DB User        |
| ----------- | ---------------------- | -------------- |
| UAT         | `zuugle_suchseite_db`  | `zuugle_suche` |
| DEV         | `zuugle_suchseite_dev` | `postgres`     |

Container names are derived from `COMPOSE_PROJECT_NAME` (e.g. `zuugle-uat-postgres-1`),
so nothing is hardcoded — `.env` is the single place per environment.

## Per-environment setup

Do this **once in each app directory** (UAT and DEV). Deploys rsync everything except
`.env`, so the server `.env` you create here persists across deploys.

### 1. Create the `.env`

Copy the template and set the environment's values (secrets never live in git):

```bash
cp .env.example .env
```

Set at least: `NODE_ENV`, `COMPOSE_PROJECT_NAME`, `DB_HOST=localhost`, `DB_PORT`,
`DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `CACHE_PORT` per the tables above. Optionally
pin `POSTGRES_IMAGE` / `VALKEY_IMAGE`.

### 2. Start the stack

```bash
docker compose up -d      # reads this dir's .env (COMPOSE_PROJECT_NAME + ports)
docker compose ps
```

### 3. Schema + initial data

```bash
npm run build
npm run migrate           # schema (the container starts empty)
./restore_databases.sh    # download the daily dump and import it
```

`restore_databases.sh` downloads the dump and runs `npm run import-data`, which restores
over the DB connection through the running `postgres` container — **no host database
client is required**.

> `./restore_databases.sh --structure` runs `npm run migrate` only (schema, no data).
> The bare `./restore_databases.sh` imports data — this is what the nightly cron runs.

### 4. Daily cron

```cron
0 7 * * * /path/to/<env-app-dir>/restore_databases.sh >> /path/to/<env-app-dir>/logs/restore.log 2>&1
```

## Managing a stack

Run these from the environment's app directory (they act on that env's project):

```bash
docker compose down       # stop
docker compose up -d      # start
docker compose down -v    # reset (deletes this env's data!)
docker compose logs -f    # logs
```

### Rebuild the database container

```bash
npm run build
npm run rebuild-docker     # recreates the postgres container + applies migrations
./restore_databases.sh     # repopulate data
```

`rebuild-docker` uses `COMPOSE_PROJECT_NAME` from `.env`; it refuses to run where that is
unset (i.e. a native/PROD host, where PostgreSQL is maintained manually).

## Migrating an existing UAT/DEV host to this layout

The previous setup used a separate `docker-compose.uat.yaml` and a `DB_CONTAINER_NAME`
env var; both are gone. On each existing app directory:

1. Edit `.env`: **remove** `DB_CONTAINER_NAME`; **add** `COMPOSE_PROJECT_NAME`,
   `CACHE_PORT` (distinct per env — see the table), and optionally the image tags.
2. Bring the old stack down and the new one up:

    ```bash
    # old containers were named zuugle-postgres-uat / -dev / zuugle-valkey
    docker rm -f zuugle-postgres-uat zuugle-postgres-dev zuugle-valkey 2>/dev/null || true
    docker compose up -d
    ```

3. Recreate schema + data (the fresh stack starts empty):

    ```bash
    npm run migrate
    ./restore_databases.sh
    ```

After this, ordinary pushes to `uat`/`dev` deploy normally — the workflow runs
`docker compose up -d` (reading `.env`), `npm run migrate`, and restarts pm2.

# UAT Server Setup (www2.zuugle.at)

This guide documents the complete setup for the UAT server (`www2.zuugle.at`), which runs both `uat` and `dev` branches in isolated environments.

## Overview

The UAT server runs three Docker containers:

| Service        | Container             | Port | Purpose                   |
| -------------- | --------------------- | ---- | ------------------------- |
| PostgreSQL UAT | `zuugle-postgres-uat` | 5434 | Database for `uat` branch |
| PostgreSQL DEV | `zuugle-postgres-dev` | 5433 | Database for `dev` branch |
| Valkey         | `zuugle-valkey`       | 6379 | Redis-compatible cache    |

## Installation

### 1. Start Docker containers

```bash
docker compose -f docker-compose.uat.yaml up -d
```

### 2. Verify containers are running

```bash
docker ps
```

You should see `zuugle-postgres-uat`, `zuugle-postgres-dev`, and `zuugle-valkey`.

### 3. Configure the environment

`src/knexfile.js` is env-driven and holds no credentials. Create a `.env` in each app
directory (copy `.env.example`) with the DB host/port/user/password/name and
`DB_CONTAINER_NAME` for that environment. Secrets never live in git.

### 4. Initial database schema + restore

Create the schema first (containers start empty — there is no `database.sql` init mount):

```bash
npm run build
npm run migrate
```

Then populate data with the restore script:

```bash
./restore_databases.sh
```

The script automatically:

- Reads `containerName` / DB config from `src/knexfile.js` (i.e. from the env)
- Downloads the daily UAT dump
- Restores to the matching container based on `NODE_ENV`

> `./restore_databases.sh --structure` now runs `npm run migrate` (schema only) and does
> **not** import data. The bare `./restore_databases.sh` imports data only — this is what
> the nightly cron runs.

### 5. Setup daily cron job

Add a cron job to restore databases daily at 7:00 AM:

```bash
crontab -e
```

Add this line (adjust paths):

```cron
0 7 * * * /path/to/zuugle-api/restore_databases.sh >> /path/to/zuugle-api/logs/restore.log 2>&1
```

## Managing Docker containers

```bash
# Stop all containers
docker compose -f docker-compose.uat.yaml down

# Start containers
docker compose -f docker-compose.uat.yaml up -d

# Reset everything (deletes all data!)
docker compose -f docker-compose.uat.yaml down -v

# View logs
docker compose -f docker-compose.uat.yaml logs -f
```

### Rebuild containers (Version Upgrade or Clean Rebuild)

On the UAT server, you can rebuild any of the two DB containers:

1. Set environment: `export NODE_ENV=production` (for UAT) or `export NODE_ENV=development` (for DEV)
2. Build the script: `npm run build`
3. Run rebuild: `npm run rebuild-docker` (recreates the container **and** applies the knex migrations)
4. Restore data: `./restore_databases.sh`

## Configuration Summary

| Environment | DB Name                | User           | Port | Container             |
| ----------- | ---------------------- | -------------- | ---- | --------------------- |
| UAT         | `zuugle_suchseite_db`  | `zuugle_suche` | 5434 | `zuugle-postgres-uat` |
| DEV         | `zuugle_suchseite_dev` | `postgres`     | 5433 | `zuugle-postgres-dev` |
| Cache       | -                      | -              | 6379 | `zuugle-valkey`       |

> **Note:** Do NOT use port 5432 as it may be used by production databases.

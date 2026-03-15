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

### 3. Configure knexfile.js

Configure `src/knexfile.js` to connect to the Docker containers.


### 4. Initial database restore

Run the restore script manually to populate data:

```bash
./restore_databases.sh
```

The script automatically:

- Reads `containerName` from `src/knexfile.js`
- Downloads the daily UAT dump
- Restores to the matching container based on `NODE_ENV`

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
3. Run rebuild: `npm run rebuild-docker`
4. Restore data: `./restore_databases.sh`

## Configuration Summary

| Environment | DB Name                | User           | Port | Container             |
| ----------- | ---------------------- | -------------- | ---- | --------------------- |
| UAT         | `zuugle_suchseite_db`  | `zuugle_suche` | 5434 | `zuugle-postgres-uat` |
| DEV         | `zuugle_suchseite_dev` | `postgres`     | 5433 | `zuugle-postgres-dev` |
| Cache       | -                      | -              | 6379 | `zuugle-valkey`       |

> **Note:** Do NOT use port 5432 as it may be used by production databases.

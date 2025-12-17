# PostgreSQL Setup for www2.zuugle.at (UAT & DEV)

This setup provides two isolated PostgreSQL instances running in Docker containers, as requested.
This configuration is intended for the `uat` and `dev` branches/environments on the `www2` server. It does not affect the production environment setup.

## Components

1.  **docker-compose.yaml**: Defines two services:
    *   `postgres-uat`: Mapped to port `127.0.0.1:5434` (to avoid conflict with system DB on 5432).
    *   `postgres-dev`: Mapped to port `127.0.0.1:5433` (Dev).
    *   Both containers are accessible only from localhost.

2.  **restore_databases.sh**: A script to:
    *   Download the daily UAT dump.
    *   Restore it to `postgres-uat` (and run `syncDataDocker.js` with UAT config).
    *   Restore it to `postgres-dev` (and run `syncDataDocker.js` with DEV config).

## Installation

1.  **Start the databases:**
    Navigate to the repository root and run:
    ```bash
    docker-compose up -d
    ```

2.  **Reset / Clean up:**
    To remove the databases and start fresh (this deletes all data!):
    ```bash
    docker-compose down -v
    ```

3.  **Initial Restore:**
    Run the restore script manually once to verify and populate data:
    ```bash
    ./restore_databases.sh
    ```

3.  **Setup Cron Job:**
    Add a cron job to run the restore script daily at 7:00 AM.
    Edit crontab:
    ```bash
    crontab -e
    ```
    Add the following line (adjust path to repository):
    ```cron
    0 7 * * * /path/to/zuugle-api/restore_databases.sh >> /path/to/zuugle-api/logs/restore.log 2>&1
    ```

## Knexfile Configuration

You must configure `src/knexfile.js` on the `www2` server to connect to these local Docker instances.

**UAT (Production Profile)**
Corresponds to `postgres-uat` on port 5434.
**Important:** Do NOT use port 5432 as it is likely used by the live production database.
```javascript
  production: {
    client: 'pg',
    version: '16',
    connection: {
      host : 'localhost',
      port : 5434,
      user : 'zuugle_suche',
      password : 'docker', // Corresponds to POSTGRES_PASSWORD in docker-compose.yaml
      database : 'zuugle_suchseite_db'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
```

**DEV (Development Profile)**
Corresponds to `postgres-dev` on port 5433.
```javascript
  development: {
    client: 'pg',
    version: '16',
    connection: {
      host : 'localhost',
      port : 5433,
      user : 'postgres',
      password : 'docker',
      database : 'zuugle_suchseite_dev'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
```

The `restore_databases.sh` script automatically sets `NODE_ENV` to `production` (for UAT) and `development` (for DEV) during the restore process, ensuring `knex` uses the correct configuration block.

## Configuration Details

*   **UAT**:
    *   DB: `zuugle_suchseite_db`
    *   User: `zuugle_suche`
    *   Port: `5434`
*   **DEV**:
    *   DB: `zuugle_suchseite_dev`
    *   User: `postgres`
    *   Port: `5433`

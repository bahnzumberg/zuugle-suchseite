# PostgreSQL Setup for www2.zuugle.at (UAT & DEV)

This setup provides two isolated PostgreSQL instances running in Docker containers, as requested.

## Components

1.  **docker-compose.yml**: Defines two services:
    *   `postgres-uat`: Mapped to port `127.0.0.1:5432` (Standard).
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
    docker-compose up -d --build
    ```

2.  **Initial Restore:**
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

## Configuration Details

*   **UAT**:
    *   DB: `zuugle_suchseite_db`
    *   User: `zuugle_suche`
    *   Port: `5432`
*   **DEV**:
    *   DB: `zuugle_suchseite_dev`
    *   User: `postgres`
    *   Port: `5433`

The `restore_databases.sh` script automatically handles the environment variables needed for `src/jobs/syncDataDocker.js` to connect to the correct database container.

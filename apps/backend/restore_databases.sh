#!/bin/bash
set -e

cd "$(dirname "$0")"

# Parse arguments
REBUILD_STRUCTURE=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -s|--structure) REBUILD_STRUCTURE=true ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

# Central dump location on the server; absent on developer machines.
DUMP_DIR="/usr/local/zuugle/uat-dump"
if [ ! -d "$DUMP_DIR" ]; then
    echo "Not on a server (no $DUMP_DIR). On your machine run: npm run import-data"
    exit 0
fi

# NODE_ENV selects this app dir's env-driven DB config (see knexfile.js); the .env
# here also carries COMPOSE_PROJECT_NAME so `npm run migrate` / import target the
# right compose stack.
export NODE_ENV="${NODE_ENV:-production}"

# Schema-only rebuild (knex migrations). The nightly cron runs this script WITHOUT
# --structure to refresh data; that path is unchanged.
if [ "$REBUILD_STRUCTURE" = true ]; then
    echo "Applying schema via knex migrations (npm run migrate)..."
    npm run migrate
    echo "Structure rebuild completed (schema only, no data import)."
    exit 0
fi

# --- Data import (bare invocation; used by the nightly cron) ---
# Downloads the dump and restores it over the DB connection. The restore transport
# (compose container vs native pg_restore) is auto-detected, so no host DB client
# is required.
echo "Importing data (NODE_ENV=$NODE_ENV)..."
npm run import-data

# Clean up the downloaded dump.
rm -f zuugle_postgresql.dump

echo "Data import completed."

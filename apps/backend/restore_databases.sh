#!/bin/bash
set -e

cd "$(dirname "$0")"

# When invoked from cron, PATH may not include the nvm-managed Node.js.
# Source nvm if available; fall back to adding the known install path used by
# the GitHub Actions deploy workflow.
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    . "$HOME/.nvm/nvm.sh"
elif [ -d "$HOME/.nvm/versions/node" ]; then
    # Pick the highest installed version automatically.
    NODE_DIR=$(ls -d "$HOME/.nvm/versions/node/"v* 2>/dev/null | sort -V | tail -1)
    [ -n "$NODE_DIR" ] && export PATH="$NODE_DIR/bin:$PATH"
fi

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
# Merge stderr into stdout so the Python caller captures all output, including
# Node.js stack traces on module-load failures that otherwise only go to stderr.
npm run import-data 2>&1

# Clean up the downloaded dump.
rm -f zuugle_postgresql.dump

echo "Data import completed."

#!/bin/bash
set -e

# Change to the directory of the script
cd "$(dirname "$0")"

echo "Downloading dump..."
wget -q https://uat-dump.zuugle.at/zuugle_postgresql.dump -O zuugle_postgresql.dump

echo "Restoring UAT..."
docker cp zuugle_postgresql.dump zuugle-postgres-uat:/tmp/
export NODE_ENV=production
export DB_CONTAINER_NAME=zuugle-postgres-uat
export DB_NAME=zuugle_suchseite_db
export DB_USER=zuugle_suche

# Locate the sync script
if [ -f "jobs/syncDataDocker.js" ]; then
    SCRIPT_PATH="jobs/syncDataDocker.js"
elif [ -f "build/jobs/syncDataDocker.js" ]; then
    SCRIPT_PATH="build/jobs/syncDataDocker.js"
    # Ensure build exists if we are in repo root
    if [ ! -d "build" ]; then
        echo "Build directory not found. Running build..."
        npm run build
    fi
else
    echo "Error: Cannot find syncDataDocker.js in jobs/ or build/jobs/"
    exit 1
fi

node $SCRIPT_PATH

echo "Restoring DEV..."
docker cp zuugle_postgresql.dump zuugle-postgres-dev:/tmp/
export NODE_ENV=development
export DB_CONTAINER_NAME=zuugle-postgres-dev
export DB_NAME=zuugle_suchseite_dev
export DB_USER=postgres
node $SCRIPT_PATH

echo "All databases restored successfully."

#!/bin/bash
set -e

cd "$(dirname "$0")"

# Read containerName from knexfile.js based on NODE_ENV
NODE_ENV="${NODE_ENV:-production}"
export NODE_ENV

CONTAINER_NAME=$(node -e "
  const config = require('./src/knexfile.js');
  const env = process.env.NODE_ENV || 'production';
  console.log(config[env]?.containerName || '');
")

if [ -z "$CONTAINER_NAME" ]; then
    echo "Error: No containerName found in src/knexfile.js for NODE_ENV=$NODE_ENV"
    echo "This script is only for Docker-based databases (UAT/DEV)."
    echo ""
    echo "Make sure your src/knexfile.js has containerName set, e.g.:"
    echo "  production: { containerName: 'zuugle-postgres-uat', ... }"
    echo "  development: { containerName: 'zuugle-postgres-dev', ... }"
    exit 1
fi

echo "Downloading dump..."
wget -q https://uat-dump.zuugle.at/zuugle_postgresql.dump -O zuugle_postgresql.dump

# Locate the sync script
if [ -f "build/jobs/syncDataDocker.js" ]; then
    SCRIPT_PATH="build/jobs/syncDataDocker.js"
elif [ -f "jobs/syncDataDocker.js" ]; then
    SCRIPT_PATH="jobs/syncDataDocker.js"
else
    echo "Error: Cannot find syncDataDocker.js"
    exit 1
fi

echo "Restoring $CONTAINER_NAME (NODE_ENV=$NODE_ENV)..."
node $SCRIPT_PATH

echo "$CONTAINER_NAME restored successfully."

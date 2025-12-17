#!/bin/bash
set -e

cd "$(dirname "$0")"

# Check if running on server (knexfile.js in same directory) or local dev (knexfile.js in src/)
if [ ! -f "knexfile.js" ]; then
    echo "You are developing on your local machine? Please run 'npm run import-data-docker'"
    exit 0
fi

# Read containerName from knexfile.js based on NODE_ENV
NODE_ENV="${NODE_ENV:-production}"
export NODE_ENV

CONTAINER_NAME=$(node -e "
  const config = require('./knexfile.js');
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

# Use date-based filename to avoid redundant downloads
TODAY=$(date +%Y-%m-%d)
DUMP_FILE="zuugle_postgresql_${TODAY}.dump"

if [ -f "$DUMP_FILE" ]; then
    echo "Dump for today ($TODAY) already exists, skipping download."
else
    echo "Downloading dump for $TODAY..."
    wget -q https://uat-dump.zuugle.at/zuugle_postgresql.dump -O "$DUMP_FILE"
    
    # Clean up old dump files (keep only today's)
    find . -maxdepth 1 -name "zuugle_postgresql_*.dump" ! -name "$DUMP_FILE" -delete 2>/dev/null || true
fi

# Create symlink for syncDataDocker.js compatibility
ln -sf "$DUMP_FILE" zuugle_postgresql.dump

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


#!/bin/bash
set -e

cd "$(dirname "$0")"

# Central dump location on server
DUMP_DIR="/usr/local/zuugle/uat-dump"

# Check if running on server (central dump directory exists) or local dev
if [ ! -d "$DUMP_DIR" ]; then
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
    echo "Error: No containerName found in knexfile.js for NODE_ENV=$NODE_ENV"
    echo "This script is only for Docker-based databases (UAT/DEV)."
    echo ""
    echo "Make sure your knexfile.js has containerName set, e.g.:"
    echo "  production: { containerName: 'zuugle-postgres-uat', ... }"
    echo "  development: { containerName: 'zuugle-postgres-dev', ... }"
    exit 1
fi

# Use date-based filename to avoid redundant downloads
TODAY=$(date +%Y-%m-%d)
DUMP_FILE="$DUMP_DIR/zuugle_postgresql_${TODAY}.dump"

if [ -f "$DUMP_FILE" ]; then
    echo "Dump for today ($TODAY) already exists, skipping download."
else
    echo "Downloading dump for $TODAY..."
    wget -q https://uat-dump.zuugle.at/zuugle_postgresql.dump -O "$DUMP_FILE"
    
    # Clean up old dump files (keep only today's)
    find "$DUMP_DIR" -maxdepth 1 -name "zuugle_postgresql_*.dump" ! -name "$(basename $DUMP_FILE)" -delete 2>/dev/null || true
fi

# Copy dump file to current directory for syncDataDocker.js compatibility
cp "$DUMP_FILE" zuugle_postgresql.dump

# Locate the sync script
if [ -f "jobs/syncDataDocker.js" ]; then
    SCRIPT_PATH="jobs/syncDataDocker.js"
else
    echo "Error: Cannot find jobs/syncDataDocker.js"
    exit 1
fi

echo "Restoring $CONTAINER_NAME (NODE_ENV=$NODE_ENV)..."
node $SCRIPT_PATH

# Clean up local copy
rm -f zuugle_postgresql.dump

echo "$CONTAINER_NAME restored successfully."

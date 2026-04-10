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

# Central dump location on server
DUMP_DIR="/usr/local/zuugle/uat-dump"

# Check if running on server (central dump directory exists) or local dev
if [ ! -d "$DUMP_DIR" ]; then
    echo "You are developing on your local machine? Please run 'npm run import-data-docker-download'"
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

# Database credentials
DB_NAME=$(node -e "
  const config = require('./knexfile.js');
  const env = process.env.NODE_ENV || 'production';
  console.log(config[env]?.connection?.database || '');
")
DB_USER=$(node -e "
  const config = require('./knexfile.js');
  const env = process.env.NODE_ENV || 'production';
  console.log(config[env]?.connection?.user || '');
")

if [ -z "$DB_NAME" ]; then
    echo "Error: No database name found in knexfile.js for NODE_ENV=$NODE_ENV"
    exit 1
fi

if [ -z "$DB_USER" ]; then
    echo "Error: No database user found in knexfile.js for NODE_ENV=$NODE_ENV"
    exit 1
fi

# Ensure Valkey cache container is running (shared across UAT/DEV)
if docker ps --format '{{.Names}}' | grep -q '^zuugle-valkey$'; then
    echo "Valkey container already running."
elif docker ps -a --format '{{.Names}}' | grep -q '^zuugle-valkey$'; then
    echo "Starting existing Valkey container..."
    docker start zuugle-valkey
else
    echo "Creating Valkey container..."
    docker run -d --name zuugle-valkey --restart always -p 127.0.0.1:6379:6379 valkey/valkey:8-alpine
fi

# Rebuild database structure if --structure flag is set
if [ "$REBUILD_STRUCTURE" = true ]; then
    echo "Rebuilding database structure from database.sql..."
    
    if [ -f "database.sql" ]; then
        cat database.sql | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME"
        echo "Structure rebuild completed."
    else
        echo "Error: database.sql not found!"
        exit 1
    fi
fi

# Locate the sync script
if [ -f "jobs/syncDataDockerDownload.js" ]; then
    SCRIPT_PATH="jobs/syncDataDockerDownload.js"
else
    echo "Error: Cannot find jobs/syncDataDockerDownload.js"
    exit 1
fi

echo "Restoring $CONTAINER_NAME (NODE_ENV=$NODE_ENV)..."
node $SCRIPT_PATH

# Clean up local copy
rm -f zuugle_postgresql.dump

echo "$CONTAINER_NAME restored successfully."

#!/bin/bash
set -e

# Change to the directory of the script
cd "$(dirname "$0")"

echo "Downloading dump..."
wget -q https://uat-dump.zuugle.at/zuugle_postgresql.dump -O zuugle_postgresql.dump

echo "Restoring UAT..."
export NODE_ENV=production

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
export NODE_ENV=development
node $SCRIPT_PATH

echo "All databases restored successfully."

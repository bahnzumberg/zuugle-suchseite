#!/bin/bash
set -e

# ==============================================================================
# restore-backup.sh
# Restores a Zuugle database backup created with "npm run create-backup".
# Supports both Docker Compose and native PostgreSQL environments.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Function to display usage and list available backups
show_usage() {
    echo "Usage: $0 <backup-filename-or-path> [--force]"
    echo ""
    echo "Restores a database backup (.dump file) created by 'npm run create-backup'."
    echo ""
    echo "Available backups in $SCRIPT_DIR:"
    local found=0
    for f in "$SCRIPT_DIR"/zuugle-db-backup-*; do
        if [ -f "$f" ] && [[ "$f" != *".sh" ]]; then
            local size
            size=$(du -h "$f" 2>/dev/null | cut -f1)
            local mtime
            mtime=$(date -r "$f" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || stat -c "%y" "$f" 2>/dev/null | cut -d'.' -f1)
            printf "  - %-40s (%s, %s)\n" "$(basename "$f")" "$size" "$mtime"
            found=1
        fi
    done
    if [ "$found" -eq 0 ]; then
        echo "  (No backups found in $SCRIPT_DIR)"
    fi
    echo ""
    exit 1
}

# Parse parameters
BACKUP_ARG=""
FORCE=false

while [[ "$#" -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_usage
            ;;
        -f|--force|-y|--yes)
            FORCE=true
            ;;
        *)
            if [ -z "$BACKUP_ARG" ]; then
                BACKUP_ARG="$1"
            else
                echo "Unknown argument: $1"
                show_usage
            fi
            ;;
    esac
    shift
done

if [ -z "$BACKUP_ARG" ]; then
    show_usage
fi

# Resolve backup file path
RESOLVED_BACKUP=""
if [ -f "$BACKUP_ARG" ]; then
    RESOLVED_BACKUP="$(cd "$(dirname "$BACKUP_ARG")" && pwd)/$(basename "$BACKUP_ARG")"
elif [ -f "${BACKUP_ARG}.dump" ]; then
    RESOLVED_BACKUP="$(cd "$(dirname "${BACKUP_ARG}.dump")" && pwd)/$(basename "${BACKUP_ARG}.dump")"
elif [ -f "$SCRIPT_DIR/$BACKUP_ARG" ]; then
    RESOLVED_BACKUP="$SCRIPT_DIR/$BACKUP_ARG"
elif [ -f "$SCRIPT_DIR/${BACKUP_ARG}.dump" ]; then
    RESOLVED_BACKUP="$SCRIPT_DIR/${BACKUP_ARG}.dump"
elif [ -f "$SCRIPT_DIR/zuugle-db-backup-$BACKUP_ARG" ]; then
    RESOLVED_BACKUP="$SCRIPT_DIR/zuugle-db-backup-$BACKUP_ARG"
elif [ -f "$SCRIPT_DIR/zuugle-db-backup-${BACKUP_ARG}.dump" ]; then
    RESOLVED_BACKUP="$SCRIPT_DIR/zuugle-db-backup-${BACKUP_ARG}.dump"
fi

if [ -z "$RESOLVED_BACKUP" ] || [ ! -f "$RESOLVED_BACKUP" ]; then
    echo "Error: Backup file '$BACKUP_ARG' not found."
    echo ""
    show_usage
fi

# Load database configuration from environment or .env files if not already set
get_env_val() {
    local key="$1"
    local file="$2"
    grep -E "^${key}=" "$file" 2>/dev/null | tail -1 | cut -d'=' -f2- | tr -d '\r"' | tr -d "'"
}

ENV_CANDIDATES=(
    "$SCRIPT_DIR/.env"
    "$SCRIPT_DIR/../.env"
    "$SCRIPT_DIR/../../.env"
    "$SCRIPT_DIR/../apps/backend/.env"
    "$(pwd)/.env"
    "$(pwd)/apps/backend/.env"
    "$(pwd)/../.env"
)

for env_candidate in "${ENV_CANDIDATES[@]}"; do
    if [ -f "$env_candidate" ]; then
        [ -z "$DB_HOST" ] && DB_HOST=$(get_env_val "DB_HOST" "$env_candidate")
        [ -z "$DB_PORT" ] && DB_PORT=$(get_env_val "DB_PORT" "$env_candidate")
        [ -z "$DB_USER" ] && DB_USER=$(get_env_val "DB_USER" "$env_candidate")
        [ -z "$DB_PASSWORD" ] && DB_PASSWORD=$(get_env_val "DB_PASSWORD" "$env_candidate")
        [ -z "$DB_NAME" ] && DB_NAME=$(get_env_val "DB_NAME" "$env_candidate")
        [ -n "$DB_NAME" ] && break
    fi
done

# Check for Docker Compose vs Native PostgreSQL
COMPOSE_DIR=""
COMPOSE_RUNNING=false

COMPOSE_SEARCH_DIRS=(
    "."
    "$(pwd)"
    "$(pwd)/apps/backend"
    "$SCRIPT_DIR"
    "$SCRIPT_DIR/.."
    "$SCRIPT_DIR/../apps/backend"
    "$SCRIPT_DIR/../.."
)

for d in "${COMPOSE_SEARCH_DIRS[@]}"; do
    if [ -d "$d" ] && { [ -f "$d/docker-compose.yaml" ] || [ -f "$d/docker-compose.yml" ]; }; then
        if (cd "$d" && docker compose ps --status running -q postgres 2>/dev/null | grep -q .); then
            COMPOSE_DIR="$d"
            COMPOSE_RUNNING=true
            break
        fi
    fi
done

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"
if [ -z "$DB_NAME" ]; then
    if [ "$COMPOSE_RUNNING" = true ]; then
        DB_NAME="zuugle_suchseite_dev"
    else
        DB_NAME="zuugle_postgresql_prod"
    fi
fi

echo "===================================================================="
echo "Zuugle Database Restore"
echo "===================================================================="
echo "Backup file : $RESOLVED_BACKUP ($(du -h "$RESOLVED_BACKUP" | cut -f1))"
echo "Database    : $DB_NAME"
echo "Target User : $DB_USER"
if [ "$COMPOSE_RUNNING" = true ]; then
    echo "Engine      : Docker Compose postgres container (in $COMPOSE_DIR)"
else
    echo "Engine      : Native PostgreSQL ($DB_HOST:$DB_PORT)"
fi
echo "===================================================================="

if [ "$FORCE" != true ]; then
    read -r -p "Are you sure you want to restore this backup? Existing tables will be replaced! [y/N]: " CONFIRM
    case "$CONFIRM" in
        [yY][eE][sS]|[yY])
            ;;
        *)
            echo "Restore cancelled by user."
            exit 0
            ;;
    esac
fi

echo "Starting restore..."

RESTORE_ARGS=(
    "--clean"
    "--if-exists"
    "--no-owner"
    "--no-privileges"
    "-U" "$DB_USER"
    "-d" "$DB_NAME"
)

set +e
if [ "$COMPOSE_RUNNING" = true ]; then
    (cd "$COMPOSE_DIR" && docker compose exec -T postgres pg_restore "${RESTORE_ARGS[@]}") < "$RESOLVED_BACKUP"
    RESTORE_STATUS=$?
else
    if ! command -v pg_restore >/dev/null 2>&1; then
        echo "Error: 'pg_restore' command not found on host."
        exit 1
    fi
    PGPASSWORD="$DB_PASSWORD" pg_restore -h "$DB_HOST" -p "$DB_PORT" "${RESTORE_ARGS[@]}" "$RESOLVED_BACKUP"
    RESTORE_STATUS=$?
fi
set -e

# pg_restore exit codes: 0 = success, 1 = success with notices/warnings, >1 = fatal error
if [ "$RESTORE_STATUS" -eq 0 ] || [ "$RESTORE_STATUS" -eq 1 ]; then
    echo "===================================================================="
    echo "Database restored successfully from $(basename "$RESOLVED_BACKUP")!"
    echo "===================================================================="
    exit 0
else
    echo "===================================================================="
    echo "Error: Database restore failed with exit code $RESTORE_STATUS."
    echo "===================================================================="
    exit "$RESTORE_STATUS"
fi

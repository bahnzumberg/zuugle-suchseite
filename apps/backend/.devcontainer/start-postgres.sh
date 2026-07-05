#!/bin/bash
# Start the in-container PostgreSQL for local development in the sandbox.
set -euo pipefail

PGVER=17
CLUSTER=main
PORT=5433
DB=zuugle_suchseite_dev
PASS=docker

CONF="/etc/postgresql/${PGVER}/${CLUSTER}/postgresql.conf"

# Match the port the app expects (.env DB_PORT=5433; avoids clashing with prod's 5432).
sed -i "s/^port = .*/port = ${PORT}/" "$CONF"

# Start the cluster if it is not already running.
if ! pg_lsclusters -h "${PGVER}" "${CLUSTER}" | grep -q online; then
    pg_ctlcluster "${PGVER}" "${CLUSTER}" start
fi

# Wait for readiness.
for _ in $(seq 1 30); do
    if su - postgres -c "pg_isready -p ${PORT}" >/dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Ensure the app's role password and database exist (idempotent).
su - postgres -c "psql -p ${PORT} -c \"ALTER USER postgres PASSWORD '${PASS}';\"" >/dev/null
if ! su - postgres -c "psql -p ${PORT} -tAc \"SELECT 1 FROM pg_database WHERE datname='${DB}'\"" | grep -q 1; then
    su - postgres -c "createdb -p ${PORT} ${DB}"
fi

echo "PostgreSQL ${PGVER} ready on 127.0.0.1:${PORT} (db=${DB}). Next: npm run build && npm run migrate"

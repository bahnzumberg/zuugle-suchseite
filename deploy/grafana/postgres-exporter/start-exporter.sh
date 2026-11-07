#!/bin/bash
set -e

# ==============================================================================
# start-exporter.sh
# Startet den Prometheus PostgreSQL Exporter Container für Zuugle.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Konfiguration ─────────────────────────────────────────────────────────────
# Trage hier das Passwort für den Benutzer zuugle_monitoring ein.
# WICHTIG: Verwende unbedingt EINFACHE Anführungszeichen ('...'), damit
# Sonderzeichen wie $$ (Shell PID-Expansion) und & nicht verändert werden!
DB_PASSWORD='<zuugle-db-password>'

DB_USER="zuugle_monitoring"
DB_NAME="zuugle_postgresql_prod"
DB_HOST="localhost"
DB_PORT="5432"

# ── Sicherheits-Check ─────────────────────────────────────────────────────────
if [ "$DB_PASSWORD" = '<zuugle-db-password>' ]; then
    echo "FEHLER: Bitte trage dein Datenbank-Passwort in DB_PASSWORD in dieser Datei ein!"
    exit 1
fi

if [ ! -f "$SCRIPT_DIR/queries.yaml" ]; then
    echo "FEHLER: queries.yaml nicht gefunden in $SCRIPT_DIR!"
    exit 1
fi

# ── Container starten ─────────────────────────────────────────────────────────
echo "Entferne alten Container (falls vorhanden)..."
docker rm -f zuugle_postgres_exporter 2>/dev/null || true

echo "Starte zuugle_postgres_exporter Container..."
docker run -d \
  --name zuugle_postgres_exporter \
  --restart unless-stopped \
  --net=host \
  -e DATA_SOURCE_NAME="host=${DB_HOST} port=${DB_PORT} user=${DB_USER} password=${DB_PASSWORD} dbname=${DB_NAME} sslmode=disable" \
  -e PG_EXPORTER_EXTEND_QUERY_PATH="/etc/postgres_exporter/queries.yaml" \
  -v "${SCRIPT_DIR}/queries.yaml:/etc/postgres_exporter/queries.yaml:ro" \
  prometheuscommunity/postgres-exporter:v0.16.0

echo "zuugle_postgres_exporter erfolgreich gestartet."
echo "Prüfe Metriken auf Port 9187..."
sleep 2

if curl -s http://localhost:9187/metrics | grep -q "zuugle_total_tours"; then
    echo "OK: Exporter antwortet und liefert Zuugle-Metriken!"
else
    echo "WARNUNG: Prüfe 'docker logs zuugle_postgres_exporter' auf eventuelle Verbindungsfehler."
fi

# Zuugle Database Backup & Restore Guide

This directory contains database backups and the restoration tooling for the Zuugle platform.

---

## Quick Reference

### 1. Creating a Backup

Run the following command from the backend app root:

```bash
npm run create-backup
```

- **Output Directory**: `zuugle-db-backup/` inside the backend app directory (can be overridden by setting the `BACKUP_DIR` environment variable).
- **File Format**: `zuugle-db-backup-YYYY-MM-DD.dump` (PostgreSQL Custom Archive Format)
- **Retention**: Exactly the 3 newest backups are preserved. Older backups (4th, 5th, etc.) are automatically pruned upon creating a new backup.

---

### 2. Restoring a Backup

Use the `restore-backup.sh` script located directly in this directory:

```bash
./restore-backup.sh <backup-filename>
```

#### Examples:

```bash
# By exact filename
./restore-backup.sh zuugle-db-backup-2026-10-31.dump

# Without .dump extension
./restore-backup.sh zuugle-db-backup-2026-10-31

# By date only
./restore-backup.sh 2026-10-31

# Non-interactive / scripted restore (skips confirmation prompt)
./restore-backup.sh 2026-10-31 --force
```

If invoked without arguments (`./restore-backup.sh`), the script displays usage instructions and lists all available backups in the directory with their file sizes and timestamps.

---

## How the Restore Process Works

1. **Environment Auto-Detection**:
   - **Docker Compose (Local / DEV / UAT)**: The script checks if a Docker Compose `postgres` container is running in the current or parent directories. If detected, the dump is streamed directly into the container using `docker compose exec -T postgres pg_restore`. No local host-level PostgreSQL client is required.
   - **Native PostgreSQL (PROD)**: If running natively on the host, the script uses the host's `pg_restore` connected via `DB_HOST:DB_PORT` using `DB_PASSWORD`.
2. **Database Credentials**:
   - Connection parameters are sourced automatically from the environment, falling back to the nearest `.env` file resolved relatively (e.g. `../.env` relative to the backup folder or the current working directory).
3. **Clean Reconstruction**:
   - The restore uses `--clean --if-exists --no-owner --no-privileges`.
   - Existing database objects in the target database are cleanly dropped and recreated.
   - User-generated tables and reference data are repopulated from the archive.

---

## What Data is Included and What is Excluded

The backup strategy is designed around a key architectural principle:

> **Back up all schema definitions and all data generated on the server itself. Exclude external bulk data and derived tables.**

### Included Data (Backed Up)

The backup contains the **complete DDL structure** for every database table, view, sequence, index, and constraint, PLUS all data for tables that originate on the server:

| Table | Why it is backed up |
|---|---|
| `user_list` | User favourite lists created on the website. Irreplaceable user data. |
| `user_list_tour` | Tours saved by users into their favourite lists. |
| `user_list_pairing_code` | Temporary pairing codes for syncing user lists across devices. |
| `logsearchphrase` | Live user search queries submitted on the website. |
| `logsearchphrase_archive` | Archived historical search phrases for analytics and search quality. |
| `sync_state` | State tracker for background sync jobs (e.g. weather forecast load IDs). |
| `knex_migrations` | Record of applied database schema migrations. |
| `knex_migrations_lock` | Migration concurrency lock. |
| `city_static` | Curated static list of 88 supported departure cities with coordinates. |
| `provider` | Provider configurations and GPX download permissions. |
| `gpx_changed_regenerate` | Local queue of tours requiring image/GPX regeneration. |

---

### Excluded Data (Structure Only, No Table Data)

The following tables have their **full table schema, indices, and constraints preserved**, but their row data is **omitted**:

| Table | Source / Reason for Exclusion |
|---|---|
| `tour_load`, `tour`, `tour_inactive` | Bulk tour catalogue data (50,000+ tours) populated externally from crawler/Hermes ETL pipelines. Completely reconstructible from upstream sources. |
| `fahrplan` | Timetable connections (200,000+ rows) synced nightly from external transit feeds via Hermes ETL. |
| `gpx`, `tracks` | Waypoint and elevation track geometry (300,000+ rows) synced externally. |
| `pois`, `poi2tour` | Points of interest imported from external feeds. |
| `canonical_alternate` | Canonical URL mapping table generated during external tour ingest. |
| `city` | Rebuilt on every sync run from `city_static`. |
| `city2tour`, `city2tour_flat` | Materialized search indices generated during `import-data-prod` by joining `city`, `tour`, and `fahrplan`. |
| `kpi` | Aggregated metrics recalculated during data sync. |
| `search_suggestions` | Search dictionary regenerated on each sync run. |
| `tour_weather_daily`, `tour_weather_1h`, `overlay_weather_daily` | Weather forecasts fetched periodically from external weather APIs (Open-Meteo). |

> [!IMPORTANT]
> **Full GPX and Track Reload Requirement**:
> Because table row data for `gpx` and `tracks` is omitted from the backup, these tables will be empty after a restore. To ensure that the ETL pipeline performs a complete transfer of all coordinates and elevation tracks (instead of an incremental sync), you **MUST** run the following SQL update **BEFORE** triggering the data loading job:
>
> ```sql
> UPDATE public.etl_progress 
> SET last_successful_run_timestamp = '2000-01-01 00:00:00+01'
> WHERE process_name IN ('tracks_transfer', 'gpx_transfer');
> ```

---

## Rationale for this Strategy

1. **Safety of Primary User Data**:
   - Touren and timetables can always be re-fetched from the scrapers or nightly ETL.
   - User favourite lists (`user_list`), saved tours, and search analytics (`logsearchphrase`) **cannot** be regenerated from any external source. If lost, they are gone forever.
2. **Speed & Minimal Storage Overhead**:
   - A full dump of `fahrplan`, `gpx`, and `tracks` is several hundred megabytes to gigabytes in size and takes minutes to dump and restore.
   - By excluding the external bulk data, the backup completes in **1 to 2 seconds** and takes only **~1 to 2 MB**, making frequent automated backups completely frictionless.
3. **Seamless Recovery Workflow**:
   - Restoring a backup brings the entire schema, user lists, and server state back to a healthy baseline.
   - Running the regular data loader (`npm run import-data-prod` on PROD or `npm run import-data` on DEV/UAT) immediately repopulates all tour and timetable data without any schema conflicts.

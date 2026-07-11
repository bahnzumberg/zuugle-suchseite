#!/usr/bin/env python3
from __future__ import annotations
"""
cleanup_svg.py — Delete SVG files that don't belong to any tour in the DB.

Usage:  python3 scripts/cleanup_svg.py
        or:  python3 scripts/cleanup_svg.py /path/to/svg365

Reads DB credentials from environment variables (with defaults for local Docker):
  DB_HOST  (default: localhost)
  DB_PORT  (default: 5433)
  DB_USER  (default: postgres)
  DB_PASSWORD (default: docker)
  DB_NAME  (default: zuugle_suchseite_dev)
"""

import os
import sys
from pathlib import Path

import psycopg2


def get_valid_ids(conn) -> set[int]:
    """Query the DB for all tour IDs (active + inactive)."""
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id FROM tour_inactive UNION SELECT id FROM tour ORDER BY id"
        )
        return {row[0] for row in cur.fetchall()}


def main():
    # Default: public/svg365 relative to this script (scripts/../public/svg365)
    script_dir = Path(__file__).resolve().parent
    default_svg_dir = script_dir.parent / "public" / "svg365"
    base_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else default_svg_dir

    if not base_dir.is_dir():
        print(f"ERROR: Directory '{base_dir}' does not exist.", file=sys.stderr)
        sys.exit(1)

    # ── DB connection ──────────────────────────────────────────
    db_config = {
        "host": os.environ.get("DB_HOST", "localhost"),
        "port": os.environ.get("DB_PORT", "5433"),
        "user": os.environ.get("DB_USER", "postgres"),
        "password": os.environ.get("DB_PASSWORD", "docker"),
        "dbname": os.environ.get("DB_NAME", "zuugle_suchseite_dev"),
    }

    print("Querying database for valid tour IDs...")
    try:
        conn = psycopg2.connect(**db_config)
    except psycopg2.OperationalError as e:
        print(f"ERROR: Could not connect to database: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        valid_ids = get_valid_ids(conn)
    finally:
        conn.close()

    if not valid_ids:
        print(
            "WARNING: No tour IDs returned from DB. "
            "Aborting to prevent accidental deletion.",
            file=sys.stderr,
        )
        sys.exit(1)

    print(f"Found {len(valid_ids)} valid tour IDs in database.")

    # ── Scan SVG files and delete orphans ──────────────────────
    deleted = 0
    kept = 0

    for svg_file in sorted(base_dir.rglob("*.svg")):
        stem = svg_file.stem  # filename without .svg

        # Skip non-numeric filenames (e.g. this script's name)
        if not stem.isdigit():
            print(f"SKIP: {svg_file} (non-numeric filename)")
            continue

        tour_id = int(stem)

        if tour_id in valid_ids:
            kept += 1
        else:
            print(f"DELETE: {svg_file} (tour ID {tour_id} not in DB)")
            svg_file.unlink()
            deleted += 1

            # Remove parent directory if now empty
            parent = svg_file.parent
            if parent != base_dir and parent.is_dir() and not any(parent.iterdir()):
                print(f"  RMDIR: {parent} (empty)")
                parent.rmdir()

    # ── Summary ────────────────────────────────────────────────
    print()
    print("Done.")
    print(f"  Kept:    {kept}")
    print(f"  Deleted: {deleted}")
    print(f"  Total:   {kept + deleted}")


if __name__ == "__main__":
    main()

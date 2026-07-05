# Deployment Constraints

- **Secrets live in the environment, never in git.** `src/knexfile.js` and
  `src/knexfileTourenDb.js` are committed but hold **no credentials** — they read
  everything from environment variables (see `src/knexfile.js`). Locally those come from
  a gitignored `.env` (copy `.env.example`); on servers from the PM2 env block /
  systemd `EnvironmentFile`. Never commit a `.env` or hard-code a password.
- **Database schema is managed by knex migrations** (`src/migrations/`), not by a
  hand-edited `database.sql`. Schema changes go through `npm run migrate:make` and are
  applied with `npm run migrate` — including in the deploy workflow.

## Procedure for Updates

- **Schema changes:** add a migration under `src/migrations/`; it deploys automatically.
- **Connection settings** (host, port, pool size, credentials): change the environment
  (`.env` locally; PM2 env block / systemd `EnvironmentFile` on servers) — **not** the
  committed knexfile. Server env changes are applied manually via SSH.

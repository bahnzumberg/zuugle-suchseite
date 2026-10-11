# zuugle-api (Backend) — Agent Guidelines

Node.js backend API for the Zuugle platform. Manages tour data, GPX files, and images.

This app lives at `apps/backend/` in the **zuugle-suchseite monorepo**; the frontend is at
[`../frontend`](../frontend). See the repo-root [`README.md`](../../README.md) for the map.

See the repo-root [`.agents/AGENTS.md`](../../.agents/AGENTS.md) for language, git
workflow, and commit guidelines that apply to the whole monorepo.

## Git Workflow

- Pushing a change under `apps/backend/**` to `uat` triggers the `UAT Deploy (Backend)`
  action (path-filtered): build → rsync to server → docker + `npm run migrate` → PM2 restart.
- `dev` and `main` deploy the same way to their environments. Branch/env map:
  `dev`→dev.zuugle.at, `uat`→www2.zuugle.at, `main`→www.zuugle.at.

## Tech Stack

- **Runtime:** Node.js v24.18.0 (see `.nvmrc`) — use `nvm`
- **Database:** PostgreSQL (local via Docker on port 5433)
- **ORM:** Knex.js
- **Logging:** custom logger → `logs/api.logs`

## Key Commands

```bash
nvm use && npm install                  # setup
npm run build                           # compile + copy assets
npm run migrate                         # apply DB schema (knex migrations)
npm run import-data                     # seed local DB from UAT dump
npm run start                           # dev server
```

Database schema is managed by **knex migrations** in `src/migrations/`.
Add a change with `npm run migrate:make <name>`; it is applied
by `npm run migrate` locally and automatically on deploy.

## Pre-Push Checklist

**Before every `git push`, run ALL of these checks and fix any failures.**
These mirror the GitHub Actions in `code-checks.yml` and `_deploy-backend.yml`.
Do not push code that fails any of these — it will fail CI.

```bash
cd apps/backend
npm run format        # auto-format with Prettier (fix issues first)
npm run format:check  # verify formatting (CI runs this)
npm run lint          # ESLint (CI runs this)
npm run tsc           # TypeScript type-check (CI runs this)
npm test              # Jest test suite (CI runs this post-deploy)
npm run build         # verify the build succeeds (CI builds before deploy)
node scripts/check-cron-scripts.mjs  # guard cron-invoked npm scripts (CI runs this)
```

### Updating the GPX reference image

`test/gpx-image.test.js` compares generated map screenshots against
`test/fixtures/gpx_image_reference.webp` using pixel-level analysis. If you change
anything that visibly affects map rendering (markers, colors, layout, Leaflet config),
update the reference before committing:

```bash
rm test/fixtures/gpx_image_reference.webp
npm test -- --testPathPattern=gpx-image   # first run recreates the reference
git add test/fixtures/gpx_image_reference.webp
```

## Commit Guidelines

Use `git rebase -i` to clean up messy history before pushing to `uat`.

## Additional Guidelines

- **No hardcoded credentials** — use environment variables (`.env` locally,
  host env on servers). See [`.agent/constraints.md`](./.agent/constraints.md).
- **Prefer targeted edits** — use small, precise code changes instead of overwriting
  entire files. See [`.agent/safe-editing.md`](./.agent/safe-editing.md).

# zuugle-api (backend)

Node.js backend API for the Zuugle platform. Manages tour data, GPX files, and images.

This app lives at `apps/backend/` in the **zuugle-suchseite monorepo**; the frontend is at
[`../frontend`](../frontend). See the repo-root [`README.md`](../../README.md) for the map.

## Workflow (CRITICAL)

- `uat` is the main development branch — **never commit or push directly to `main`**
- Always branch from `uat`:
    ```bash
    git checkout uat && git pull origin uat && git checkout -b feature/name
    ```
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

## Before Committing

All four must pass:

```bash
npm run tsc    # TypeScript check
npm test       # Jest suite
npm run format
npm run lint
```

### Updating the GPX reference image

`test/gpx-image.test.js` compares generated map screenshots against `test/fixtures/gpx_image_reference.webp` using pixel-level diff (`pixelmatch`). Up to 2% of pixels may differ to tolerate minor tile server changes. If you change anything that visibly affects map rendering (markers, colors, layout, Leaflet config), update the reference before committing:

```bash
rm test/fixtures/gpx_image_reference.webp
npm test -- --testPathPattern=gpx-image   # first run recreates the reference
git add test/fixtures/gpx_image_reference.webp
```

Failing to do this will cause CI to fail.

## Commit Messages

- One logical change per commit.
- Keep the first line under 72 characters — put extra detail in the body.
- Write a high-level message describing the intention, not just what changed.
- Reference related GitHub issues where they exist (e.g. `Fixes #42`). If unknown, ask the user for the issue number.

## Additional Guidelines

@.agent/constraints.md
@.agent/git-workflow.md
@.agent/safe-editing.md

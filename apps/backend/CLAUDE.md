# zuugle-api

Node.js backend API for the "Bahn zum Berg" (Zuugle) platform. Manages tour data, GPX files, and images.

- **Repository:** https://github.com/bahnzumberg/zuugle-api
- **Frontend:** https://github.com/bahnzumberg/zuugle-suchseite

## Workflow (CRITICAL)

- `uat` is the main development branch — **never commit or push directly to `main`**
- Always branch from `uat`:
    ```bash
    git checkout uat && git pull origin uat && git checkout -b feature/name
    ```
- Pushing to `uat` triggers GitHub Action `UAT Deploy` → Build → SCP to server → PM2 restart

## Tech Stack

- **Runtime:** Node.js v20.5.0 — use `nvm`
- **Database:** PostgreSQL (local via Docker on port 5433)
- **ORM:** Knex.js
- **Logging:** custom logger → `logs/api.logs`

## Key Commands

```bash
nvm use && npm install                  # setup
npm run start                           # dev server
npm run build                           # compile + copy assets
npm run import-data-docker-download    # seed local DB from UAT dump
```

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

# Zuugle

Monorepo for **Zuugle** — a public-transport-first tour search
platform. The frontend and backend are two self-contained projects that behave as **one
system**: they share the `/api` contract, deploy as a locked pair to the same hosts, and
use the same branch names (`dev` / `uat` / `main`).

```
zuugle-suchseite/            # repo root
├─ apps/
│  ├─ frontend/              # React SPA on Vite+ (the `vp` CLI). Node 24.
│  └─ backend/               # Express + Knex API. Node 24 (nvm). Postgres + Valkey.
├─ deploy/                   # Server-only state, versioned: nginx, PM2, load orchestrators
└─ .github/workflows/        # Unified, path-filtered CI/CD (one set of workflows for both apps)
```

This is a **loose monorepo**: each app keeps its own `package.json`, lockfile,
`node_modules`, and toolchain. There is intentionally **no root `package.json`** and **no
workspaces** — the two apps are co-located, not linked. Run each app's commands from inside
its own directory.

## Where to go

Set up the app you're working on — each is independent and self-contained:

| I want to work on…        | Go to                                          |
| ------------------------- | ---------------------------------------------- |
| The web UI                | [`apps/frontend/README.md`](apps/frontend/README.md) — Vite+ (`vp`) setup |
| The API / data / DB       | [`apps/backend/README.md`](apps/backend/README.md) — npm, Docker Compose, migrations |
| Deploy / servers / nginx  | [`deploy/README.md`](deploy/README.md) — nginx, PM2, loaders, per-host setup |

Fastest full-stack loop: `cd apps/frontend && vp dev:uat` runs the local UI against the
live UAT API with no local database — see the frontend README for the local-backend flow.

## Code quality: 

> **Read this before your first commit.** T
> The [`Code Checks`](.github/workflows/code-checks.yml) workflow runs on every push and pull
> request and **will fail the build** if formatting, linting, or types are wrong. **Run the
> checks yourself before pushing** — there is no hook to catch it for you.

**Why no hooks?** A single git clone has exactly one `core.hooksPath`, but the two apps use
different toolchains (frontend: Vite+ / `vp`; backend: husky). One shared hook path can't
serve both without them clobbering each other, so we removed local hooks entirely and rely
on CI. This is deliberate, not an oversight.

**Run the same checks CI runs, before you push** 

```bash
# frontend
cd apps/frontend && vp fmt . && vp lint --fix && vp check

# backend
cd apps/backend && npm run format && npm run lint:fix && npm run tsc && npm test
```

If you want a local pre-commit safety net for your own clone you can opt back in per app
(`vp config` in `apps/frontend`, or reinstate husky in `apps/backend`) — but only one can be
active at a time in a shared clone. 

## Branches → environments

Both apps share one set of branches. Pushing to a branch deploys the changed app(s) to the
matching environment via GitHub Actions; the deploy workflows are path-filtered so only the
subtree that changed redeploys.

| Branch | Environment | URL              |
| ------ | ----------- | ---------------- |
| `dev`  | DEV         | dev.zuugle.at    |
| `uat`  | UAT         | www2.zuugle.at   |
| `main` | PROD        | www.zuugle.at    |

`uat` is the primary development branch — branch your feature work from it. **Never push
directly to `main`.**

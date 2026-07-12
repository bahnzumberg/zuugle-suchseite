# Zuugle Monorepo — Agent Rules

## Pre-Push Checklist

**Before every `git push`, run these checks and fix all issues.**
These mirror the GitHub Actions in `.github/workflows/code-checks.yml`
and `_deploy-backend.yml`. Do not push code that fails any of these.

### Frontend (`apps/frontend/`)
```bash
cd apps/frontend
vp fmt .              # auto-format
vp lint --fix         # auto-fix lint issues
npm run format:check  # verify formatting (CI runs this)
npm run lint          # verify lint (CI runs this)
npm run build         # verify production build succeeds
```

### Backend (`apps/backend/`)
```bash
cd apps/backend
npm run format        # auto-format (Prettier)
npm run format:check  # verify formatting (CI runs this)
npm run lint          # ESLint (CI runs this)
npm run tsc           # TypeScript type-check (CI runs this)
npm test              # Jest test suite (CI runs this post-deploy)
npm run build         # verify the build succeeds (CI builds before deploy)
node scripts/check-cron-scripts.mjs  # guard cron-invoked npm scripts (CI runs this)
```

**Do not push code that fails any of these checks.**

## Package-Specific Rules

Each package has its own `AGENTS.md` with detailed guidelines. Read them when
working in that package:

- [`apps/frontend/AGENTS.md`](../apps/frontend/AGENTS.md) — Vite+, Oxlint, commit guidelines
- [`apps/backend/AGENTS.md`](../apps/backend/AGENTS.md) — references `CLAUDE.md`, constraints, git workflow

## Commit Guidelines

- One logical change per commit.
- Keep the subject line under 72 characters.
- Reference GitHub issues when they exist (e.g. `Fixes #42`).
- Never commit directly to `main`. Use feature branches → `dev`/`uat` → `main`.

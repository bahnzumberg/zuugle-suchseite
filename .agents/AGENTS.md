# Zuugle Monorepo — Agent Rules

## Pre-Push Checklist

**Before every `git push`, run these checks and fix all issues:**

### Frontend (`apps/frontend/`)
```bash
cd apps/frontend
vp fmt .          # auto-format
vp lint --fix     # auto-fix lint issues
vp check          # verify formatting + linting + type-check
```

### Backend (`apps/backend/`)
```bash
cd apps/backend
npm run format    # auto-format (prettier)
npm run lint      # eslint
npm run tsc       # type-check
npm test          # run test suite
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

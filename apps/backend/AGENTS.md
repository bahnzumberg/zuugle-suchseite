# AGENTS.md für zuugle-api

Dieses Repository nutzt **`CLAUDE.md`** als zentrale, verbindliche Quelle für Kontext und
Workflow-Regeln für alle KI-Coding-Assistenten (Claude, Copilot, Cursor, etc.). Um
Abweichungen zu vermeiden, dupliziert diese Datei diese Regeln **nicht** — sie verweist
darauf.

**Bitte lies zuerst:**

- [`CLAUDE.md`](./CLAUDE.md) — Projektübersicht, Tech-Stack, Workflow, Commands, Commit-Regeln
- [`.agent/constraints.md`](./.agent/constraints.md) — Deployment-Constraints (Secrets, DB-Schema)
- [`.agent/git-workflow.md`](./.agent/git-workflow.md) — Branch- und Commit-Workflow
- [`.agent/safe-editing.md`](./.agent/safe-editing.md) — sichere Bearbeitung bestehender Dateien
- [`README.md`](./README.md) — lokales Setup (nvm, Docker, Datenbank, Server starten)

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

## Additional Rules

- **UAT-First Workflow:** `uat` is the main development branch. **NEVER** commit
  or push directly to `main`. Branch off from `uat`.
- **No hardcoded credentials** — use environment variables (`.env` locally,
  host env on servers).

## Language

All content on GitHub must be written in **English**. This includes commit messages,
PR titles and descriptions, issue comments, code comments, and code review feedback.

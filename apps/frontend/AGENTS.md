# Agent Guidelines — Zuugle Frontend

## Language

All content on GitHub must be written in **English**. This includes commit messages,
PR titles and descriptions, issue comments, code comments, and code review feedback.

## Git Workflow

- **Do NOT commit or push unless the user explicitly asks for it.** The purpose of
  local development is to let the user test changes locally first.
- `uat` is the main development branch — **never commit or push directly to `main`**.
- Feature branches should be created from `uat`.

## Pre-Push Checklist

**Before every `git push`, run ALL of these checks and fix any failures.**
These mirror the GitHub Actions in `code-checks.yml`. Do not push code
that fails any of these — it will fail CI.

```bash
cd apps/frontend
vp fmt .              # auto-format (fix issues first)
vp lint --fix         # auto-fix lint issues
npm run format:check  # verify formatting (CI runs this — must pass clean)
npm run lint          # Oxlint lint check (CI runs this — must pass clean)
npm run build         # verify the production build succeeds
```

### What CI runs (for reference)

| GitHub Action step     | Local equivalent   |
| ---------------------- | ------------------ |
| `npm run format:check` | `vp fmt --check .` |
| `npm run lint`         | `vp lint`          |

## Code Quality

- Do not commit unformatted files.
- All lint and TypeScript errors must be fixed before committing.
- Avoid `// oxlint-disable` comments — fix the underlying issue instead.

## Commit Guidelines

- **One logical change per commit.** If changes belong together, commit them together —
  but don't group unrelated work.
- **Keep the first line under 72 characters.** It is the subject shown in
  `git log --oneline`, GitHub PR views, and notification emails — long subjects get
  truncated and are hard to scan. Put extra detail in the body (separated by a blank line).
- **Write a high-level commit message** that describes the intention or reason for
  the change, not just what files were touched.
- **Reference related GitHub issues** in the commit message when they exist
  (e.g. `Fixes #42`).
- Use interactive rebase (`git rebase -i`) to clean up a messy history before pushing
  to `uat` or `main`.

Bad: `fix stuff`, `wip`, `changes`
Good: `Fix mobile layout breaking on small screens (#87)`, `Add tour filter by difficulty level`

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

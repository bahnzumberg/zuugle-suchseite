# Agent Guidelines — Zuugle Frontend

See the repo-root [`.agents/AGENTS.md`](../../.agents/AGENTS.md) for language, git
workflow, and commit guidelines that apply to the whole monorepo.

## Design constraints

1. Match our current design system — before proposing anything, look at
   [component library / existing pages / design tokens file] and extract
   the actual patterns in use: color palette, type scale, spacing units,
   border-radius, shadow style, component conventions (buttons, forms,
   cards, etc.)
2. Default to consistency. Only diverge from an existing pattern if you
   have a concrete reason (e.g. the existing pattern doesn't support this
   interaction, or it would look broken in this context) — and if you do
   diverge, call it out explicitly and explain why, rather than silently
   introducing a new style.
3. Design for both breakpoints from the start, not mobile as an
   afterthought: show me how it behaves at desktop width and at mobile
   width, and flag any part of the interaction that needs to change
   shape (not just scale) between the two.

## Code documentation

Do not duplicate documentation.

- If code is self-evident, write no comment. A comment that restates what the code plainly does is
  a second copy to keep in sync, for no gain.

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

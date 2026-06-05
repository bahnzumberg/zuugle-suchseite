# Claude Code Guidelines

## Before every commit

Run both checks and fix any issues before committing:

```
npm run format        # format all files with prettier
npm run lint          # tsc --noEmit + eslint
```

- Do not commit unformatted files.
- All lint and TypeScript errors must be fixed before committing.
- Avoid `// eslint-disable` comments — fix the underlying issue instead.

## Commit messages

- One logical change per commit.
- Keep the first line under 72 characters — put extra detail in the body.
- Write a high-level message describing the intention, not just what changed.
- Reference related GitHub issues where they exist (e.g. `Fixes #42`). If unknown ask user for issue number.

See [AGENTS.md](AGENTS.md) for full details.

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

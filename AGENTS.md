# Agent Guidelines

## Code Quality Requirements

All agents and contributors must follow these rules before committing or submitting any changes.

### Formatting

Every file you touch must be formatted before committing. Run:

```
npm run format
```

Do not commit files that are not formatted. `prettier --check .` is the source of truth. If you are only modifying a subset of files, you may run `prettier --write <file>` on just those files.

### Linting

Every file you touch must pass linting before committing. Run:

```
npm run lint
```

This runs TypeScript type checking (`tsc --noEmit`) followed by ESLint. Fix all errors before committing — warnings should also be resolved where possible. Do not use `// eslint-disable` comments to silence errors without a documented reason.

To auto-fix fixable lint issues:

```
npm run lint:fix
```

### Pre-commit checklist

Before every commit, verify:

1. `npm run format:check` passes with no diff
2. `npm run lint` exits with no errors
3. No new TypeScript type errors introduced

Commits that fail formatting or linting checks will not be accepted.

## Commit Guidelines

Each commit must represent one logical change. Do not bundle unrelated changes into a single commit.

- **One logical change per commit.** If changes belong together, commit them together — but don't group unrelated work.
- **Keep the first line under 72 characters.** It is the subject shown in `git log --oneline`, GitHub PR views, and notification emails — long subjects get truncated and are hard to scan. Put extra detail in the body (separated by a blank line) if needed.
- **Write a high-level commit message** that describes the intention or reason for the change, not just what files were touched.
- **Reference related GitHub issues** in the commit message when they exist (e.g. `Fixes #42`).
- Use interactive rebase (`git rebase -i`) to clean up a messy history before pushing to `uat` or `main`.

Bad: `fix stuff`, `wip`, `changes`
Good: `Fix mobile layout breaking on small screens (#87)`, `Add tour filter by difficulty level`

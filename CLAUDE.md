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

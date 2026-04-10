# Git Commit Guidelines

## Check formatting and linting

```bash
npm run format
npm run lint
```

## Always commit ALL modified files

When the user requests a commit, use `git commit -am "message"` to include **all** modified files, not just specific ones.

```bash
git commit -am "message"
# or
git add .
git commit -m "message"
```

This ensures that formatting changes, dependency updates, and all related modifications are included in the commit.

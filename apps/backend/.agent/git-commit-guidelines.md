# Git Commit Guidelines

## Always commit ALL modified files

When the user requests a commit, use `git commit -am "message"` to include **all** modified files, not just specific ones.

**Wrong**:

```bash
git add src/jobs/sync.js src/jobs/syncDataDocker.js
git commit -m "message"
```

**Correct**:

```bash
git commit -am "message"
# or
git add .
git commit -m "message"
```

This ensures that formatting changes, dependency updates, and all related modifications are included in the commit.

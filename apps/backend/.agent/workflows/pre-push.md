---
description: Required checks before pushing code to GitHub
---

## Before Pushing to GitHub

**MANDATORY**: All automated tests must pass locally before pushing to remote:

```bash
# 1. Run TypeScript check
npm run tsc

# 2. Run all tests
npm test
```

Only push if **both commands complete without errors**.

## Why This Matters

- Catches errors before they reach CI/CD
- Prevents broken deployments to UAT/production
- Saves time waiting for GitHub Actions to fail

## Quick Reference

```bash
# Full pre-push check
npm run tsc && npm test && git push origin <branch>
```

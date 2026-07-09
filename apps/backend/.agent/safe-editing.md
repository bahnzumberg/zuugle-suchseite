---
description: Best practices before making code changes
---

## Before Starting Work

1. Always pull latest changes:

    ```bash
    git pull origin <current-branch>
    ```

2. Check for uncommitted changes from others:
    ```bash
    git status
    git log -3 --oneline
    ```

## When Editing Files

1. **Prefer targeted edits** - Use replace_file_content or multi_replace_file_content instead of overwriting entire files
2. **Never overwrite test files** without first viewing the current content
3. **Check file modification time** - if a file was recently modified, review the changes first

## Before Committing

1. Review all changes:
    ```bash
    git diff
    ```
2. Confirm no unintended overwrites

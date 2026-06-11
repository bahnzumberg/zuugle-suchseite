# Git Workflow

## Before committing

All four must pass:

```bash
npm run tsc    # TypeScript check
npm test       # Jest suite
npm run format
npm run lint
```

If you changed anything that affects GPX map rendering (markers, colors, layout, Leaflet config), update the reference image first — see `CLAUDE.md` for the procedure.

## Commit messages

- **One logical change per commit.** If changes belong together, commit them together — but don't group unrelated work.
- **Keep the subject line under 72 characters.** It's what shows in `git log --oneline`, GitHub PR views, and notification emails — long subjects get truncated.
- **Describe the intention, not the files touched.** Write why the change was made, not what was mechanically done.
- **Reference related issues** when they exist: `Fixes #42`, `Closes #87`.
- Use `git rebase -i` to clean up messy history before pushing to `uat`.

Bad: `fix stuff`, `wip`, `changes`  
Good: `Fix mobile layout breaking on small screens (#87)`, `Add tour filter by difficulty level`

Extra detail goes in the commit body, separated from the subject by a blank line.

## Commit all modified files

Use `git commit -am "message"` or `git add . && git commit -m "message"` to include formatting changes, dependency updates, and all related modifications.

## Before pushing

Same checks apply — only push if `npm run tsc && npm test` both complete without errors.

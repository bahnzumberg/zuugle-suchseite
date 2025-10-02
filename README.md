# Zuugle Suchseite

## First time installation

### Install Volta

Volta makes it really easy to always have the correct node engine (similar to nvm but faster and even simpler).

Follow the installation directions: https://docs.volta.sh/guide/getting-started

### Install all modules

Execute in the project directory:

    npm install

and install all dependencies.

## Run frontend with local backend

### Prepare API

Follow the steps described at https://github.com/bahnzumberg/zuugle-api#zuugleat-api

### Execute frontend locally

    npm run start

This will run the frontend in a browser on http://localhost:3000

## Run frontend with remote backend

    npm run start-remote-api

## Common issues

- `Error: ENOSPC: System limit for number of file watchers reached`
  Fix (Linux):

```bash
echo "fs.inotify.max_user_watches=131070" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Contributing

We use [Prettier](https://prettier.io/) to ensure consistent formatting across all files (things like newlines, and quotation marks).
We use [ESLint](https://eslint.org/) to avoid common issues and also ensure consistent style in JavaScript/TypeScript code.
We use [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to check for type errors in TypeScript code.

All three tools are run in our GitHub pipeline on every push. If one of them finds an issue, the pipeline fails.
Prettier and ESLint are also run as pre-commit hooks, to catch problems as soon as possible.
The pre-commit hooks get activated automatically once you call `npm install`.

Before you push any changes to `uat` or `main` please go through the following checklist:

1. Test your code
2. `npm run format` applies prettier to all files
3. `npm run lint:fix` applies ESLint checks and fixes all issues that can be automatically fixed ➡️ manually fix remaining issues
4. `npm run tsc` checks for type errors ➡️ fix them manually
5. check your commits and messages:
   - one logical change per commit
   - changes that belong together are committed together
   - high-level description of changes/intention in the commit message
   - reference related issues on GitHub if they exist

Tip for Step 5: Interactive rebasing with git is a good way to clean up messy histories. E.g. `git rebase -i HEAD~5`

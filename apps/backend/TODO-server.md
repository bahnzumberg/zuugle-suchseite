# Server TODO

Things to verify on the server before/during next deployment.

## ecosystem.config.js — entry point path

`ecosystem.config.js` has `script: "./api/index.js"`. Verify where PM2 is invoked from:

- If PM2 runs from the repo/build root → path should be `./index.js`
- If PM2 runs from a parent directory and code lives in an `api/` subdirectory → path is correct as-is

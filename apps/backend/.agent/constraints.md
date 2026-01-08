# Deployment Constraints

- **knexfile.js**: This file MUST NOT be committed to GitHub or included in automatic deployments to production. It contains sensitive credentials and environment-specific configurations that differ between local Dev, GitHub CI, and Production.

## Procedure for Updates

Any changes to database configuration (IP, pool size, credentials) must be applied **MANUALLY** on the respective servers via SSH/vim.

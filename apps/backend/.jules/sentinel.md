## 2025-12-15 - SQL Injection in Tours API

**Vulnerability:** SQL Injection in `src/routes/tours.js` (`getWrapper` and `totalWrapper`) due to string interpolation in `knex.raw`.
**Learning:** `knex.raw` does not automatically sanitize template literals. Dynamic query construction for `UNION` and `WHERE` clauses requires careful binding management.
**Prevention:** Always use parameterized queries (`?`) and pass bindings array to `knex.raw`. Validate input where possible.

## 2025-01-28 - SQL Injection in Search Filters

**Vulnerability:** Extensive SQL injection in `listWrapper` and `filterWrapper` in `src/routes/tours.js` via search parameters.
**Learning:** Complex dynamic raw SQL queries require strict synchronization between query string construction and binding array population.
**Prevention:** Construct binding arrays dynamically alongside SQL fragments.

## 2025-12-17 - Additional SQL Injection in Tours Connections

**Vulnerability:** SQL Injection in `src/routes/tours.js` (`connectionsExtendedWrapper`) due to string interpolation of `id` and `city` in `knex.raw`.
**Learning:** The pattern of using template literals in `knex.raw` was pervasive. Input validation for `req.params` was also missing.
**Prevention:** Audit all `knex.raw` usages. Enforce parameterization and type checking (e.g., `parseInt`).

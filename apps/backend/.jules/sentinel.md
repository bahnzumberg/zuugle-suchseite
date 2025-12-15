## 2025-12-15 - SQL Injection in Tours API
**Vulnerability:** SQL Injection in `src/routes/tours.js` (`getWrapper` and `totalWrapper`) due to string interpolation in `knex.raw`.
**Learning:** `knex.raw` does not automatically sanitize template literals. Dynamic query construction for `UNION` and `WHERE` clauses requires careful binding management.
**Prevention:** Always use parameterized queries (`?`) and pass bindings array to `knex.raw`. Validate input where possible.

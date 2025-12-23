# Palette's Journal

## 2025-02-24 - Interactive Images vs Buttons
**Learning:** Using `<img>` tags with `onClick` handlers for social links creates inaccessible controls that screen readers treat as static images and keyboard users cannot activate.
**Action:** Always wrap interactive icons in `<IconButton>` (if action) or `<a>` (if link) with `aria-label` to ensure focusability and semantic correctness.

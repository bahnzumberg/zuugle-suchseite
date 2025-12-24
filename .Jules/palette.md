## 2025-02-18 - Footer Links Accessibility Pattern

**Learning:** Found footer links implemented as `onClick` handlers on `Typography` and `img` elements, making them inaccessible to keyboard users and screen readers.
**Action:** Always wrap interactive elements in semantic `<a>` or `<Link>` tags instead of attaching click handlers to non-interactive elements.

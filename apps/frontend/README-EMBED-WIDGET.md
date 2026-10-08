# Zuugle Embed Widget

A standalone, embeddable search widget that allows third-party websites to integrate Zuugle's public transport tour search directly into their pages.

---

## 1. Purpose & Live Usage

- **Live Page**: [https://www.bahn-zum-berg.at/zuugle-suche/](https://www.bahn-zum-berg.at/zuugle-suche/)
- **Target Audience / Purpose**: Enables visitors of _Bahn zum Berg_ to search outdoor tours accessible via train and bus without leaving the website.
- **Components Included**: Search bar, tour filter drawer, interactive Leaflet map with clustering, and tour result tiles.

---

## 2. Integration on Host Pages

To embed the widget into a host page, include the stylesheet in `<head>` and place the container `<div>` along with the deferred script where the widget should render:

```html
<!-- 1. Widget CSS -->
<link rel="stylesheet" href="https://dev.zuugle.at/embed/zuugle-embed.css" />

<!-- 2. Mount point container with configuration attributes -->
<div
  id="zuugle-embed"
  data-lang="de"
  data-city="amstetten"
  data-map="true"
  data-search=""
></div>

<!-- 3. Standalone widget script (deferred) -->
<script src="https://dev.zuugle.at/embed/zuugle-embed.js" defer></script>
```

### Supported `data-*` Attributes

| Attribute     | Type                            | Default   | Description                                                  |
| ------------- | ------------------------------- | --------- | ------------------------------------------------------------ |
| `data-lang`   | string                          | `"de"`    | UI language code.                                            |
| `data-city`   | string                          | `null`    | Pre-selects a starting city slug (e.g. `amstetten`, `wien`). |
| `data-map`    | boolean (`"true"` \| `"false"`) | `"false"` | Whether to display the interactive map on initial load.      |
| `data-search` | string                          | `null`    | Initial text search query.                                   |

---

## 3. Architecture & Key Differences from Main App

The widget is self-contained and avoids polluting or conflicting with the host page:

### Fixed Provider (`bahnzumberg`)

- Provider is hard-coded to `bahnzumberg` and cannot be switched by users.
- In `Filter.tsx`, the provider selection section is hidden in embed mode (`!isEmbed`).
- In `TotalToursHeader.tsx`, the `bahnzumberg` filter chip is suppressed so users are not presented with a removable chip for a mandatory provider.
- In `FilterButton.tsx` and filter counter utilities, fixed providers are excluded so the active filter badge count starts at `0`.

### Viewport & Scroll Isolation

- In the standalone app, search updates scroll the browser viewport to `(0, 0)`.
- In embed mode, `useSearchTours.ts` detects `isEmbed` and `isBoundsOnlyChange` (map panning/zooming) and suppresses `window.scrollTo({ top: 0 })`. This prevents map zoom/pan interactions from jumping the host page viewport to the top.

### Routing & Redux Store

- Uses React Router's `MemoryRouter` rather than `BrowserRouter`, completely isolating widget navigation from the host page's URL history.
- Mounts its own Redux store instance with `EmbedContext` (`isEmbed: true`, `fixedProviders: ['bahnzumberg']`, `externalLinks: true`).
- Tour card links navigate directly to tour URLs on `bahn-zum-berg.at`.

### Direct Translation Inlining (`i18n.embed.ts`)

- The main app loads translations at runtime via `i18next-http-backend` from `/i18n/{lng}.json`.
- In the embed, this would make relative HTTP requests against the host origin (`https://www.bahn-zum-berg.at/i18n/de.json`) and result in 404 errors.
- `i18n.embed.ts` bundles `assets/i18n/de.json` directly into the JavaScript binary so zero external translation fetches occur.

### SEO & Head Isolation

- `createHead()` and `<UnheadProvider>` are initialized inside the embed root so `@unhead/react` (`useHead`) hooks do not fail.
- SEO helpers skip injecting document `<title>` and `<meta>` tags when running in embed mode.

### Error Boundary

- Wrapped in `EmbedErrorBoundary` to gracefully render a localized error message in case of an uncaught React error, preventing host page crashes.

### Build Defines & Process Shims (`vite.config.embed.ts`)

- **API Domain**: `__ZUUGLE_DOMAIN__` is injected at build time (`new URL(API_URL).hostname`), ensuring API calls transmit `?domain=dev.zuugle.at` (or production) rather than the host page hostname.
- **Node Shims**: Vite outputs an IIFE bundle with `window.process = { env: { NODE_ENV: 'production' } }` banner and `process.env.NODE_ENV` compile-time replacement to prevent `ReferenceError: process is not defined` in browsers.

---

## 4. Build & Deployment Process

### Build Commands

The embed widget is built using a dedicated Vite configuration (`vite.config.embed.ts`):

```bash
cd apps/frontend

# Development server for testing embed.html
npm run embed:dev

# Production build for embed bundle
npm run embed:build
```

Build outputs are saved to `apps/frontend/build-embed/`:

- `zuugle-embed.js` (IIFE single bundle, ~1.37 MB uncompressed, ~440 KB gzipped)
- `zuugle-embed.css` (bundled stylesheet)

### Server Infrastructure & Hosting (DEV)

- **Domain**: `https://dev.zuugle.at`
- **Asset Directory on Server**: `/root/suchseite/dev-embed/`
- **Nginx Configuration** (`deploy/nginx/uat/sites-available/dev.zuugle.at`):
  ```nginx
  location /embed/ {
      auth_basic off;
      alias /root/suchseite/dev-embed/;
      expires 1h;
      add_header Cache-Control "public";
      add_header Access-Control-Allow-Origin "https://www.bahn-zum-berg.at" always;
  }
  ```
- **CORS & Authentication**:
  - `/embed/`, `/api/`, and `/public/` on `dev.zuugle.at` have `auth_basic off;` to allow cross-origin requests from `https://www.bahn-zum-berg.at`.
  - CORS header `Access-Control-Allow-Origin: "https://www.bahn-zum-berg.at"` is set on `/embed/` and `/public/` (for fonts/assets).

### Deployment Workflow

1. Run `npm run embed:build` in `apps/frontend/`.
2. Commit the updated build artifacts in `apps/frontend/build-embed/`.
3. Synchronize `build-embed/zuugle-embed.js` and `build-embed/zuugle-embed.css` to `/root/suchseite/dev-embed/` on the target server.

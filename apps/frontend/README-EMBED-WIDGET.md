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
<!-- 1. Widget CSS (via BunnyCDN Edge or origin) -->
<link rel="stylesheet" href="https://cdn.zuugle.at/embed/zuugle-embed.css" />
<!-- Alternative without CDN: https://www.zuugle.at/embed/zuugle-embed.css -->

<!-- 2. Mount point container with configuration attributes -->
<div
  id="zuugle-embed"
  data-domain="www.zuugle.at"
  data-lang="de"
  data-city="amstetten"
  data-map="true"
  data-search=""
  data-sticky-top="0"
  data-sync-url="false"
></div>

<!-- 3. Standalone widget script (deferred, via BunnyCDN Edge or origin) -->
<script src="https://cdn.zuugle.at/embed/zuugle-embed.js" defer></script>
<!-- Alternative without CDN: https://www.zuugle.at/embed/zuugle-embed.js -->
```

### Supported `data-*` Attributes

| Attribute         | Type                            | Default           | Description                                                                                                                       |
| ----------------- | ------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `data-domain`     | string                          | `"www.zuugle.at"` | Target Zuugle domain (e.g. `www.zuugle.at`, `www.zuugle.de`, `www2.zuugle.at`). Controls API database endpoint and domain filter. |
| `data-sticky-top` | number / string                 | `0`               | Top offset in pixels for the sticky search bar (e.g. `80` to dock neatly beneath a fixed host navbar).                            |
| `data-sync-url`   | boolean (`"true"` \| `"false"`) | `"false"`         | When `true`, reads initial filters from and syncs changes to the host page URL query string via `history.replaceState`.           |
| `data-lang`       | string                          | `"de"`            | UI language code (`de`, `en`, etc.).                                                                                              |
| `data-city`       | string                          | `null`            | Pre-selects a starting city slug (e.g. `amstetten`, `wien`). Overridden by host `?city=` query param if present.                  |
| `data-map`        | boolean (`"true"` \| `"false"`) | `"false"`         | Whether to display the interactive map on initial load. Overridden by host `?map=` query param if present.                        |
| `data-search`     | string                          | `null`            | Initial text search query. Overridden by host `?search=` query param if present.                                                  |

---

## 3. Architecture & Key Features

The widget is completely self-contained and avoids polluting or conflicting with the host page:

### Dynamic Domain & Database Routing (`data-domain`)

- Rather than being hard-coded to a single environment, the widget dynamically configures its API endpoint and domain filter at runtime from `data-domain`.
- **Default / Fallback**: `"www.zuugle.at"` (talks to `https://www.zuugle.at/api` with Austrian database and filter `tld = 'AT'`).
- **German Production**: `data-domain="www.zuugle.de"` routes requests to `https://www.zuugle.de/api` with German database and `tld = 'DE'`. Autocomplete suggestions and outbound tour card URLs automatically rewrite to `bahn-zum-berg.de`.
- **UAT / Staging**: `data-domain="www2.zuugle.at"` routes to `https://www2.zuugle.at/api`.
- **Asset Base**: Static assets are loaded from `https://cdn.zuugle.at` for production domains, or from the respective environment's `/public` path for UAT/DEV/local.

### Sticky Header & Intelligent Scroll Positioning (`data-sticky-top`)

- **Configurable Docking**: Host websites often feature fixed or sticky navigation headers. Setting `data-sticky-top="80"` (or any pixel value) sets `.sticky-header { position: sticky; top: 80px; }`, preventing the search bar from disappearing beneath the host navbar.
- **Scroll Offset Compensation**: Mobile quick-nav (`MobileQuickNav`) and scroll position indicators automatically factor in `stickyTop + headerHeight`.
- **Intelligent Viewport Scrolling**: When a mobile search is submitted or a navigation button ("Suche", "Karte", "Touren") is clicked, the window scrolls smoothly to the top of the `#zuugle-embed` container (minus `stickyTop`) rather than to `(0, 0)` of the document. This preserves the host page's header and hero context.

### URL Deep-Linking & Optional Host URL Synchronization (`data-sync-url`)

- **Direct URL Deep-Linking**: Any URL query parameters (`?search=schneeberg`, `?city=wien`, `?map=true`) are automatically evaluated on initial page load, immediately launching the corresponding search or opening the map.
- **Two-Way Synchronization (`data-sync-url="true"`)**:
  - Whenever the user updates search terms, selected city, or toggles the map, the host page's URL query string is kept in sync via `window.history.replaceState`.
  - Non-Zuugle query parameters on the host page (e.g. UTM parameters, campaign tags) are strictly preserved.
  - Browser Back and Forward navigation (`popstate` events) syncs back into the search state.
- When `false` (default), the widget uses an isolated React Router `MemoryRouter` with zero impact on the host page URL (while still respecting initial URL parameters on load).

### Mobile Map View & Dynamic Spacing

- In mobile view (`< 600px`), when the map is displayed (`showMap === true`), a dynamic spacing below the map pushes the tour card container down so that the first tour card tile is not visible in the viewport, plus a 10px safety margin.
- This ensures full focus on the interactive map without visual distraction from a peeking card tile at the bottom.
- When scrolling down past the map or switching to the tour view, the tour cards smoothly appear.

### Fixed Provider (`bahnzumberg`)

- Provider is hard-coded to `bahnzumberg` and cannot be switched by users.
- In `Filter.tsx`, the provider selection section is hidden in embed mode (`!isEmbed`).
- In `TotalToursHeader.tsx`, the `bahnzumberg` filter chip is suppressed so users are not presented with a removable chip for a mandatory provider.
- In `FilterButton.tsx` and filter counter utilities, fixed providers are excluded so the active filter badge count starts at `0`.
- Tour card links navigate directly to tour URLs on `bahn-zum-berg.at` (or `bahn-zum-berg.de` for `.de` domains).

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

- **Process Shims**: Vite outputs an IIFE bundle with `window.process = { env: { NODE_ENV: 'production' } }` banner and `process.env.NODE_ENV` compile-time replacement to prevent `ReferenceError: process is not defined` in third-party browsers.
- **Default Targets**: Build-time defines provide default fallback values when `data-domain` is omitted.

---

## 4. Build & Deployment Process

### Build Commands

The embed widget is built using a dedicated Vite configuration (`vite.config.embed.ts`):

```bash
cd apps/frontend

# Development server for testing embed.html (opens mock host page)
npm run embed:dev

# Production build for embed bundle
VITE_API_URL=https://www.zuugle.at/api VITE_ASSET_BASE_URL=https://cdn.zuugle.at npm run embed:build
```

Build outputs are saved to `apps/frontend/build-embed/`:

- `zuugle-embed.js` (IIFE single bundle, ~1.39 MB uncompressed, ~448 KB gzipped)
- `zuugle-embed.css` (bundled stylesheet, ~35 KB uncompressed, ~10 KB gzipped)

### Server Infrastructure & Hosting

#### Production (`https://www.zuugle.at`)

- **Asset Directory**: `/root/suchseite/embed/`
- **Nginx Configuration** (`deploy/nginx/prod/snippets/zuugle.conf`):
  ```nginx
  # Direct access
  location /embed/ {
      alias /root/suchseite/embed/;
      expires 1h;
      add_header Cache-Control "public";
      add_header Access-Control-Allow-Origin "https://www.bahn-zum-berg.at" always;
      add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
      add_header X-Content-Type-Options "nosniff" always;
  }

  # BunnyCDN Pull Zone access (https://cdn.zuugle.at/embed/...)
  location /public/embed/ {
      alias /root/suchseite/embed/;
      expires 48h;
      add_header Cache-Control "public";
      add_header Access-Control-Allow-Origin "*" always;
      add_header X-Content-Type-Options "nosniff" always;
  }
  ```

#### Development (`https://dev.zuugle.at`)

- **Asset Directory**: `/root/suchseite/dev-embed/`
- **Nginx Configuration** (`deploy/nginx/uat/sites-available/dev.zuugle.at`):
  ```nginx
  location /embed/ {
      auth_basic off;
      alias /root/suchseite/dev-embed/;
      expires 1h;
      add_header Cache-Control "public";
      add_header Access-Control-Allow-Origin "https://www.bahn-zum-berg.at" always;
  }

  location /public/embed/ {
      auth_basic off;
      alias /root/suchseite/dev-embed/;
      expires 48h;
      add_header Cache-Control "public";
      add_header Access-Control-Allow-Origin "*" always;
      add_header X-Content-Type-Options "nosniff" always;
  }
  ```

### Deployment Workflow

The embed widget is built and deployed automatically by GitHub Actions (`_deploy.yml` via `deploy2dev.yml` and `deploy2prod.yml`) on every frontend deploy:

- **DEV**: API `https://dev.zuugle.at/api` → `/root/suchseite/dev-embed/` (secret `DEV_REMOTE_TARGET_EMBED`)
- **PROD**: API `https://www.zuugle.at/api` → `/root/suchseite/embed/` (secret `PROD_REMOTE_TARGET_EMBED`), served at `https://www.zuugle.at/embed/`

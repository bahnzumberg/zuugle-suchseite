# Static Assets Architecture (`assets/`)

This directory is the single source of truth for all hand-maintained static assets in the Zuugle monorepo, shared across both the **Frontend** (`apps/frontend`) and the **Backend** (`apps/backend`).

> **Note on Deployment:** This documentation file (`README-ASSETS.md`) is tracked in Git for developers and GitHub navigation. It is automatically excluded during the frontend build and GitHub Actions deployment workflows, so it is never copied to the production servers or exposed publicly over HTTP.

---

## 1. Directory Structure Overview

```
assets/
├── .well-known/             # RFC metadata (.well-known/security.txt, etc.)
├── i18n/                    # Frontend translation JSON files (de.json, etc.)
├── llms.txt                 # LLM crawler summary
├── llms-full.txt            # LLM crawler detailed context
├── meta.json                # Environment and build metadata
├── robots.txt               # Search engine crawler directives
├── sitemap.xml              # Global sitemap index
├── site.webmanifest         # PWA web app manifest
├── web-app-manifest-192x192.png # PWA application icons (served at root)
├── web-app-manifest-512x512.png
├── favicon.ico              # Root domain favicons
├── favicon.svg
├── favicon-96x96.png
├── favicon.png
├── apple-touch-icon.png
├── opengraph.jpg            # Social media share preview image (OpenGraph / Twitter / WhatsApp)
└── public/                  # Static assets served under the /public/ URL prefix
    ├── favicon.ico          # Dedicated copy for CDN consumers (https://cdn.zuugle.at/favicon.ico)
    ├── fonts/               # Typography (Source Sans 3, Outfit, etc.)
    ├── headless-leaflet/    # Headless map rendering assets for backend Puppeteer
    ├── icons/               # Transit, weather, and partner SVG icons
    ├── img/                 # Logos, marketing visuals, illustrations
    └── range-image/         # Curated mountain range cover images (WebP)
```

---

## 2. Top-Level `assets/` vs `assets/public/`

The directory is split into two functional scopes:

### A. Top-Level `assets/` (Site Root)
Files placed directly in `assets/` are served at the **domain root** (`/`):
* **How Vite handles them:** Vite is configured with `publicDir: "../../assets"`. During `npm run build`, all top-level files are copied directly into the root of `apps/frontend/build/`.
* **Resulting URLs:**
  * `https://www.zuugle.at/robots.txt`
  * `https://www.zuugle.at/sitemap.xml`
  * `https://www.zuugle.at/site.webmanifest`
  * `https://www.zuugle.at/web-app-manifest-192x192.png`
  * `https://www.zuugle.at/web-app-manifest-512x512.png`
  * `https://www.zuugle.at/llms.txt`
  * `https://www.zuugle.at/.well-known/security.txt`
  * `https://www.zuugle.at/favicon.ico`
  * `https://www.zuugle.at/favicon.svg`
  * `https://www.zuugle.at/favicon-96x96.png`
  * `https://www.zuugle.at/apple-touch-icon.png`
  * `https://www.zuugle.at/opengraph.jpg` (and per-domain, e.g. `https://www.zuugle.ch/opengraph.jpg`)
* **Why Favicons, Manifest Icons & OpenGraph live here:** Standard web browsers, mobile operating systems (PWA installs), and social media link preview scrapers (WhatsApp, Facebook, Twitter, Telegram, Discord, iMessage) expect these files directly at the domain root or as simple static endpoints without executing client-side routing. Having them at the top level guarantees instant HTTP 200 responses without redirection or SPA fallback interference.

### B. `assets/public/` (Shared Media Assets)
Files inside `assets/public/` are served under the **/public/** URL prefix:
* **How Vite handles them:** Vite's `publicDir` copies `assets/public/` into `apps/frontend/build/public/`.
* **How Backend handles them:** Express mounts `assets/public/` under `/public` (mapped via `apps/backend/src/utils/assetPaths.ts` in dev, and copied into `apps/backend/build/public/` during `build:copy`).
* **Resulting URLs (direct):**
  * `https://www.zuugle.at/public/fonts/source-sans-3-400.woff2`
  * `https://www.zuugle.at/public/img/zuugle.svg`
  * `https://www.zuugle.at/public/icons/weather/sun.svg`
  * `https://www.zuugle.at/public/range-image/rax-schneeberg-gruppe.webp`
* **Referencing in Code:**
  * In React/TSX: Always use the `assetUrl()` helper (`apps/frontend/src/utils/assetUrl.ts`):
    ```tsx
    import { assetUrl } from "../utils/assetUrl";
    <img src={assetUrl("/img/zuugle.svg")} />
    ```
  * In CSS / HTML templates: Use the `__ASSET_BASE__` token:
    ```css
    src: url("__ASSET_BASE__/fonts/source-sans-3-400.woff2") format("woff2");
    ```

---

## 3. What is Reachable Under `https://cdn.zuugle.at`?

On **PROD**, static asset loading is accelerated via **BunnyCDN** (`https://cdn.zuugle.at`):
* In production builds, `VITE_ASSET_BASE_URL` is set to `https://cdn.zuugle.at`.
* BunnyCDN is configured with a Pull Zone whose origin is `https://www.zuugle.at/public/`.
* Therefore, requesting `https://cdn.zuugle.at/<path>` pulls `https://www.zuugle.at/public/<path>` from the origin server and caches it across global edge nodes.

### Reachable on `https://cdn.zuugle.at`:
1. **All static files from `assets/public/`:**
   * `https://cdn.zuugle.at/favicon.ico` (fallback for CDN favicon requests)
   * `https://cdn.zuugle.at/fonts/...` (web fonts)
   * `https://cdn.zuugle.at/img/...` (logos, illustrations)
   * `https://cdn.zuugle.at/icons/...` (transit and weather SVG icons)
   * `https://cdn.zuugle.at/range-image/...` (mountain range photos, with on-the-fly resizing via `?width=...&height=...`)
2. **All dynamic backend files written to `/public/`:**
   * `https://cdn.zuugle.at/gpx/...` (per-tour GPX tracks)
   * `https://cdn.zuugle.at/weather/...` (daily weather overlay WebP maps)

### NOT Reachable on `https://cdn.zuugle.at`:
* Site root assets (`/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `/favicon.ico`, and HTML pages) are **not** served from the CDN. They are served directly from the origin domain (`www.zuugle.at`, `dev.zuugle.at`) to preserve domain context, cookie isolation, and SEO integrity.

---

## 4. Why Only Static Files in `assets/`? Where Do Dynamic Files Go?

### Why Only Static Files Here:
`assets/` is version-controlled in Git. Everything stored here must be:
* Hand-maintained or curated by developers and designers.
* Immutable at runtime (deployed together with code releases).
* Shared consistently between frontend builds and backend server runs.

### Where Dynamic Files Go:
Dynamic contents are generated at runtime by background cron jobs, database synchronization scripts, or external APIs. They must **never** be committed to Git. Instead, they are generated into the **backend public directory**:
* Local workspace: `apps/backend/public/`
* On servers: `/root/suchseite/api/public/` (PROD/UAT) or `/root/suchseite/dev-api/public/` (DEV).

### Dynamic File Types & Their Web Addresses:

| Dynamic Content | Generated By | Server Location | Public Web URL |
|---|---|---|---|
| **Per-Country Sitemaps** (`sitemap_at.xml`, `sitemap_de.xml`, etc.) | Backend `jobs/sync.js` | `/root/suchseite/api/public/sitemap_*.xml` | `https://www.zuugle.at/sitemap_at.xml`<br>`https://dev.zuugle.at/sitemap_at.xml` |
| **GPX Track Files** | Backend sync jobs | `/root/suchseite/api/public/gpx/<hash>/<id>.gpx` | `https://www.zuugle.at/public/gpx/...`<br>`https://cdn.zuugle.at/gpx/...` (PROD) |
| **Weather Overlay Tiles** | Backend `jobs/generateWeatherOverlay.js` | `/root/suchseite/api/public/weather/` | `https://www.zuugle.at/public/weather/...`<br>`https://cdn.zuugle.at/weather/...` (PROD) |
| **Rendered GPX Elevation Images** | Backend Puppeteer / `gpx-image.js` | `/root/suchseite/api/public/gpx-image/` | `https://www.zuugle.at/public/gpx-image/...` |

### How Dynamic Sitemaps Are Resolved by Nginx:
Even though dynamic sitemaps are generated by the backend and stored in the backend's `public/` directory, search engines expect them at the domain root (e.g. `https://www.zuugle.at/sitemap_at.xml`).

Nginx intercepts root requests matching `^/(sitemap_[a-z][a-z]\.xml)$` and aliases them directly to the backend directory:
```nginx
location ~ ^/(sitemap_[a-z][a-z]\.xml)$ {
    alias /root/suchseite/api/public/$1;  # or dev-api on DEV
    default_type application/xml;
}
```
This cleanly decouples static frontend code from dynamic backend database exports while providing clean root URLs to search engines.

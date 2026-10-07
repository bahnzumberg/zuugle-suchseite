# Zuugle Suchseite (Frontend)

Vite+ React SPA. Part of the **zuugle-suchseite monorepo** — see the repo-root
[`README.md`](../../README.md) for the overall map.

## Paths and Query Parameters

### Paths

- `/`: [Start](src/views/StartNew.tsx) - Startseite
- `/:city`: [SearchResults](src/views/SearchResults.tsx) - Direct city view (e.g. `/wien`), renders search results for that city or redirects unknown slugs to `/search?search=<slug>`
- `/search`: [SearchResults](src/views/SearchResults.tsx) - Suchseite
- `/search/:searchTerm`: Redirects to `/search?search=<searchTerm>`
- `/tour/:idOne/:cityOne?`: [TourDetails](src/views/TourDetails.tsx) - Detailseite (city slug is optional)
- `/provider/:provider`: [TourDetails](src/views/TourDetails.tsx) - Provider-filtered tour view
- `/sync/:code`: Target for the QR code in the favorites sync dialog; opens the dialog on the search page
- `/privacy`: Redirects to `/search?legal=privacy` (Datenschutzerklärung)
- `/imprint`: Redirects to `/search?legal=imprint` (Impressum)

<!-- - `/about`: [About](src/views/About.tsx) TODO: About.tsx is currently not used -> Clean up or update. -->

### Query Parameters

| Parameter                        | Applicable to  | Description                                                                                                                                                                                                                                                                                            | Examples                                                                  |
| -------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `city`                           | `/`, `/search` | Sets the main city for the search. On `/:city` routes, the city is part of the path instead.                                                                                                                                                                                                           | `wien`, `innsbruck`                                                       |
| `search`                         | `/search`      | Search phrase to filter by.                                                                                                                                                                                                                                                                            | `Badesee`, `Dachstein`                                                    |
| `search_type`                    | `/search`      | Type when searching for specific entities.                                                                                                                                                                                                                                                             | `term`, `hut`, `peak`                                                     |
| `lat`, `lng`, optional: `radius` | `/search`      | WGS84 coordinates and radius in meters (default 100 m) to filter tours passing through that location.                                                                                                                                                                                                  | `lat=47.464881&lng=12.203235&radius=500`                                  |
| `map`                            | `/search`      | Shows the interactive map with tour markers above the list of tours.                                                                                                                                                                                                                                   | `true`                                                                    |
| `bounds`                         | `/search`      | Bounding box JSON to restrict tours to the visible map area. Updated when the user pans or zooms.                                                                                                                                                                                                      | `{"north":47.697747,"south":47.003670,"west":13.278350,"east":13.921051}` |
| `weather`                        | `/search`      | Enables the weather overlay on the map (applicable when `map=true`).                                                                                                                                                                                                                                   | `true`                                                                    |
| `lang`                           | `/`, `/search` | Language preference for the interface and tour prioritization.                                                                                                                                                                                                                                         | `de`, `en`, `fr`, `it`, `sl`                                              |
| `legal`                          | `/search`      | Opens the legal dialog/drawer directly.                                                                                                                                                                                                                                                                | `imprint`, `privacy`                                                      |
| `externalLinks`                  | `/search`      | When `true`, links directly to the original tour provider (e.g. bahn-zum-berg.at) rather than the internal detail view.                                                                                                                                                                                | `true`                                                                    |
| `p` / `providers`                | `/search`      | Filter by tour provider (pipe-separated array; `p` is an alias from URL navigation).                                                                                                                                                                                                                   | `bahnzumberg`, `bahnzumberg\|alpenvereinaktiv`                            |
| `range` / `ranges`               | `/search`      | Filter by mountain range (pipe-separated array; `range` is an alias from range card clicks).                                                                                                                                                                                                           | `Karwendel`, `Ötztaler Alpen`                                             |
| Scalar filters                   | `/search`      | Individual filter settings (see `src/utils/filterParams.ts`): `singleDayTour`, `multipleDayTour`, `summerSeason`, `winterSeason`, `traverse` (booleans), `minAscent`, `maxAscent`, `minDescent`, `maxDescent`, `minDistance`, `maxDistance`, `minTransportDuration`, `maxTransportDuration` (numbers). | `singleDayTour=true&maxAscent=1000`                                       |
| Array filters                    | `/search`      | Pipe-separated filter lists: `types`, `difficulties`, `countries`, `languages`.                                                                                                                                                                                                                        | `types=1\|2&difficulties=1\|2`                                            |

## First time installation

### Install Vite+

Install the `vp` CLI globally.

**macOS / Linux**

    curl -fsSL https://vite.plus | bash

**Windows**

    irm https://vite.plus/ps1 | iex

After installation, open a new shell and verify with `vp help`.

### Install dependencies

Execute in the project directory:

    vp install

## Run frontend with local backend

### Prepare API

Follow the backend setup steps described in [`../backend/README.md`](../backend/README.md).

### Execute frontend locally

    vp dev

This will run the frontend in a browser on http://localhost:3000

## Run frontend with remote backend

The repository provides pre-configured npm scripts in `package.json` for remote environments:

- **UAT** (proxies `/api` with Basic Auth credentials `bzb:bzb`):

  ```bash
  npm run dev:uat
  ```

- **Production** (connects directly to the live production API):

  ```bash
  npm run dev:main
  ```

- **Custom API endpoint:**

  ```bash
  VITE_API_URL=https://custom-host.at/api vp dev
  ```

## Environment variables

| Variable              | Default                     | Purpose                                                      |
| --------------------- | --------------------------- | ------------------------------------------------------------ |
| `VITE_API_URL`        | `http://localhost:8080/api` | Backend API base URL. Only used when running on `localhost`. |
| `VITE_ASSET_BASE_URL` | `/public`                   | Base URL for static assets (fonts, images, icons).           |

### `VITE_ASSET_BASE_URL`

Static assets live in the repo-root `assets/` folder — `assets/public/` for
the ones this variable prefixes (fonts, images, icons), the rest (`i18n/`,
`robots.txt`, …) at the top level, served at the site root instead. Never
hardcode an asset host — build the URL with the `assetUrl()` helper from
`src/utils/assetUrl.ts`:

```ts
import { assetUrl } from "../utils/assetUrl";

<img src={assetUrl("/img/zuugle.svg")} />;
```

In HTML and CSS, where `import.meta.env` cannot reach, write the literal token
`__ASSET_BASE__` instead — the `zuugle:asset-base-url` plugin expands it in the
`index-*.html` entry points and in `src/App.css`:

```css
src: url("__ASSET_BASE__/fonts/source-sans-3-400.woff2") format("woff2");
```

Only **PROD** sets the variable, to `https://cdn.zuugle.at` — a BunnyCDN pull
zone whose origin is prod, so `cdn.zuugle.at/img/x.svg` and
`www.zuugle.at/public/img/x.svg` serve the same file. The value comes from the
`asset_base_url` input of `.github/workflows/_deploy.yml`, which each
`deploy2*.yml` sets for its environment. That build also gets a
`preconnect`/`dns-prefetch` hint for the CDN, injected by the same plugin;
a relative base is the site's own origin and needs none.

`vite.config.ts` applies the `/public` default **once**, before handing the
value to the app (via the `__ASSET_BASE__` define), the HTML and the CSS. Do not
re-apply it per call site: the font preload in `index.html` and the `@font-face`
in `App.css` have to resolve to the byte-identical URL or the preload is wasted.

Two exceptions stay absolute on every environment. `og:image`/`twitter:image`
must be absolute for social crawlers, so they use the file's own canonical host
(`https://www.zuugle.de/public/img/…` in `index-de.html`). `assets/site.webmanifest`
is copied verbatim by Vite and never transformed, so its icons are site-relative
`/public/…`.

UAT, DEV and local builds leave it unset and fall back to the relative
`/public` prefix, which nginx serves from that environment's own API folder.
That way no environment loads its assets from production, and asset changes can
be reviewed on DEV before they are released.

In dev there is no nginx, so `vite.config.ts` covers the prefix itself:
`publicDir: "../../assets"` serves `assets/public/` directly, no plugin
needed. A `zuugle:backend-generated-assets` plugin covers what isn't there —
the backend's still-local, gitignored trees (`gpx/`, `gpx-image/`,
`sitemap_*.xml`) — in every dev mode, without a running backend or database;
edit an asset there and reload. Anything missing on disk falls back to the
environment the API data comes from (UAT for `dev:uat`, PROD for `dev:main`,
nothing for plain `vp dev`).

### Assets that come from the API

The API returns its own assets host-free too — `/gpx/56/61256.gpx`,
`/range-image/dachstein.webp` — so the same base applies to them.
`features/apiSlice.ts` is the one place that resolves them, with
`publicAssetUrl()` for the GPX links (always ours) and `apiImageUrl()` for
`image_url`, which leaves the absolute provider URLs
(`cdn.bahn-zum-berg.at`) alone. Components receive ready-to-use URLs; do not
re-point them again per render.

## Common issues

- `Error: ENOSPC: System limit for number of file watchers reached`
  Fix (Linux):

```bash
echo "fs.inotify.max_user_watches=131070" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Contributing

We use [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for formatting, [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) for linting, and TypeScript's `tsc` for type checking. All three run together via `vp check`, and in our GitHub pipeline on every push.
Pre-commit hooks run automatically after `vp install`.

Before you push any changes to `dev`, `uat`, or `main` please go through the following checklist:

1. Test your code
2. `vp fmt .` formats all files
3. `vp lint --fix` fixes all auto-fixable lint issues ➡️ manually fix remaining issues
4. `vp check` verifies formatting, linting, and types ➡️ fix remaining issues manually
5. check your commits and messages:
   - one logical change per commit
   - changes that belong together are committed together
   - high-level description of changes/intention in the commit message
   - reference related issues on GitHub if they exist

Tip for Step 5: Interactive rebasing with git is a good way to clean up messy histories. E.g. `git rebase -i HEAD~5`

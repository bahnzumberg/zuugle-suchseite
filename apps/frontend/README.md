# Zuugle Suchseite

## Paths and Query Parameters

### Paths

- `/`: [Start](src/views/Start) - Startseite
- `/search`: [Search](src/views/Search.tsx) - Suchseite
- `/tour/:id/:city`: [TourDetail](src/views/TourDetail.tsx) - Detailseite
- `/privacy`: [Privacy](src/views/Privacy.tsx) - Datenschutzerkl&auml;rung
- `/imprint`: [Imprint](src/views/Imprint.tsx) - Impressum
<!-- - `/about`: [About](src/views/Pages/About.tsx) TODO: About.tsx is currently not used -> Clean up or update. -->

### Query Parameters

| Parameter                        | Applicable to  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                            | Examples                                                                                                     |
| -------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `city`                           | `/`, `/search` | Sets the main city for the search.                                                                                                                                                                                                                                                                                                                                                                                                                     | `wien`, `innsbruck`                                                                                          |
| `p`                              | `/`, `/search` | If set, will only show tours from that provider.                                                                                                                                                                                                                                                                                                                                                                                                       | `bahnzumberg`, `alpenvereinaktiv`                                                                            |
| `lang`                           | `/`, `/search` | Set language of the page. Tours written in that language are displayed before tours in other languages.                                                                                                                                                                                                                                                                                                                                                | `en`, `fr`, `de`, `it`, `sl`                                                                                 |
| `filter`                         | `/search`      | JSON representation of the filter object. Reflects the currently active filter settings, which can be changed via the dialog on the search page.                                                                                                                                                                                                                                                                                                       |
| `search`                         | `/search`      | Search phrase to filter by. This is usually triggered when one types something into the search field on the start page or search page.                                                                                                                                                                                                                                                                                                                 | `Badesee`                                                                                                    |
| `geolocation`                    | `/search`      | Usually triggered by clicking on a marker on the map. Zuugle will display only tours that pass through the provided location within a certain radius. A visual indicator is visible on the map, which can also be used to interactively change the radius. Moreover, the geolocation is visible and editable in the filter dialog. Coordinates are in WGS84 and the radius is given in meters. If no radius is provided, a default of $100 m$ is used. | `{"lat":47.46488122914572, "lng":12.203235626220705, "radius":500}`                                          |
| `lat`, `lng`, optional: `radius` | `/search`      | Alternative way of passing location for `geolocation`. See `geolocation` query parameter.                                                                                                                                                                                                                                                                                                                                                              | `lat=47.46488122914572&lng=12.203235626220705&radius=500`                                                    |
| `map`                            | `/search`      | Will show a map with tour markers above the list of tours.                                                                                                                                                                                                                                                                                                                                                                                             | `true`                                                                                                       |
| `bounds`                         | `/search`      | Will adjust the map to the provided bounds and only shows tours which start within those bounds. The bounds are updated when a user moves the map (dragging it or zooming in/out).                                                                                                                                                                                                                                                                     | `{"north":47.697747261516, "south":47.00367043276572, "west":13.278350830078125, "east":13.921051025390627}` |
| `range`                          | `/search`      | This is usually triggered when users click on one of the range cards visible on the start page.                                                                                                                                                                                                                                                                                                                                                        | `Karwendel`, `Ötztaler Alpen`                                                                                |

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

Follow the steps described at https://github.com/bahnzumberg/zuugle-api#zuugleat-api

### Execute frontend locally

    vp dev

This will run the frontend in a browser on http://localhost:3000

## Run frontend with remote backend

    VITE_API_URL=https://www2.zuugle.at/api vp dev

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

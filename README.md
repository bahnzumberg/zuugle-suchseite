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

- `?city={city}`: Applicable to `/` and `/search`. Sets the main city for the search.
- `?p={provider}`: Applicable to `/` and `/search`. If set, will only show tours from that provider.
- `?lang={lang}`: Applicable to `/` and `/search`. Available options are `en`, `fr`, `de`, `it`, `sl`.
- `filter={filter}`: Applicable to `/search`. This is a JSON representation of the filter object. Reflects the currently active filter settings, which can be changed via the dialog on the search page.
- `search={search-phrase}`: Applicable to `/search`. Search phrase to filter by. This is usually triggered when one types something into the search field on the start page or search page.
- `geolocation`: Applicable to `/search`.
  Usually triggered by clicking on a marker on the map. Zuugle will display only tours that pass through the provided location within a certain radius. A visual indicator is visible on the map, which can also be used to interactively change the radius. Moreover, the geolocation is visible and editable in the filter dialog.
  Example: `geolocation={"lat":47.376208024131124,"lng":12.260742187500002,"radius":500}`. Coordinates are in WGS84 and the radius is given in meters. If no radius is provided, a default of $100 m$ is used.
- `map=true`: Applicable to `/search`. Will show a map with tour markers above the list of tours.
- `bounds`: Applicable to `/search`. Will adjust the map to the provided bounds and only shows tours which start within those bounds. The bounds are updated when a user moves the map (dragging it or zooming in/out). Example: `bounds={"north":47.697747261516,"south":47.00367043276572,"west":13.278350830078125,"east":13.921051025390627}`
- `range={mountain-range}`: Applicable to `/search`. This is usually triggered when users click on one of the range cards visible on the start page.
<!-- Our goal is to actually combine this with the range setting provided by the filter query parameter. -->
- `country={country}`: Applicable to `/search`. If set, will only show tours from that country. This has to correspond exactly to the way the country name is written in the database. Examples: `country=Schweiz`, `country=Österreich`, `country=Italia`.
<!-- TODO: Find out if this is currently used and improve. For end users it's not feasible to have to guess how to write the country name. Maybe integrate into filter dialog? -->

## First time installation

### Install Volta

Volta makes it really easy to always have the correct node engine (similar to nvm but faster and even simpler).

Follow the installation directions: https://docs.volta.sh/guide/getting-started

### Install all modules

Execute in the project directory:

    npm install

and install all dependencies.

## Run frontend with local backend

### Prepare API

Follow the steps described at https://github.com/bahnzumberg/zuugle-api#zuugleat-api

### Execute frontend locally

    npm run start

This will run the frontend in a browser on http://localhost:3000

## Run frontend with remote backend

    npm run start-remote-api

## Common issues

- `Error: ENOSPC: System limit for number of file watchers reached`
  Fix (Linux):

```bash
echo "fs.inotify.max_user_watches=131070" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Contributing

We use [Prettier](https://prettier.io/) to ensure consistent formatting across all files (things like newlines, and quotation marks).
We use [ESLint](https://eslint.org/) to avoid common issues and also ensure consistent style in JavaScript/TypeScript code.
We use [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to check for type errors in TypeScript code.

All three tools are run in our GitHub pipeline on every push. If one of them finds an issue, the pipeline fails.
Prettier and ESLint are also run as pre-commit hooks, to catch problems as soon as possible.
The pre-commit hooks get activated automatically once you call `npm install`.

Before you push any changes to `uat` or `main` please go through the following checklist:

1. Test your code
2. `npm run format` applies prettier to all files
3. `npm run lint:fix` applies ESLint checks and fixes all issues that can be automatically fixed ➡️ manually fix remaining issues
4. `npm run tsc` checks for type errors ➡️ fix them manually
5. check your commits and messages:
   - one logical change per commit
   - changes that belong together are committed together
   - high-level description of changes/intention in the commit message
   - reference related issues on GitHub if they exist

Tip for Step 5: Interactive rebasing with git is a good way to clean up messy histories. E.g. `git rebase -i HEAD~5`

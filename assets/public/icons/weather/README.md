# Weather icons

The 18 weather-condition icons used by the "Wanderwetter" strip on the tour cards.

- **Source:** [Meteocons](https://github.com/basmilius/meteocons) by Bas Milius
- **Package:** `@meteocons/svg-static@0.1.0`, style `fill`
- **Licence:** MIT — see `LICENSE` in this folder

Only the 18 files the weather import can reference are vendored, not the full set. The mapping from
the `tour_weather_icon` id (1..18) that the `/tours` endpoint returns to the filename lives in
`apps/frontend/src/models/tourWeather.ts`.

To refresh them:

```bash
npm pack @meteocons/svg-static@0.1.0
tar xzf meteocons-svg-static-0.1.0.tgz
# copy the files named in WEATHER_ICONS from package/fill/ into this folder
```

Do **not** move these into `assets/public/weather/` — `deploy/nginx/prod/snippets/zuugle.conf`
caps that path at a 6 hour TTL for the daily overlay images, which would needlessly expire these
immutable files every six hours.

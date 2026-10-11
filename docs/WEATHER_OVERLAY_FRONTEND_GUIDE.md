# Zuugle Wetter-Overlay im Frontend

Dieses Dokument beschreibt, wie das Wetter-Overlay im Zuugle-Frontend (`apps/frontend/`) eingebunden ist: welche Daten das Backend liefert und welche Komponenten sie darstellen.

---

## 1. Übersicht & Funktionsweise

Das Backend stellt unter `/public/weather/` (bzw. via `assetUrl()`) die vorberechneten WebP-Overlays und eine Metadaten-Datei bereit:
* **Metadaten:** `assetUrl("/weather/weather_metadata.json")`
* **Overlays:** `assetUrl("/weather/weather_overlay_YYYY-MM-DD.webp")`

### Kernanforderungen
1. **Volle Zoom-Unterstützung:** Das Overlay wird auf allen Zoomstufen über der Basiskarte angezeigt.
2. **Tag-Auswahl:** Schnellauswahl der Tage ("Heute", "Morgen", Datum mit Wochentagskürzel).
3. **Z-Index:** Das Overlay liegt über der Basiskarte (OpenTopoMap/OSM), aber **unter** den GPX-Tracks und Touren-Pins (`zIndex: 250`).

---

## 2. Metadaten-Format (`weather_metadata.json`)

`bounds` stammt aus `GRID_CONFIG` (`apps/backend/src/utils/weatherOverlayService.ts`) und ist die maßgebliche Quelle — die Werte unten sind nur ein Beispielstand.

```json
{
  "version": "1.0",
  "generated_at": "2026-09-26T03:19:20.267Z",
  "bounds": [
    [42.55, 4.35],
    [49.35, 17.35]
  ],
  "days": [
    { "date": "2026-09-14", "file": "weather_overlay_2026-09-14.webp" },
    { "date": "2026-09-15", "file": "weather_overlay_2026-09-15.webp" },
    { "date": "2026-09-16", "file": "weather_overlay_2026-09-16.webp" },
    { "date": "2026-09-17", "file": "weather_overlay_2026-09-17.webp" }
  ],
  "legend": [
    { "score": 0, "color": "#3b0f70", "label": "Gefährlich" },
    { "score": 50, "color": "#f07d1a", "label": "Mäßig" },
    { "score": 100, "color": "#2f9e44", "label": "Ausgezeichnet" }
  ]
}
```

Die Tages-Labels ("Heute", "Morgen", "Mi, 16.09.") werden im Frontend aus `date` berechnet, nicht vom Backend geliefert.

---

## 3. TypeScript Interfaces

In `apps/frontend/src/models/weatherOverlay.ts`:

```typescript
export interface WeatherDay {
  date: string;       // "2026-09-14"
  file: string;       // "weather_overlay_2026-09-14.webp"
}

export interface WeatherMetadata {
  version: string;
  generated_at: string;
  bounds: [[number, number], [number, number]];
  days: WeatherDay[];
  legend: WeatherLegendItem[];
}
```

Dort liegt außerdem `filterPastDays()`, das beim Laden alle Tage vor "heute" (Zeitzone Europe/Vienna) aus den Metadaten entfernt.

---

## 4. Umsetzung im Frontend

Das Overlay ist umgesetzt; die Bausteine liegen in
`apps/frontend/src/components/Map/WeatherControls.tsx`:

| Export | Aufgabe |
| --- | --- |
| `WeatherButtonAndDays` | "Wanderwetter"-Button oben links, darunter die Tagesauswahl |
| `WeatherLegend` | (i)-Button oben rechts mit Legenden-Popup und Stand-Zeitstempel |
| `WeatherPane` | legt das Leaflet-Pane `weatherPane` (z-index 250) an |
| `WeatherClassWatcher` | setzt `weather-active-map` auf den Kartencontainer (Basiskarte in Graustufen) |
| `formatWeatherDayLabel` | "Heute" / "Morgen" / "Mi, 16.09." aus dem Datum |

Eingebunden sind sie in beiden Karten:

* `apps/frontend/src/components/Map/TourMapContainer.tsx` (Suchergebnis-Karte)
* `apps/frontend/src/components/InteractiveMap.tsx` (Detailseiten-Karte)

Beide laden die Metadaten per `fetchAsset()` und rendern das aktive Overlay als:

```tsx
<ImageOverlay
  key={activeOverlayUrl}
  url={activeOverlayUrl}
  bounds={weatherMetadata.bounds}
  opacity={0.65}
  pane="weatherPane"
/>
```

Auf der Suchergebnis-Karte aktiviert der URL-Parameter `?weather=true` das Overlay
automatisch, sobald die Metadaten geladen sind.

---

## 5. Verifikation im Browser

1. **Overlays erzeugen und Backend starten:**
   ```bash
   cd apps/backend
   npm run generate-weather-overlay
   npm start
   ```
2. **Frontend starten:**
   ```bash
   cd apps/frontend
   npm run dev
   ```
3. **Funktionstests:**
   * Klick auf "Wanderwetter" → Overlay erscheint, Basiskarte wird grau, Tagesauswahl klappt auf.
   * Wechsel zwischen den Tagen → Overlay tauscht sich aus.
   * Hinein- und Herauszoomen → Overlay bleibt auf allen Zoomstufen sichtbar.
   * Klick auf (i) → Legende mit Farbverlauf und "Stand:"-Zeitstempel.
   * Erneuter Klick auf "Wanderwetter" → Overlay und Tagesauswahl verschwinden.

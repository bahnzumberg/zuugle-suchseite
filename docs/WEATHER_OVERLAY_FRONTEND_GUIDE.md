# Frontend-Integrationsanleitung: Zuugle Wetter-Overlay

Dieses Dokument beschreibt Schritt für Schritt die Einbindung des Wetter-Overlays in das Zuugle-Frontend (`apps/frontend/`).

---

## 1. Übersicht & Funktionsweise

Das Backend stellt unter `/public/weather/` (bzw. via `assetUrl()`) die vorberechneten WebP-Overlays und eine Metadaten-Datei bereit:
* **Metadaten:** [`assetUrl("/weather/weather_metadata.json")`](file:///home/martin/develop/zuugle-suchseite/apps/backend/public/weather/weather_metadata.json)
* **Overlays:** `assetUrl("/weather/weather_overlay_YYYY-MM-DD.webp")`

### Kernanforderungen
1. **Volle Zoom-Unterstützung:** Das Overlay wird auf allen Zoomstufen über der Basiskarte angezeigt.
2. **Tag-Auswahl:** Schnellauswahl der Tage ("Heute", "Morgen", Datum mit Wochentagskürzel).
3. **Z-Index:** Das Overlay liegt über der Basiskarte (OpenTopoMap/OSM), aber **unter** den GPX-Tracks und Touren-Pins (`zIndex: 250`).

---

## 2. Metadaten-Format (`weather_metadata.json`)

```json
{
  "version": "1.0",
  "generated_at": "2026-09-26T03:19:20.267Z",
  "bounds": [
    [42.85, 4.75],
    [50.15, 17.25]
  ],
  "days": [
    {
      "date": "2026-09-14",
      "weekday": "Mo",
      "label": "Heute (Mo)",
      "file": "weather_overlay_2026-09-14.webp"
    },
    {
      "date": "2026-09-15",
      "weekday": "Di",
      "label": "Morgen (Di)",
      "file": "weather_overlay_2026-09-15.webp"
    },
    {
      "date": "2026-09-16",
      "weekday": "Mi",
      "label": "Mi, 16.09.",
      "file": "weather_overlay_2026-09-16.webp"
    },
    {
      "date": "2026-09-17",
      "weekday": "Do",
      "label": "Do, 17.09.",
      "file": "weather_overlay_2026-09-17.webp"
    }
  ],
  "legend": [
    { "score": 0, "color": "#3b0f70", "label": "Gefährlich" },
    { "score": 50, "color": "#f07d1a", "label": "Mäßig" },
    { "score": 100, "color": "#2f9e44", "label": "Ausgezeichnet" }
  ]
}
```

---

## 3. TypeScript Interfaces

In `apps/frontend/src/models/weatherOverlay.ts`:

```typescript
export interface WeatherDay {
  date: string;       // "2026-09-14"
  weekday: string;    // "Mo"
  label: string;      // "Heute (Mo)"
  file: string;       // "weather_overlay_2026-09-14.webp"
}

export interface WeatherMetadata {
  version: string;
  generated_at: string;
  bounds: [[number, number], [number, number]];
  minZoom: number;
  maxZoom: number;
  days: WeatherDay[];
  legend: { score: number; color: string; label: string }[];
}
```

---

## 4. Einbindung in `TourMapContainer.tsx`

Die primäre Kartenkomponente ist:  
[`apps/frontend/src/components/Map/TourMapContainer.tsx`](file:///home/martin/develop/zuugle-suchseite/apps/frontend/src/components/Map/TourMapContainer.tsx)

### 4.1 Imports
```tsx
import { ImageOverlay, useMapEvents } from "react-leaflet";
import { assetUrl } from "../../utils/assetUrl";
import { WeatherMetadata, WeatherDay } from "../../models/weatherOverlay";
```

### 4.2 Zoom-Überwachung (Innerhalb `MapContainer`)
Erstelle einen kleinen Helper für die Zoom-Level-Überwachung:

```tsx
function MapZoomWatcher({ onZoomChange }: { onZoomChange: (zoom: number) => void }) {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
}
```

### 4.3 State & Metadaten-Laden
```tsx
const [weatherMetadata, setWeatherMetadata] = useState<WeatherMetadata | null>(null);
const [selectedWeatherDate, setSelectedWeatherDate] = useState<string | null>(null);
const [currentZoom, setCurrentZoom] = useState<number>(8); // Initialer Zoom

useEffect(() => {
  fetch(assetUrl("/weather/weather_metadata.json"))
    .then((res) => {
      if (!res.ok) throw new Error("Metadata not found");
      return res.json();
    })
    .then((data: WeatherMetadata) => setWeatherMetadata(data))
    .catch((err) => console.debug("No weather overlay available:", err));
}, []);

// URL des aktiven Overlays ermitteln:
const activeWeatherFile = weatherMetadata?.days.find(
  (d) => d.date === selectedWeatherDate
)?.file;

const activeOverlayUrl = activeWeatherFile
  ? assetUrl(`/weather/${activeWeatherFile}`)
  : null;
```

### 4.4 ImageOverlay rendern (Innerhalb von `MapContainer`)
```tsx
{/* Zoom-Watcher */}
<MapZoomWatcher onZoomChange={setCurrentZoom} />

{/* Wetter-Overlay: Nur anzeigen wenn gewählt und Zoom <= 12 */}
{selectedWeatherDate && activeOverlayUrl && weatherMetadata && currentZoom <= 12 && (
  <ImageOverlay
    url={activeOverlayUrl}
    bounds={weatherMetadata.bounds}
    opacity={0.55} // Sanfte Deckkraft, Basiskarte schimmert durch
    zIndex={250}   // Über der Basiskarte, unter den Tour-Pins (300+) und GPX-Tracks
  />
)}
```

---

## 5. UI-Komponente: Tag-Umschalter (`WeatherOverlayControl.tsx`)

Erstelle eine neue Komponente:  
`apps/frontend/src/components/Map/WeatherOverlayControl.tsx`

```tsx
import React from "react";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { WeatherMetadata } from "../../models/weatherOverlay";

interface WeatherOverlayControlProps {
  metadata: WeatherMetadata | null;
  selectedDate: string | null;
  currentZoom: number;
  onSelectDate: (date: string | null) => void;
}

export const WeatherOverlayControl: React.FC<WeatherOverlayControlProps> = ({
  metadata,
  selectedDate,
  currentZoom,
  onSelectDate,
}) => {
  if (!metadata || metadata.days.length === 0) {
    return null;
  }

  const isZoomedOut = currentZoom <= 12;

  // Zeitstempel der Erstellung in CET/CEST (Europe/Vienna) formatieren
  const formattedGeneratedAt = metadata?.generated_at
    ? new Date(metadata.generated_at).toLocaleString("de-AT", {
        timeZone: "Europe/Vienna",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        right: 56, // Neben den Standard-Leaflet-Controls
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(6px)",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        padding: "4px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <WbSunnyRoundedIcon sx={{ fontSize: 16, color: "orange" }} />
        <ButtonGroup size="small" variant="outlined">
          <Button
            variant={selectedDate === null ? "contained" : "outlined"}
            onClick={() => onSelectDate(null)}
            sx={{ textTransform: "none", fontSize: "0.75rem", py: 0.3, px: 0.8 }}
          >
            Aus
          </Button>
          {metadata.days.map((day) => (
            <Button
              key={day.date}
              variant={selectedDate === day.date ? "contained" : "outlined"}
              onClick={() => onSelectDate(day.date)}
              sx={{ textTransform: "none", fontSize: "0.75rem", py: 0.3, px: 0.8 }}
            >
              {day.weekday}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Aktualitäts-Hinweis in CET/CEST wenn ein Tag ausgewählt ist */}
      {selectedDate !== null && formattedGeneratedAt && (
        <Typography
          variant="caption"
          sx={{ fontSize: "0.65rem", color: "text.secondary", opacity: 0.85 }}
        >
          Stand: {formattedGeneratedAt} Uhr
        </Typography>
      )}

      {/* Hinweis wenn aktiv, aber Zoom zu tief (Nahansicht) */}
      {selectedDate !== null && !isZoomedOut && (
        <Typography
          variant="caption"
          sx={{ fontSize: "0.68rem", color: "text.secondary", fontWeight: 500 }}
        >
          Wetter nur bis Zoom 12 sichtbar
        </Typography>
      )}
    </Box>
  );
};
```

---

## 6. Verifikation & Testing im Browser

1. **Backend-Server starten:**
   ```bash
   cd apps/backend
   npm run generate-weather-overlay
   npm start
   ```
2. **Frontend starten:**
   ```bash
   cd apps/frontend
   npm start
   ```
3. **Funktionstests:**
   * Klick auf `[Mo]` $\rightarrow$ Farbverlauf legt sich passgenau über die Alpen.
   * Hineinzoomen auf Zoom $\ge 13$ $\rightarrow$ Overlay blendet weich aus, Text *(„Wetter nur bis Zoom 12 sichtbar“)* erscheint.
   * Herauszoomen auf Zoom $\le 12$ $\rightarrow$ Overlay erscheint wieder.
   * Klick auf `[Aus]` $\rightarrow$ Overlay verschwindet vollständig.

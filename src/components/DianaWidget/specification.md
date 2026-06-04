# Diana GreenConnect — Vollständige technische Spezifikation

> Dieses Dokument beschreibt alle Funktionalitäten, Logiken, Abläufe, API-Interaktionen und Datenstrukturen der Diana GreenConnect Komponente. Es dient als vollständige Vorlage zur Reimplementierung in einem anderen React-Projekt.

---

## 1. Überblick

Diana GreenConnect ist ein **Fahrplan-Suchsystem für Öffi-Wanderungen**. Der Benutzer wählt auf einer Karte eine Start- und Zielhaltestelle, gibt Datum und geplante Gehzeit ein, und erhält passende Hin- und Rückverbindungen mit öffentlichen Verkehrsmitteln.

### Hauptfunktionen

- Verbindungssuche (Hin- und Rückfahrt) über die Diana API
- Verbindungsslots wählen und visuell vergleichen
- Zeitkonflikte erkennen und anzeigen
- Ticketkauf-Links generieren
- Verbindung per Share-Link teilen
- ICS-Kalender-Export (Hinfahrt + Wanderung + Rückfahrt)
- Adress-Autocomplete für den Abfahrtsort
- "Gemeinsame Anreise" (Share-Optimize) mit einem Freund
- Nachladen früherer/späterer Verbindungen (Scroll)
- Bedarfsverkehr (Flex) Toggle

---

## 2. Architektur

```
React App
├── page.tsx (SSR) ─── holt initialen OAuth2-Token server-seitig
├── ClientApp.tsx ──── setzt Token, rendert Karte + Panel
├── DianaPanel.tsx ─── Hauptcontainer, State-Management
│   ├── DianaForm.tsx ──── Formular (Abfahrtsort, Datum, Dauer, Suche)
│   │   └── DianaAutocomplete.tsx ── Adress-Autocomplete
│   ├── DianaResults.tsx ── Ergebnisanzeige (Slots, Legs, Wanderung)
│   ├── DianaActionButtons.tsx ── Ticket/Teilen/Kalender Buttons
│   └── TicketModal.tsx ── Ticket-Links Modal
├── hooks/
│   ├── useConnectionSearch.ts ── API-Suche + Retry + Scroll
│   └── useShareLink.ts ── Share-Links erstellen/wiederherstellen
└── lib/
    ├── dianaApi.ts ── API-Client mit OAuth2 Auto-Refresh
    ├── oauth2.ts ── Server-seitiger Token-Fetch
    ├── fetchWithRetry.ts ── Generischer Retry-Wrapper
    ├── calendarExport.ts ── ICS-Kalender-Export
    └── dateUtils.ts ── Datums-/Zeitformatierung
```

---

## 3. Umgebungsvariablen

| Variable                    | Kontext | Beschreibung                                                                |
| --------------------------- | ------- | --------------------------------------------------------------------------- |
| `DIANA_CLIENT_ID`           | Server  | OAuth2 Client-ID                                                            |
| `DIANA_CLIENT_SECRET`       | Server  | OAuth2 Client-Secret                                                        |
| `DIANA_TOKEN_URL`           | Server  | OAuth2 Token-Endpoint (Default: `https://api.zuugle-services.net/o/token/`) |
| `NEXT_PUBLIC_DIANA_API_URL` | Client  | Diana API Base-URL (Default: `https://api.zuugle-services.net`)             |

---

## 4. OAuth2 Authentifizierung

### 4.1 Initialer Token (Server-seitig, SSR)

Beim Laden der Seite wird server-seitig ein OAuth2-Token per `client_credentials` Grant geholt und als Prop an die Client-Komponente übergeben.

```
POST {DIANA_TOKEN_URL}
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
client_id={DIANA_CLIENT_ID}
client_secret={DIANA_CLIENT_SECRET}
```

**Response:** `{ access_token: string, expires_in: number }`

Der Token wird server-seitig gecacht (in-memory, mit 60s Safety-Margin vor Ablauf).

### 4.2 Token-Refresh (Client-seitig)

Wenn ein API-Call 401 zurückgibt, wird automatisch ein Token-Refresh ausgelöst:

1. Client ruft `POST /api/token` (eigene API-Route)
2. API-Route holt neuen Token server-seitig (Secret bleibt am Server)
3. Rate-Limit: 5 Requests/Minute pro IP
4. Bei erneutem 401: bis zu 3 Retry-Versuche mit steigender Wartezeit

### 4.3 API-Client (dianaFetch)

Wrapper um `fetch()`:

- Setzt `Authorization: Bearer {token}` Header
- Bei 401: automatischer Token-Refresh + Retry
- Bei 5xx: Throw → triggert `fetchWithRetry`
- `fetchWithRetry`: bis zu 3 Versuche, 1s Delay, bricht bei `_noRetry: true` ab

---

## 5. Datentypen

### 5.1 DianaStop

```typescript
interface DianaStop {
  lat: number;
  lon: number;
  name: string;
}
```

### 5.2 ConnectionElement

Ein einzelner Abschnitt einer Verbindung (Zugfahrt, Fußweg, Umstieg).

```typescript
interface ConnectionElement {
  type: "JNY" | "WALK" | "TRSF"; // Journey, Walk, Transfer
  departure_time: string; // ISO 8601 UTC
  arrival_time: string; // ISO 8601 UTC
  vehicle_type?: number; // 1=Zug, 2=Bus, 3=Tram, 4=U-Bahn, etc.
  vehicle_name?: string; // z.B. "RJX 62"
  from_location?: string; // Haltestellenname
  to_location?: string;
  from_location_coordinates?: { lat: number; lon: number };
  to_location_coordinates?: { lat: number; lon: number };
  platform_orig?: string; // Abfahrtsgleis
  platform_dest?: string; // Ankunftsgleis
  duration?: number; // Dauer in Minuten
  direction?: string; // Fahrtziel des Zuges
  n_intermediate_stops?: number; // Anzahl Zwischenhalte (exkl. Endstation)
  alerts?: Array<{ header_text?: string; description_text?: string }>;
}
```

**vehicle_type Mapping:**
| Code | Typ |
|---|---|
| 1 | Zug |
| 2 | Bus |
| 3 | Straßenbahn |
| 4 | U-Bahn |
| 5 | Einschienenbahn |
| 6 | Zahnradbahn |
| 7 | Standseilbahn |
| 8 | Seilbahn |
| 9 | Fähre |
| 10 | Taxi |

### 5.3 Connection

Eine vollständige Verbindung (Hin- oder Rückfahrt).

```typescript
interface Connection {
  connection_elements: ConnectionElement[];
  connection_start_timestamp: string; // ISO 8601 UTC
  connection_end_timestamp: string; // ISO 8601 UTC
  connection_transfers?: number; // Anzahl Umstiege
}
```

### 5.4 SearchResults

Die vollständige API-Antwort.

```typescript
interface SearchResults {
  connections: {
    to_activity: Connection[]; // Hinfahrten
    from_activity: Connection[]; // Rückfahrten
    recommended_to_activity_connection?: number; // Empfohlener Index
    recommended_from_activity_connection?: number;
    has_more_before_to_activity?: boolean | null; // Frühere verfügbar?
    has_more_after_to_activity?: boolean | null; // Spätere verfügbar?
    has_more_before_from_activity?: boolean | null;
    has_more_after_from_activity?: boolean | null;
  };
  activity?: {
    name?: string;
    start_location?: string; // "lat,lon"
    end_location?: string;
    start_location_display_name?: string;
    end_location_display_name?: string;
    duration_minutes?: number;
    duration_days?: number; // > 1 bei Mehrtagestouren
  };
  live?: boolean; // Echtzeitdaten verfügbar?
}
```

---

## 6. API-Endpunkte

### 6.1 Verbindungssuche

```
GET {DIANA_API}/connections?{params}
Authorization: Bearer {token}
```

**Pflicht-Parameter:**

| Parameter                              | Beschreibung                             |
| -------------------------------------- | ---------------------------------------- |
| `date`                                 | Reisedatum (YYYY-MM-DD)                  |
| `activity_name`                        | Name der Aktivität (z.B. "Wanderung")    |
| `activity_start_location`              | Start-Koordinaten "lat,lon"              |
| `activity_start_location_type`         | `"coordinates"`                          |
| `activity_end_location`                | Ziel-Koordinaten "lat,lon"               |
| `activity_end_location_type`           | `"coordinates"`                          |
| `timezone`                             | `"Europe/Vienna"`                        |
| `activity_earliest_start_time`         | Frühester Aufbruch (HH:MM:SS UTC)        |
| `activity_latest_start_time`           | Spätester Aufbruch (HH:MM:SS UTC)        |
| `activity_earliest_end_time`           | Früheste Rückkehr (HH:MM:SS UTC)         |
| `activity_latest_end_time`             | Späteste Rückkehr (HH:MM:SS UTC)         |
| `activity_duration_minutes`            | Geplante Gehzeit in Minuten              |
| `user_start_location`                  | Abfahrtsort (Koordinaten oder Adresse)   |
| `user_start_location_type`             | `"coordinates"` oder `"address"`         |
| `user_start_location_display_name`     | Anzeigename des Abfahrtsortes            |
| `activity_start_location_display_name` | Anzeigename der Start-Haltestelle        |
| `activity_end_location_display_name`   | Anzeigename der Ziel-Haltestelle         |
| `use_flex`                             | `"true"` oder `"false"` (Bedarfsverkehr) |

**Optionale Parameter:**

| Parameter                | Beschreibung                    |
| ------------------------ | ------------------------------- |
| `activity_duration_days` | Anzahl Tage bei Mehrtagestouren |

**Scroll-Parameter** (zum Nachladen früherer/späterer Verbindungen):

| Parameter                 | Beschreibung                            |
| ------------------------- | --------------------------------------- |
| `to_connections_before`   | Hinfahrten VOR diesem Timestamp laden   |
| `to_connections_after`    | Hinfahrten NACH diesem Timestamp laden  |
| `from_connections_before` | Rückfahrten VOR diesem Timestamp laden  |
| `from_connections_after`  | Rückfahrten NACH diesem Timestamp laden |

### 6.2 Zeitfenster-Logik

Die Zeitfenster werden aus der Konfiguration berechnet und in UTC konvertiert:

- **Normaler Fall:**
  - `earliest_start_time`: Config-Wert (z.B. 08:00 Lokal → UTC)
  - `latest_start_time`: Config-Wert (z.B. 14:00 Lokal → UTC)
  - `earliest_end_time`: Config-Wert (z.B. 12:00 Lokal → UTC)
  - `latest_end_time`: Config-Wert (z.B. 20:00 Lokal → UTC)

- **Heute & nach latest_start_uhrzeit:**
  - `latest_start_time`: 23:59 UTC
  - `earliest_end_time`: jetzt UTC
  - `latest_end_time`: 23:59 UTC

- **Mehrtagestouren** (dateFrom ≠ dateTo):
  - `activity_duration_days` wird gesetzt
  - `activity_duration_minutes` wird auf 600 fixiert
  - Duration-Eingabe wird ausgeblendet

### 6.3 Adress-Autocomplete

```
GET {DIANA_API}/address-autocomplete?q={query}&lang=de&limit=10&hint_lat={lat}&hint_lon={lon}
Authorization: Bearer {token}
```

**Response:**

```typescript
{
  features: Array<{
    geometry: { coordinates: [lon, lat] };
    diana_properties: {
      display_name: string;
      location_type?: string; // "station" oder "address"
      type_hint?: number;
    };
  }>;
}
```

- Debounced: 300ms nach letztem Tastendruck
- Minimum 2 Zeichen
- Ergebnisse werden auf eine konfigurierbare Bounding-Box gefiltert (nur Vorschläge innerhalb des definierten Bereichs)
- Maximal 5 Vorschläge angezeigt

### 6.4 Share-Link erstellen

```
POST {DIANA_API}/share/
Authorization: Bearer {token}
Content-Type: application/json

{
  origin: string,
  origin_display_name: string,
  origin_lat: string | null,
  origin_lon: string | null,
  date: string,
  dateEnd: string | null,
  duration: string | null,
  alpenvereinaktiv_tour_id: string | null,
  to_connection_start_time: string | null,
  to_connection_end_time: string | null,
  from_connection_start_time: string | null,
  from_connection_end_time: string | null,
  activity: Activity | null,
  shareURLPrefix: string
}
```

**Response:** `{ shareId: string }`

Der Share-Link wird als URL-Parameter `?diana-share={shareId}` angehängt.

### 6.5 Share-Link abrufen

```
GET {DIANA_API}/share/{shareId}
Authorization: Bearer {token}
```

**Response:** Das gespeicherte ShareData-Objekt.

### 6.6 Ticket-Links generieren

```
POST {DIANA_API}/generate-ticketshop-link
Authorization: Bearer {token}
Content-Type: application/json

{ connection_elements: ConnectionElement[] }
```

**Response:**

```typescript
{
  ticketshop_links?: Array<{
    leg_from: number;
    leg_to: number;
    provider: string | null;
    url: string | null;
  }>;
  ticketshop_url?: string;   // Fallback-URL
}
```

---

## 7. Fehlerbehandlung (API Error-Codes)

Die API gibt strukturierte Fehler mit `code`-Feld zurück. Die Behandlung:

| Code                             | Bedeutung                          | Verhalten                              |
| -------------------------------- | ---------------------------------- | -------------------------------------- |
| `6001`, `6002`                   | Kontingent erschöpft               | Keine Retry, Hinweis auf www.anachb.at |
| `2027`                           | Keine Haltestelle in der Nähe      | Keine Retry                            |
| `2022-1`                         | Keine Verbindungen heute (zu spät) | Keine Retry                            |
| `2017`-`2024` (mit Suffix `-1`)  | Keine Hinfahrt gefunden            | Keine Retry, mit Datum/Ort-Details     |
| `2017`-`2024` (mit Suffix `-2`)  | Keine Rückfahrt gefunden           | Keine Retry, mit Datum/Ort-Details     |
| `2017`-`2024` (ohne Suffix)      | Generell keine Verbindung          | Keine Retry                            |
| `2002`                           | Ort nicht gefunden                 | Keine Retry                            |
| `2003`                           | Suchdienst nicht erreichbar        | Retry                                  |
| `2025-1`, `2025-2`               | Berechnungsfehler                  | Retry                                  |
| `3001`-`3004`                    | Fahrplandienst nicht erreichbar    | Retry                                  |
| HTTP 400 + `user_start_location` | Ungültiger Abfahrtsort             | Keine Retry                            |

**Retry-Strategie:**

- Maximal 3 Versuche
- 1,5 Sekunden Wartezeit zwischen Versuchen
- Fehler mit `_noRetry: true` werden nicht wiederholt
- UI zeigt "Verbindungen werden gesucht 1/3, 2/3, 3/3"

---

## 8. UI-Komponenten & Verhalten

### 8.1 DianaPanel (Hauptcontainer)

**State:**

- `selectedToIdx` / `selectedFromIdx` — ausgewählte Hin-/Rückfahrt-Indizes
- `dateFrom` / `dateTo` — Reisedatum (Default: morgen)
- `durationValue` — Gehzeit-Eingabe als String
- `useFlex` — Bedarfsverkehr ein/aus
- `ticketOpen` / `debugOpen` — Modal-States
- `isShareRestore` — Flag ob aus Share-Link geladen wurde

**Ablauf bei Suche:**

1. Validierung: Start + Ziel gesetzt? Origin gültig? Duration ausgefüllt (bei Eintagestour)?
2. Wenn Origin-Text ohne Autocomplete-Auswahl → Reset auf Default-Origin
3. API-Call über `useConnectionSearch.search()`
4. Bei Erfolg: `selectedToIdx` / `selectedFromIdx` auf empfohlene Werte setzen
5. Start/Ende-Haltestellen aus API-Response aktualisieren (API kann korrigierte Namen zurückgeben)

### 8.2 DianaForm

**Felder:**

- **Abfahrt von:** Text-Input mit Autocomplete (Default: konfigurierter Bahnhof)
- **Von / Bis:** Datum-Inputs (min: heute, max: letzter Fahrplantag)
- **Dauer:** Frei-Text (akzeptiert: "3", "2.5", "2:30", "1h 30min", "90min")
- **Bedarfsverkehr:** Toggle (optional, konfigurierbar ob angezeigt)
- **Suche-Button:** Deaktiviert wenn Origin out-of-bounds oder Start/Ziel fehlt

**Duration-Parsing** (flexibles Format):

```
"3"        → 3.0 Stunden
"2.5"      → 2.5 Stunden
"2,5"      → 2.5 Stunden (Komma → Punkt)
"2:30"     → 2.5 Stunden
"2:30h"    → 2.5 Stunden
"1h 30min" → 1.5 Stunden
"90min"    → 1.5 Stunden
```

**Verhalten:**

- Bei Von > Bis: Bis wird automatisch auf Von gesetzt
- Datums-Felder werden on blur auf [heute, letzter_tag_im_fahrplan] geclampt
- Bei Mehrtages-Tour (Von ≠ Bis): Duration-Feld wird ausgeblendet
- Enter-Taste in jedem Feld löst Suche aus
- Privacy-Hinweis erscheint wenn Origin ≠ Default-Name
- Duration-Feld wird optisch hervorgehoben (orange border + glow) wenn leer bei Suche

### 8.3 DianaResults

Besteht aus drei Sektionen:

#### Hinfahrt-Sektion

- **Titel:** "Hinfahrt DD.MM.YYYY" + optional 🟢 Echtzeit-Badge
- **Connection-Slots:** Horizontale scrollbare Karten mit Start-End-Zeit, Dauer, Umstiegszahl
- **Connection-Detail:** Vertikal aufgebaut mit Legs (Abschnitte):
  - Jeder Leg zeigt: Uhrzeit, Haltestellenname, Fahrzeug-Typ/Name, Gleis, Richtung, Dauer, Halte-Anzahl
  - Icons: Zug, Bus, Tram, U-Bahn, Seilbahn, Taxi, Fußweg, Umstieg
  - Alerts werden als gelbe Warnboxen angezeigt
  - Letzte Zeile: Ankunftszeit + Ziel-Haltestellenname
- **Scroll-Buttons:** ◀ (früher) und ▶ (später) — immer sichtbar wenn `has_more_before/after` true

#### Wanderung-Sektion

- Hintergrund: grüner Rahmen
- Zeigt: Geplante Gehzeit, Verfügbare Gehzeit (Von–Bis mit Dauer)
- **Wenn Dauer negativ** (Rückfahrt vor Ankunft): roter Text "Terminkonflikt: Entweder frühere Hinfahrt oder spätere Rückfahrt wählen!"
- **Wenn Dauer < geplante Dauer** (aber positiv): orangener Text "Achtung: Für die Wanderung stehen nur X h Y min zwischen Ankunft und Abfahrt zur Verfügung!"
- Bei Mehrtagestour: Start-/Enddatum und -zeiten statt Gehzeit

#### Rückfahrt-Sektion

- Gleicher Aufbau wie Hinfahrt, aber **Slots unter dem Detail** (statt darüber)

#### Slot-Greying (Zeitkonflikte)

- **Hinfahrt-Slots:** Alle Slots, deren Ankunftszeit (`connection_end_timestamp`) **nach** der Abfahrtszeit der gewählten Rückfahrt liegt, werden visuell ausgegraut (opacity: 0.35)
- **Rückfahrt-Slots:** Alle Slots, deren Abfahrtszeit (`connection_start_timestamp`) **vor** der Ankunftszeit der gewählten Hinfahrt liegt, werden visuell ausgegraut
- Ausgegraute Slots bleiben **klickbar** — sie sind nicht deaktiviert
- Hover auf ausgegrauten Slots erhöht die Opacity leicht (0.6)

### 8.4 DianaActionButtons

Drei Buttons in einer Reihe:

1. **Ticket** → Öffnet TicketModal
2. **Teilen** → Erstellt Share-Link, kopiert in Zwischenablage oder öffnet System-Share-Dialog
3. **Kalender** → Exportiert .ics Datei

**Disabled-Zustand:** Alle drei Buttons werden deaktiviert (opacity 0.4, cursor not-allowed) wenn ein Zeitkonflikt vorliegt (Rückfahrt-Abfahrt < Hinfahrt-Ankunft).

**Share-URL-Caching:** Die Share-URL wird gecacht und nur bei Änderung der Verbindungsauswahl neu generiert. Der Kalender-Export nutzt die gecachte URL.

### 8.5 TicketModal

- Wird beim Öffnen geladen (2 parallele API-Calls: Hinfahrt + Rückfahrt)
- Zeigt pro Richtung: Provider-Buttons mit Ticket-Links
- Fallback bei Fehler: Link zu ÖBB Tickets
- Hinweis zu Westbahn (Haltestellen können nicht vorausgefüllt werden)
- Schließen: Escape-Taste, Klick außerhalb, ×-Button, Schließen-Button

---

## 9. Scroll-Logik (Frühere/Spätere Verbindungen)

### Nachladen

- ◀ Button: Sendet `to_connections_before` / `from_connections_before` mit dem Timestamp der ersten Verbindung
- ▶ Button: Sendet `to_connections_after` / `from_connections_after` mit dem Timestamp der letzten Verbindung
- Neue Verbindungen werden in die bestehende Liste eingefügt (prepend/append)

### Merge-Logik

- Bei Prepend (neue frühere): `selectedIdx` wird um die Anzahl neuer Verbindungen erhöht (damit die aktive Auswahl stabil bleibt)
- `has_more_before/after` Flags werden aus der Scroll-Antwort aktualisiert

### Rendering

- Die Scroll-Buttons sind **immer** im DOM wenn `has_more_before`/`has_more_after` true ist
- Sie befinden sich **innerhalb** des horizontalen Scroll-Containers an den Rändern
- Kein JavaScript-basiertes Scroll-Position-Tracking nötig

---

## 10. Share-Link System

### Erstellen

1. User klickt "Teilen"
2. Payload wird an `POST /share/` gesendet (inkl. Origin, Datum, Dauer, gewählte Verbindungen, Activity)
3. API gibt `shareId` zurück
4. URL wird zusammengesetzt: `{origin}?diana-share={shareId}`
5. URL wird in Zwischenablage kopiert oder System-Share-Dialog geöffnet
6. "✔ Link kopiert" wird 2,5s angezeigt

### Wiederherstellen

1. Beim Laden der Seite: URL wird auf `diana-share` Parameter geprüft
2. `GET /share/{shareId}` wird aufgerufen
3. Aus der Antwort werden wiederhergestellt:
   - Start-/Zielhaltestellen (aus activity.start_location/end_location)
   - Formularwerte (Origin, Datum, Dauer)
   - Pending-Selection (welche Verbindung war ausgewählt)
4. Panel wird geöffnet, Suche wird automatisch nach 500ms ausgelöst
5. Nach Erhalt der Ergebnisse: gespeicherte Verbindungsauswahl wird angewendet
6. ScrollAnchor scrollt die Ergebnisse ins Sichtfeld

---

## 11. Kalender-Export (ICS)

Generiert eine `.ics`-Datei mit 3-4 Events:

1. **Hinfahrt**: Abfahrt → Ankunft, mit allen Legs als Beschreibung + Share-URL
2. **Wanderung**: Ankunft Hin → Abfahrt Rück, mit Tour-Name und optionalem Alpenvereinaktiv-Link
3. **Rückfahrt**: Abfahrt → Ankunft, mit allen Legs + Liste aller Rückfahrmöglichkeiten
4. **Alternative Rückfahrten** (optional): Bis zu 2 Alternativen, maximal gespreizt

**Deterministische UIDs:** `{shareId}-hinfahrt@greenconnect`, `{shareId}-wanderung@greenconnect`, etc. — verhindert Duplikate bei erneutem Import.

**Dateiname:** `Wanderung-DD-MM-YYYY.ics`

**Fix für ical-generator:** Escape-Sequenzen (`\n`, `\;`, `\\`) die über eine 75-Byte Fold-Grenze gesplittet werden, werden repariert.

**Dependency:** `ical-generator` npm-Paket

---

## 12. Gemeinsame Anreise (Share-Optimize)

Erweiterte Funktion: Ein Freund teilt seine Verbindung, und der zweite Benutzer sucht Verbindungen, die sich mit denen des ersten überschneiden.

### Ablauf

1. Benutzer A teilt seinen Link
2. Benutzer B öffnet den Link → sieht "Optimize"-Modus
3. Benutzer B kann eigenen Abfahrtsort eingeben
4. Suche berücksichtigt Ankunftszeit von A (±30 min Fenster)
5. Ergebnisse zeigen gemeinsame Legs (gleicher Zug, gleiche Abfahrtszeit) mit speziellem Badge "🤝 Gemeinsame Reise"
6. Treffpunkt wird automatisch ermittelt und angezeigt

### Shared-Leg-Analyse

Algorithmus vergleicht die Legs zweier Verbindungen rückwärts (bei Hinfahrt) bzw. vorwärts (bei Rückfahrt):

- JNY-Legs matchen wenn: gleicher `vehicle_name` UND gleiche `arrival_time` (Hin) / `departure_time` (Rück)
- WALK/TRSF-Legs matchen wenn: gleiche `from_location`
- Erster gemeinsamer Leg = Treffpunkt

---

## 13. Konfiguration

Die gesamte Konfiguration liegt in einer `appConfig.ts`. Hier die für Diana relevanten Abschnitte:

```typescript
const APP_CONFIG = {
  diana: {
    abfahrt_von_name: "Wien Hauptbahnhof", // Default-Abfahrtsort
    abfahrt_von_lat: 48.185318,
    abfahrt_von_lon: 16.376555,
    bounds: {
      // Bounding-Box für Autocomplete-Filter
      minLat: 48.005,
      maxLat: 48.35,
      minLon: 15.88,
      maxLon: 16.63,
    },
    letzter_tag_im_fahrplan: "2026-12-13", // Max-Datum für Datumsfelder
    show_flex_toggle: true, // Bedarfsverkehr-Toggle anzeigen?
    button_ok: "Verbindungen suchen",
    button_nok: "Abfahrtsort zu weit entfernt",
    // Zeitfenster für die Suche:
    earliest_start_h: 8,
    earliest_start_m: 0, // 08:00
    latest_start_h: 14,
    latest_start_m: 0, // 14:00
    earliest_end_h: 12,
    earliest_end_m: 0, // 12:00
    latest_end_h: 20,
    latest_end_m: 0, // 20:00
  },
};
```

---

## 14. Datums-Utilities

### Funktionen

| Funktion                        | Input                | Output           | Beschreibung                                |
| ------------------------------- | -------------------- | ---------------- | ------------------------------------------- |
| `localTimeToUtc(dateStr, h, m)` | `"2026-05-29", 8, 0` | `{ h: 6, m: 0 }` | Lokale Uhrzeit → UTC                        |
| `fmtUtcTime(utc)`               | `{ h: 6, m: 0 }`     | `"06:00:00"`     | UTC-Objekt → String                         |
| `toLocalTime(isoStr)`           | ISO-String           | `"14:00"`        | ISO → Lokale Uhrzeit (Europe/Vienna)        |
| `toLocalDate(isoStr)`           | ISO-String           | `"29.05.2026"`   | ISO → Lokales Datum                         |
| `fmtMin(m)`                     | `90`                 | `"1 h 30 min"`   | Minuten → lesbare Dauer                     |
| `formatDuration(min)`           | `144`                | `"2 h 24 min"`   | Minuten → Dauer-String                      |
| `parseDuration(val)`            | `"2:30"`             | `2.5`            | Frei-Text → Stunden                         |
| `cleanStopName(name)`           | `"Wien Hbf  "`       | `"Wien Hbf"`     | Trailing-Whitespace/Sonderzeichen entfernen |
| `getTodayISO()`                 | —                    | `"2026-05-28"`   | Heutiges Datum als YYYY-MM-DD               |
| `getTomorrowISO()`              | —                    | `"2026-05-29"`   | Morgiges Datum als YYYY-MM-DD               |

---

## 15. Verbindungsanzeige (Leg-Rendering)

Jeder ConnectionElement wird als "Leg" gerendert mit:

### Leg-Typen

**JNY (Journey — Fahrt):**

- Icon: basierend auf `vehicle_type` (Zug/Bus/Tram/U-Bahn/Seilbahn/Taxi)
- Anzeige: Fahrzeug-Typ + Name (z.B. "Zug RJX 62")
- Optional: Richtung ("→ München Hbf"), Abfahrt-/Ankunftsgleis
- Optional: Dauer + Halte-Anzahl ("29 min, 2 Halte")
- Bei Gemeinsamer Anreise: "🤝 Gemeinsame Reise" Badge
- Bei Alerts: Warnbox mit ⚠ Text

**WALK (Fußweg):**

- Icon: Fußweg-Symbol
- Anzeige: "Fußweg (9 min)"

**TRSF (Umstieg/Transfer):**

- Icon: Umstieg-Symbol
- Anzeige: "Umstieg (2 min)"

### Timeline-Darstellung

- Linke Spalte: Uhrzeit (lokale Zeit)
- Rechte Spalte: Haltestellenname + Details
- Vertikale Linie mit grünen Punkten verbindet die Legs
- Letzte Zeile: Ankunftspunkt (weißer Punkt mit grünem Rand)
- Hover über Leg: MapMarker auf der Karte anzeigen (via Callback)

---

## 16. Connection-Slot-Darstellung

Jeder Slot zeigt:

- **Zeitspanne:** "12:28 - 14:00"
- **Info-Zeile:** "1:32 h 2 ⇄" (Dauer + Umstiegszahl)

### States

- **Normal:** Dunkler Hintergrund, dezente Farben
- **Active:** Grüner Border, heller Text
- **Conflict:** Opacity 0.35, auf Hover 0.6
- **Active + Conflict:** Grüner Border, aber gedimmt

---

## 17. Wanderung-Sektion Logik

```
diffMin = (Rückfahrt_Abfahrt - Hinfahrt_Ankunft) / 60000

if (diffMin < 0):
  → "Terminkonflikt: Entweder frühere Hinfahrt oder spätere Rückfahrt wählen!"
  → Buttons deaktiviert
  → Slot-Greying aktiv

else if (geplanteDauer > 0 && diffMin < geplanteDauer):
  → "Achtung: Für die Wanderung stehen nur {duration} zwischen Ankunft und Abfahrt zur Verfügung!"

else:
  → Normale Anzeige mit verfügbarer Gehzeit
```

**Hinweis:** Die Uhrzeiten "Von HH:MM bis HH:MM" werden immer angezeigt, egal ob Konflikt oder nicht. Nur der Warntext ändert sich.

---

## 18. Wichtige UX-Details

1. **Auto-Scroll bei Share-Restore:** Nach Laden eines Share-Links scrollt die Ergebnissektion automatisch zur "Hinfahrt"-Überschrift
2. **Slot-Scroll:** Die aktive Verbindung scrollt automatisch ins Sichtfeld (`scrollIntoView`)
3. **Enter-Suche:** Enter in jedem Formularfeld löst die Suche aus
4. **Shared URL Cache:** Der Kalender-Button nutzt die gecachte Share-URL statt eine neue zu generieren
5. **Origin-Reset:** Wenn der User Freitext eintippt ohne Autocomplete-Vorschlag zu wählen, wird beim Suchen auf den Default-Abfahrtsort zurückgesetzt
6. **Debug-Modus:** `?debug=1` in der URL zeigt einen Debug-Button, der die rohe API-Antwort in einem JSON-Tree anzeigt
7. **Echtzeit-Badge:** Wenn `results.live === true`, wird "🟢 Echtzeit" neben dem Hinfahrt-Titel angezeigt

---

## 19. Zusammenfassung der Dateien

| Datei                    | Funktion                                     |
| ------------------------ | -------------------------------------------- |
| `dianaApi.ts`            | API-Client mit OAuth2 + Auto-Refresh         |
| `oauth2.ts`              | Server-seitiger Token-Fetch (SSR)            |
| `fetchWithRetry.ts`      | Generischer Retry-Wrapper                    |
| `dateUtils.ts`           | Datums-/Zeitformatierung + Duration-Parsing  |
| `calendarExport.ts`      | ICS-Kalender-Generierung                     |
| `useConnectionSearch.ts` | Hook: Verbindungssuche + Scroll              |
| `useShareLink.ts`        | Hook: Share-Links erstellen/wiederherstellen |
| `DianaPanel.tsx`         | Hauptcontainer, State-Management             |
| `DianaForm.tsx`          | Suchformular                                 |
| `DianaAutocomplete.tsx`  | Adress-Autocomplete                          |
| `DianaResults.tsx`       | Ergebnisanzeige (Slots + Legs + Wanderung)   |
| `DianaActionButtons.tsx` | Ticket/Teilen/Kalender Buttons               |
| `TicketModal.tsx`        | Ticket-Links Modal                           |
| `api/token/route.ts`     | OAuth2 Token-Refresh API-Route               |

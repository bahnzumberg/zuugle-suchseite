# LLM Output Schema — Structured Search Query

This document defines the exact JSON format that the LLM must produce
when parsing a natural-language tour search query for Zuugle.

The fields are a subset of what `getMatchingTourIds` accepts
(see [tours_getMatchingTourIds.md](./tours_getMatchingTourIds.md)).

---

## JSON Schema

```json
{
  "clarification": null,
  "language": "de",
  "search": "Schneeberg",
  "search_type": "term",
  "city_slug": "wien",
  "city_country": "AT",
  "geolocation": { "lat": 48.2082, "lng": 16.3738, "radius": 5000 },
  "filter": {
    "singleDayTour": true,
    "multipleDayTour": false,
    "summerSeason": true,
    "winterSeason": false,
    "traverse": false,
    "minAscent": 0,
    "maxAscent": 800,
    "minDescent": 0,
    "maxDescent": 800,
    "minDistance": 0,
    "maxDistance": 20,
    "minTransportDuration": 0,
    "maxTransportDuration": 2,
    "types": ["Wanderung"],
    "difficulties": [1],
    "ranges": ["Wienerwald"],
    "languages": ["de"],
    "providers": ["bergfexat"]
  }
}
```

---

## Field Reference

### Top-Level Fields

| Field | Type | Required | Valid Values | Description |
|-------|------|----------|-------------|-------------|
| `language` | string | ✅ | `"de"`, `"en"`, `"fr"`, `"it"`, `"sl"` | Detected language of the user's query. Default `"de"` if uncertain. |
| `search` | string \| null | ❌ | Free text | Keyword to full-text search for (tour name, mountain, region). `null` if the query is purely filter-based. |
| `search_type` | string | ❌ | `"term"` (default), `"hut"`, `"peak"` | `"term"` = full-text search. `"hut"` = search for tours to a named hut. `"peak"` = search for tours to a named peak. **Warning:** `"hut"` and `"peak"` require an exact match on `pois.name` in the DB. |
| `city_slug` | string \| null | ⚠️ | Must be from the known cities list (90+ values). E.g. `"wien"`, `"muenchen"`, `"zuerich"`, `"grenoble"` | **Central field.** Departure city slug. The LLM must always try to identify this. If not identifiable, set `clarification`. |
| `city_country` | string \| null | ⚠️ | `"AT"`, `"CH"`, `"DE"`, `"FR"`, `"IT"`, `"LI"`, `"SI"` | Country code. Auto-derived from `city_slug` during validation. If user only names a country, set this without `city_slug`. **Minimum required for search.** Domain = `www.zuugle.{city_country.toLowerCase()}` |
| `geolocation` | object \| null | ❌ | `{ "lat": number, "lng": number, "radius": number }` | Proximity search. Set when user says "in meiner Nähe" / "near me". `radius` in meters (default 5000). **Note:** the LLM cannot know the user's GPS coordinates — it should set `geolocation: true` as a signal, and the frontend/route must inject the actual coordinates. |
| `clarification` | string \| null | ❌ | Free text question | A follow-up question, especially when the departure city/country is unknown. Also for ambiguous queries. The LLM should still extract whatever it can. |

### `filter` Object

All filter fields are optional. Only include fields the user explicitly or implicitly mentions.

#### Boolean Filters

| Field | Type | Default Behavior | Description |
|-------|------|-----------------|-------------|
| `singleDayTour` | boolean | If only this is `true` → day trips only | User wants single-day tours. |
| `multipleDayTour` | boolean | If only this is `true` → multi-day only | User wants multi-day tours. |
| `summerSeason` | boolean | If only this is `true` → summer tours only | User wants summer tours. |
| `winterSeason` | boolean | If only this is `true` → winter tours only | User wants winter tours. |
| `traverse` | boolean | — | User wants traverse/crossing tours (Überschreitung). DB stores as `0`/`1`, but boolean `true`/`false` is accepted. |

> **Toggle logic:** If `singleDayTour=true` is set alone, `multipleDayTour` is treated as `false` (and vice versa). Same for `summerSeason`/`winterSeason`. If neither is set → no filtering (show all).

#### Numeric Filters

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `minAscent` | number | meters | Minimum total ascent. |
| `maxAscent` | number | meters | Maximum total ascent. E.g. "wenig Höhenmeter" → ~600. |
| `minDescent` | number | meters | Minimum total descent. |
| `maxDescent` | number | meters | Maximum total descent. |
| `minDistance` | number | km | Minimum tour distance. |
| `maxDistance` | number | km | Maximum tour distance. |
| `minTransportDuration` | number | hours (decimal) | Minimum public transport duration. E.g. `1.5` = 1h 30min. |
| `maxTransportDuration` | number | hours (decimal) | Maximum public transport duration. |

#### Array Filters

| Field | Type | Valid Values | Description |
|-------|------|-------------|-------------|
| `types` | string[] | `"Wandern"`, `"Schneeschuh"`, `"Skitour"`, `"Langlaufen"`, `"Bike & Hike"`, `"Klettern"`, `"Klettersteig"`, `"Rodeln"`, `"Weitwandern"`, `"Trailrunning"`, `"Hochtour"` | Tour types to filter by. |
| `difficulties` | number[] | `1` (easy/leicht), `2` (medium/mittel), `3` (hard/schwer) | Difficulty levels to filter by. |
| `ranges` | string[] | Range names from DB (170+ values). Examples: `"Rax-Schneeberg-Gruppe"`, `"Wienerwald"`, `"Dolomiti / Dolomiten"`, `"Karwendel"`, `"Berchtesgadener Alpen"`, `"Ötztaler Alpen"`, `"Stubaier Alpen"`, `"Zillertaler Alpen"`, `"Silvretta"`, `"Berner Alpen"`, `"Julijske Alpe"`, `"Karavanke / Karawanken"` | Mountain ranges to filter by. Must match exact DB spelling. |
| `languages` | string[] | `"de"`, `"en"`, `"fr"`, `"it"`, `"sl"` | Tour text language (DB column `text_lang`). E.g. user says "deutschsprachige Touren". |
| `providers` | string[] | Provider identifiers, e.g. `"bergfexat"`, `"tourenportalat"` | Tour data providers. Only set if user explicitly mentions a source. |

---

## Rules for the LLM

1. **Only set fields the user mentions.** Omit all others (do not set to `null`).
2. `language` is always required — detect from the query text.

### Conversational Rules

When previous search context is provided:
- **Merge** the new input with the previous context.
- Only **override** fields the user explicitly changes.
- **Keep** all unchanged fields from the previous context.
- If the user says "doch eher X", "stattdessen Y", "nicht X", update accordingly.

### Clarification Rules

- Set `clarification` when the query is too vague to produce useful results (e.g. "was kurzes", "irgendwas leichtes").
- Still extract whatever you can — `clarification` is in **addition** to the parsed fields, not instead of.
- Ask in the same language as the user's query.
3. `search_type` should be `"term"` in most cases. Only use `"hut"` or `"peak"` when the user explicitly asks for tours to a specific named hut or summit.
4. `types` must only contain values from the valid list above.
5. `difficulties` must be numbers (1/2/3), not strings.
6. Transport duration is in **hours** (decimal), not minutes.
7. For `geolocation`: The LLM cannot know GPS coordinates. Set `"geolocation": true` as a flag when the user mentions proximity ("in meiner Nähe"). The backend will resolve this with actual coordinates from the frontend.
8. `providers` — only set if user explicitly names a data source. Most users won't.
9. Respond with **only** the JSON object — no markdown fences, no explanation.

---

## Examples

**Input:** `"leichte Wanderung unter 800 Höhenmeter"`
```json
{
  "language": "de",
  "search_type": "term",
  "filter": {
    "types": ["Wanderung"],
    "difficulties": [1],
    "maxAscent": 800
  }
}
```

**Input:** `"I want to hike to Schneeberg tomorrow"`
```json
{
  "language": "en",
  "search": "Schneeberg",
  "search_type": "term",
  "filter": {
    "types": ["Wanderung"]
  }
}
```

**Input:** `"Skitour von Wien aus, max 2h Anfahrt"`
```json
{
  "language": "de",
  "city": "wien",
  "filter": {
    "types": ["Skitour"],
    "winterSeason": true,
    "maxTransportDuration": 2
  }
}
```

**Input:** `"mehrtägige Weitwanderung mittlerer Schwierigkeit"`
```json
{
  "language": "de",
  "filter": {
    "types": ["Weitwanderung"],
    "multipleDayTour": true,
    "difficulties": [2]
  }
}
```

# TypeScript & Babel Konfiguration

Dieses Dokument erklärt die TypeScript-Konfiguration im Projekt und warum wir JSDoc-Typen anstelle von `.ts`-Dateien verwenden.

## Übersicht

Das Projekt verwendet **Babel** für:

- **Entwicklung**: `babel-node` führt Code direkt aus (`npm run start`)
- **Produktion**: Babel kompiliert nach `build/` (`npm run build`)

## Das Problem mit gemischten .js/.ts Dateien

### Warum es nicht funktioniert hat

Wenn JavaScript-Dateien TypeScript-Dateien importieren, gibt es ein Problem:

```javascript
// In src/utils/gpx/gpxUtils.js:
import { getHost } from "../utils"; // ← Node.js sucht nach "utils.js"
```

Wenn die Datei aber `utils.ts` heißt:

- **Babel** kann sie kompilieren ✓
- **Node.js** findet sie nicht ✗ (sucht nur nach `.js`)

### Import-Extension Regel

TypeScript erwartet, dass Imports die **Output-Extension** (`.js`) verwenden, nicht die Source-Extension (`.ts`):

```typescript
// Korrekt für TypeScript → kompiliert zu .js
import { getHost } from "../utils.js"; // ← .js Extension!

// Falsch - funktioniert nicht zur Laufzeit
import { getHost } from "../utils"; // ← Keine Extension
import { getHost } from "../utils.ts"; // ← .ts Extension
```

## Unsere Lösung: JavaScript + JSDoc

Wir verwenden **reines JavaScript mit JSDoc-Typen** anstelle von TypeScript-Dateien.

### Vorher (TypeScript)

```typescript
// src/utils/utils.ts
export function getHost(origin: string): string {
    return `https://${origin}`;
}
```

### Nachher (JavaScript + JSDoc)

```javascript
// src/utils/utils.js
/**
 * @param {string} origin
 * @returns {string}
 */
export function getHost(origin) {
    return `https://${origin}`;
}
```

### Vorteile

| Feature                         | TypeScript (.ts)       | JavaScript + JSDoc |
| ------------------------------- | ---------------------- | ------------------ |
| Typen in IDE                    | ✅                     | ✅                 |
| Type-Checking via `npm run tsc` | ✅                     | ✅                 |
| Funktioniert mit Babel          | ⚠️ Konfiguration nötig | ✅ Sofort          |
| Gemischt mit .js Dateien        | ⚠️ Import-Probleme     | ✅ Kein Problem    |

## Wann echte TypeScript-Dateien verwenden?

Wenn das gesamte Projekt auf TypeScript umgestellt wird:

1. **Alle** Source-Dateien müssen `.ts` sein
2. Alle Imports müssen `.js` Extension verwenden:
    ```typescript
    import { foo } from "./bar.js"; // Nicht ./bar oder ./bar.ts
    ```
3. `tsconfig.json` muss entsprechend konfiguriert sein

## Aktuelle Konfiguration

### babel.config.js

```javascript
module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript", // Für .ts Dateien
    ],
};
```

### package.json (Build)

```json
"build": "babel src -d build --extensions .js,.ts && ..."
```

### Type-Checking

```bash
npm run tsc   # Prüft Typen ohne zu kompilieren
```

## Empfehlung

Für dieses Projekt empfehlen wir:

- **Neue Utility-Funktionen**: JavaScript + JSDoc
- **Bestehende .js Dateien**: Typen als JSDoc hinzufügen
- **Komplexe neue Features**: Können als `.ts` geschrieben werden, aber nur wenn sie keine bestehenden `.js` Dateien importieren müssen

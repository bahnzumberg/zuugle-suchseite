# AGENTS.md für zuugle-api

Dieses Dokument dient als "System-Prompt-Erweiterung" für KI-Coding-Assistenten (Copilot, Cursor, etc.). Es definiert den Kontext und die strikten Workflow-Regeln für dieses Repository.

## 📍 Projektübersicht

**Name:** zuugle-api
**Beschreibung:** Node.js Backend-API für die "Bahn zum Berg" (Zuugle) Plattform. Verwaltet Touren-Daten, GPX-Files und Bilder.
**Repository:** https://github.com/bahnzumberg/zuugle-api
**Frontend:** https://github.com/bahnzumberg/zuugle-suchseite

## 🚦 Entwicklungs-Workflow (CRITICAL)

Dieses Projekt folgt einem strikten **UAT-First** Workflow.

1.  **Main Branch:** `uat` ist der Hauptentwicklungszweig.
2.  **Verbot:** **NIEMALS** direkt auf `main` oder `master` committen oder pushen.
3.  **Feature Branches:**
    - Basis: `uat`
    - Befehl: `git checkout uat && git pull origin uat && git checkout -b feature/name`
4.  **Deployment:**
    - Ein Push auf `uat` triggert die GitHub Action `UAT Deploy`.
    - Prozess: Build -> SCP nach Server -> PM2 Restart.

## 🛠 Tech Stack

- **Runtime:** Node.js v20.5.0 (verwende `nvm`).
- **Datenbank:** PostgreSQL 18 (Lokal via Docker auf Port 5433, Server auf Standard).
- **ORM/Query Builder:** Knex.js.
- **Framework:** Node.js Backend (siehe `package.json` für spezifische Routing-Libs).
- **Logging:** Custom Logger schreibt lokal in `logs/api.logs`.

## 📂 Repository Struktur & Dateien

- `/src`: Quellcode der API.
- `/build`: Kompiliertes Artefakt (wird deployed).
- `knexfile.js`: DB-Config (Muss lokal aus `.example` erstellt werden).
- `deploy2uat.yml`: CI/CD Definition.

## 🚀 Commands (Setup & Run)

### 1. Installation

```bash
nvm install 20.5.0
nvm use
npm install
```

### 2. Datenbank Setup (Docker)

PostgreSQL läuft lokal im Container auf Port 5433, um Konflikte zu vermeiden.

```bash
# Container bauen und starten
docker build -t zuugle-postgres-db ./
docker run -d --name zuugle-container -p 5433:5432 zuugle-postgres-db

# Daten importieren (Dump von uat-dump.zuugle.at)
npm run import-data-docker-download
```

### 3. Server starten (Lokal)

Startet die API und schreibt Logs.

```bash
npm run start
```

Hinweis: Logs prüfen unter zuugle-api/logs/api.logs.

### 4. Build & Assets

Um GPX-Files und Bilder zu generieren:

```bash
npm run build
npm run import-files
```

## 🧪 Testing & Quality Assurance

Tests **MÜSSEN** vor jedem Commit lokal ausgeführt und bestanden werden.

```bash
npm run tsc    # TypeScript-Prüfung
npm test       # Jest Test-Suite
```

### GPX-Referenzbild aktualisieren

Der Test `test/gpx-image.test.js` vergleicht generierte GPX-Kartenbilder mit einem Referenzbild unter `test/fixtures/gpx_image_reference.webp`. Wenn Änderungen an der Kartendarstellung vorgenommen werden (Marker, Farben, Layout, Leaflet-Konfiguration etc.), **muss** das Referenzbild aktualisiert werden:

```bash
# 1. Altes Referenzbild löschen
rm test/fixtures/gpx_image_reference.webp

# 2. Test einmal ausführen → erzeugt neues Referenzbild aus dem generierten Bild
npm test -- --testPathPattern=gpx-image

# 3. Neues Referenzbild prüfen und committen
git add test/fixtures/gpx_image_reference.webp
```

Wird das Referenzbild nach Darstellungsänderungen **nicht** aktualisiert, schlägt der Test in CI fehl.

- **Linting:** `npm run lint` und `npm run format` vor dem Commit ausführen.
- **Validierung:** Zusätzlich `npm run build` und manuelles Starten (`npm run start`) zur Verifikation.

## 📝 Commit-Richtlinien

- **Ein logischer Change pro Commit.** Zusammengehöriges zusammen committen — aber keine unzusammenhängenden Änderungen bündeln.
- **Erste Zeile unter 72 Zeichen.** Sie wird in `git log --oneline`, GitHub PR-Ansichten und E-Mail-Benachrichtigungen abgeschnitten.
- **Intention beschreiben, nicht Dateien.** Warum wurde die Änderung gemacht, nicht was mechanisch geändert wurde.
- **Issues referenzieren,** wenn vorhanden: `Fixes #42`, `Closes #87`.
- `git rebase -i` nutzen, um unübersichtliche History vor dem Push auf `uat` zu bereinigen.

Schlecht: `fix stuff`, `wip`, `changes`  
Gut: `Fix mobile layout breaking on small screens (#87)`, `Add tour filter by difficulty level`

## ✅ Definition of Done

1. Code basiert auf dem aktuellen `uat` Stand.
2. `npm run tsc` läuft ohne Fehler.
3. `npm test` läuft ohne Fehler (inkl. aktualisiertes GPX-Referenzbild, falls nötig).
4. `npm run build` ist erfolgreich.
5. Der Server startet lokal ohne Absturz (`npm run start`).
6. Keine Hardcoded Credentials (nutze Environment Variables).

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
npm run import-data-docker
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

- **Automatisierte Tests:** Aktuell **NICHT** vorhanden. Agenten sollen keine Tests ausführen oder fehlschlagende Test-Runs halluzinieren.
- **Linting:** Ein Linter-Setup ist in Arbeit (Branch eslint). Aktuell gilt: Halte dich an den bestehenden Code-Style (Standard JS/Node).
- **Validierung:** Da keine Tests existieren, muss der Code durch npm run build und manuelles Starten (npm run start) verifiziert werden.

## ✅ Definition of Done

1. Code basiert auf dem aktuellen uat Stand.
2. npm run build ist erfolgreich.
3. Der Server startet lokal ohne Absturz (npm run start).
4. Keine Hardcoded Credentials (nutze Environment Variables).

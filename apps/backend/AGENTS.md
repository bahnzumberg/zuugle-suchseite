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
    * Basis: `uat`
    * Befehl: `git checkout uat && git pull origin uat && git checkout -b feature/name`
4.  **Deployment:**
    * Ein Push auf `uat` triggert die GitHub Action `UAT Deploy`.
    * Prozess: Build -> SCP nach Server -> PM2 Restart.

## 🛠 Tech Stack
* **Runtime:** Node.js v20.5.0 (verwende `nvm`).
* **Datenbank:** PostgreSQL 16 (Lokal via Docker auf Port 5433, Server auf Standard).
* **ORM/Query Builder:** Knex.js.
* **Framework:** Node.js Backend (siehe `package.json` für spezifische Routing-Libs).
* **Logging:** Custom Logger schreibt lokal in `logs/api.logs`.

## 📂 Repository Struktur & Dateien
* `/src`: Quellcode der API.
* `/build`: Kompiliertes Artefakt (wird deployed).
* `knexfile.js`: DB-Config (Muss lokal aus `.example` erstellt werden).
* `deploy2uat.yml`: CI/CD Definition.

## 🚀 Commands (Setup & Run)

### 1. Installation
```bash
nvm install 20.5.0
nvm use
npm install
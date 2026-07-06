# AGENTS.md für zuugle-api

Dieses Repository nutzt **`CLAUDE.md`** als zentrale, verbindliche Quelle für Kontext und
Workflow-Regeln für alle KI-Coding-Assistenten (Claude, Copilot, Cursor, etc.). Um
Abweichungen zu vermeiden, dupliziert diese Datei diese Regeln **nicht** — sie verweist
darauf.

**Bitte lies zuerst:**

- [`CLAUDE.md`](./CLAUDE.md) — Projektübersicht, Tech-Stack, Workflow, Commands, Commit-Regeln
- [`.agent/constraints.md`](./.agent/constraints.md) — Deployment-Constraints (Secrets, DB-Schema)
- [`.agent/git-workflow.md`](./.agent/git-workflow.md) — Branch- und Commit-Workflow
- [`.agent/safe-editing.md`](./.agent/safe-editing.md) — sichere Bearbeitung bestehender Dateien
- [`README.md`](./README.md) — lokales Setup (nvm, Docker, Datenbank, Server starten)

## Kurzfassung (Details siehe oben)

- **UAT-First Workflow:** `uat` ist der Hauptentwicklungszweig. **NIEMALS** direkt auf
  `main` committen/pushen. Feature-Branches von `uat` abzweigen.
- **Vor jedem Commit müssen bestehen:** `npm run tsc`, `npm test`, `npm run format`,
  `npm run lint`.
- **Keine Hardcoded Credentials** — alles über Environment-Variablen (`.env` lokal,
  Host-Env auf den Servern).

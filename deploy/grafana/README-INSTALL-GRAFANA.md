# Grafana Monitoring Setup für Zuugle

Vollständige Anleitung zur Einrichtung des Monitorings für den Gesundheitszustand von Zuugle, Touren-Metriken im Zeitverlauf, Log-Analyse via Promtail/Loki sowie Matomo-Zugriffszahlen.

---

## 1. Architektur & Server-Rollen

Zur Wahrung des Projektstandards werden keine IP-Adressen oder Passwörter fest im Repository hinterlegt. Die Infrastruktur gliedert sich in folgende Rollen:

| Server-Rolle | Beschreibung | Zu installierende Komponenten |
| --- | --- | --- |
| **Zuugle Server** | Produktions- bzw. UAT-Server (Backend API, PostgreSQL, PM2, Cronjobs) | `postgres_exporter`, `promtail` |
| **Grafana Server** | Zentraler Monitoring-Server | `Prometheus`, `Loki`, `Grafana` |
| **Matomo Server** | Server mit der Matomo MySQL/MariaDB-Datenbank | MySQL-Datenbank (für Grafana lesbar) |

---

## 2. Standard für sensible Daten & Geheimnisse im Projekt

In diesem Repository gilt ein strikter Sicherheitsstandard für vertrauliche Informationen:

1. **Keine Klartext-Secrets im Git:** Passwörter, API-Tokens, geheime Schlüssel und interne IP-Adressen dürfen **niemals** in git-getrackten Dateien stehen.
2. **Vorlagen-Dateien (`.example`):** Alle Konfigurationen mit Variablen werden als `*.example.yml` oder `.env.example` versioniert. Echte Konfigurationen auf den Servern erhalten keinen `.example`-Suffix.
3. **Automatischer Git-Schutz:** Das Verzeichnis `deploy/grafana/.gitignore` ignoriert automatisch:
   - Lokale `.env`-Dateien
   - Dateien mit Endungen `*.secret` oder `*.key`
   - Die produktive `promtail-config.yml`
   - Tatsächliche `datasources/*.yaml`
4. **Semantische Platzhalter in der Dokumentation:** In Dokumentationen werden anstelle von echten Daten ausschließlich Platzhalter verwendet:
   - `<grafana-server-ip>`
   - `<zuugle-db-host>`
   - `<zuugle-db-password>`
   - `<matomo-db-host>`
   - `<matomo-db-password>`

---

## 3. Touren-Metriken & Systemgesundheit via Prometheus

Auf dem Zuugle Server liegen in der PostgreSQL-Tabelle `kpi` die tagesaktuellen Kennzahlen (`total_tours`, `total_tours_<city>`, `total_connections`, etc.). Da die Datenbank selbst nur den aktuellen Schnappschuss speichert, tastet **Prometheus** diese Werte über den `postgres_exporter` regelmäßig ab und speichert die Historie im Zeitverlauf (Tages- und Wochenverläufe).

### 3.1 `postgres_exporter` auf dem Zuugle Server einrichten

1. Auf dem Zuugle Server in PostgreSQL einen Nur-Lese-Benutzer anlegen.
   > **Datenbank-Namen nach Umgebung:**
   > - **PROD (`zuugle-neu`):** `zuugle_postgresql_prod`
   > - **UAT (`uat-zuugle`):** `zuugle_suchseite_uat`
   > - **DEV / Lokal:** `zuugle_suchseite_dev`

   ```sql
   CREATE USER zuugle_monitoring WITH PASSWORD '<zuugle-db-password>';
   -- Ersetze <zuugle-db-name> z. B. durch zuugle_postgresql_prod (PROD) oder zuugle_suchseite_uat (UAT):
   GRANT CONNECT ON DATABASE <zuugle-db-name> TO zuugle_monitoring;
   GRANT USAGE ON SCHEMA public TO zuugle_monitoring;
   GRANT SELECT ON kpi, tour, tour_load, city TO zuugle_monitoring;
   ```

2. Das Verzeichnis `postgres-exporter/` auf den **Zuugle Server** kopieren (z. B. nach `/opt/postgres_exporter`):
   - `queries.yaml`
   - `start-exporter.sh`

3. In `/opt/postgres_exporter/start-exporter.sh` das Passwort eintragen:
   ```bash
   chmod +x /opt/postgres_exporter/start-exporter.sh
   # Trage dein DB-Passwort in die Variable DB_PASSWORD ein
   nano /opt/postgres_exporter/start-exporter.sh
   ```

4. Den Exporter starten:
   ```bash
   cd /opt/postgres_exporter && ./start-exporter.sh
   ```

   Das Skript startet den Docker-Container mit `--restart unless-stopped` und `--net=host` und führt automatisch einen Selbsttest durch (`curl http://localhost:9187/metrics`).

### 3.2 Prometheus auf dem Grafana Server konfigurieren

In der `prometheus.yml` auf dem **Grafana Server** folgenden Scrape-Job ergänzen:

```yaml
scrape_configs:
  - job_name: 'zuugle_postgres'
    scrape_interval: 5m
    static_configs:
      - targets: ['<zuugle-server-ip>:9187']
        labels:
          environment: 'production'
          app: 'zuugle'
```

Nach dem Neustart (`systemctl restart prometheus` bzw. `curl -X POST http://localhost:9090/-/reload`) sind folgende Metriken in Prometheus abfragbar:
- `pg_up`: Erreichbarkeit der Zuugle PostgreSQL-Datenbank (1 = online, 0 = offline).
- `zuugle_total_tours_total_tours`: Gesamtzahl der erreichbaren Touren (z. B. 39.988).
- `zuugle_city_reachable_tours_tours{city="wien"}`: Erreichbare Touren für eine Stadt im Zeitverlauf (z. B. Wien: 9.975, Salzburg: 10.180).
- `zuugle_connections_total_connections`: Gesamtzahl der Fahrplanverbindungen.
- `zuugle_tour_staging_rows_count`: Zeilen in `tour_load` (Staging).
- `zuugle_tour_live_rows_count`: Zeilen in `tour` (Live).

---

## 4. Log-Versand mit Promtail nach Loki

Um Logfiles zentral auszuwerten und Fehler (wie z. B. den Abbruch des nächtlichen Daten-Swaps) sofort im Dashboard zu sehen, liest Promtail auf dem **Zuugle Server** die Log-Dateien aus und überträgt sie an Loki auf dem **Grafana Server**.

### 4.1 Promtail auf dem Zuugle Server installieren

1. Promtail Binary herunterladen und installieren:
   ```bash
   curl -fsSL -O https://github.com/grafana/loki/releases/download/v2.9.2/promtail-linux-amd64.zip
   unzip promtail-linux-amd64.zip
   sudo mv promtail-linux-amd64 /usr/local/bin/promtail
   sudo chmod +x /usr/local/bin/promtail
   ```

2. Konfigurationsverzeichnis erstellen und Vorlage kopieren:
   ```bash
   sudo mkdir -p /etc/promtail
   sudo cp deploy/grafana/promtail/promtail-config.example.yml /etc/promtail/promtail-config.yml
   ```

3. In `/etc/promtail/promtail-config.yml` die Ziel-Adresse von Loki eintragen:
   ```yaml
   clients:
     - url: http://<grafana-server-ip>:3100/loki/api/v1/push
   ```

4. Funktionsweise der Pipeline in `promtail-config.yml`:
   - Zuugle Backend-Logs nutzen das Format: `YYYY-MM-DD HH:mm:ss [LEVEL] message`.
   - Die Regex-Stage extrahiert das Feld `level` (`INFO`, `WARN`, `ERROR`).
   - Die Multiline-Stage fasst mehrzeilige Fehlermeldungen (Stacktraces) zusammen.
   - Der Zeitstempel wird automatisch auf die Wiener Zeitzone (`Europe/Vienna`) synchronisiert.

5. Systemd-Service einrichten:
   ```bash
   sudo cp deploy/grafana/promtail/promtail.service.example /etc/systemd/system/promtail.service
   sudo systemctl daemon-reload
   sudo systemctl enable --now promtail
   sudo systemctl status promtail
   ```

### 4.2 Fehlererkennung in Loki

Logzeilen wie:
```text
2026-11-02 01:26:01 [ERROR] SYNC TOURS ABORT: tour_load has 40053 rows vs 50400 live (>20% drop) — refusing swap. Continuing with tours from previous day.
```
werden mit dem Label `level="ERROR"` indiziert. In Grafana werden sie über folgende LogQL-Abfrage im Panel *🚨 Kritische Nachtlauf-Abbrüche & Fehler* rot hervorgehoben:

```logql
{job=~"zuugle.*"} |~ "(?i)SYNC TOURS ABORT|FAILED|FATAL|ABORT"
```

---

## 5. Matomo MySQL-Datenquelle in Grafana einbinden

Matomo speichert Besuchs- und Aktionsdaten in MySQL/MariaDB. In dieser Installation tragen die Tabellen historisch bedingt noch das Präfix **`piwik_`** (z. B. `piwik_log_link_visit_action`).

### 5.1 Nur-Lese-Benutzer in MySQL anlegen

Auf dem **Matomo Server** in MySQL ausführen:

```sql
CREATE USER 'grafana_reader'@'<grafana-server-ip>' IDENTIFIED BY '<matomo-db-password>';
GRANT SELECT ON matomo.piwik_log_link_visit_action TO 'grafana_reader'@'<grafana-server-ip>';
GRANT SELECT ON matomo.piwik_log_action TO 'grafana_reader'@'<grafana-server-ip>';
GRANT SELECT ON matomo.piwik_log_visit TO 'grafana_reader'@'<grafana-server-ip>';
FLUSH PRIVILEGES;
```

### 5.2 Datenquelle in Grafana anlegen

1. In Grafana unter **Connections > Data sources** auf **Add data source** klicken und **MySQL** wählen.
2. Einstellungen vornehmen:
   - **Name:** `matomo`
   - **Host:** `<matomo-db-host>:3306`
   - **Database:** `matomo` (bzw. Name der Matomo-Datenbank)
   - **User:** `grafana_reader`
   - **Password:** `<matomo-db-password>`
   - **Session timezone:** `Europe/Vienna` *(essenziell, damit Tagesübergänge um Mitternacht exakt übereinstimmen!)*
3. Auf **Save & test** klicken.

*(Alternativ kann die Vorlage `deploy/grafana/datasources/matomo-mysql.yaml.example` im Grafana-Provisioning-Ordner `/etc/grafana/provisioning/datasources/` abgelegt werden).*

---

## 6. Dashboards in Grafana importieren

Es stehen zwei spezialisierte Dashboards zur Verfügung:

1. **Operations & Systemgesundheit:** `deploy/grafana/dashboards/zuugle-health-dashboard.json`
2. **Marketing & User Journey Analytics:** `deploy/grafana/dashboards/zuugle-marketing-dashboard.json`

### 6.1 Import-Schritte

1. In Grafana in der linken Leiste auf **Dashboards > New > Import** klicken.
2. Entweder die gewünschte JSON-Datei hochladen oder den JSON-Inhalt in das Textfeld einfügen.
3. Im Dialog die zugeordneten Datenquellen auswählen:
   - Für das **Health Dashboard**: `Prometheus`, `Loki` und `Matomo` (MySQL).
   - Für das **Marketing Dashboard**: `Matomo` (MySQL).
4. Auf **Import** klicken.

### 6.2 Übersicht der Dashboards

#### A. Zuugle Health & Operations Dashboard (`zuugle-health-dashboard.json`)
- **Zuugle Systemstatus & Schnellübersicht:** PostgreSQL Online-Status (`pg_up`), Gesamtzahl erreichbarer Touren, Fahrplan-Verbindungen, Ampel-Status für Nachtlauf-Abbrüche (grün bei 0, rot bei >= 1), Pageviews im Zeitfenster.
- **Touren & Erreichbarkeit im Zeitverlauf:** Gesamtzahl der Touren pro Tag, Zeitverlauf pro Land (AT, DE, CH, IT, SI, LI, FR), Erreichbare Touren pro Land (Aktuell, absteigend sortiert), Top 20 Städte nach Touren.
- **Log-Monitoring & Fehler-Alerting (Loki / Promtail):** Spezielles Log-Panel für kritische Nachtlauf-Abbrüche (`SYNC TOURS ABORT`), statische Kachel für Anzahl ERROR- und WARN-Meldungen, vollständiger durchsuchbarer Zuugle Log-Stream.
- **Matomo Pageviews:** Gesamter Traffic-Verlauf über Zeit.

#### B. Zuugle User Journey & Marketing Analytics Dashboard (`zuugle-marketing-dashboard.json`)
- **Städte-Filter (`$city`):** Dropdown ganz oben zur Filterung des gesamten Dashboards auf eine bestimmte Startstadt (z. B. `wien`, `muenchen`, `innsbruck`, `salzburg` oder `All`).
- **🎯 Key Performance Indicators:** Besuche (Visits), Seitenaufrufe (Pageviews), Interaktionstiefe (Aktionen pro Besuch), Ø Verweildauer in Min/Sek, Absprungrate (Bounce Rate) und Öffi-Fahrplan-Suchen.
- **🌍 Akquise, Länderportale & Herkunft:**
  - Traffic-Verteilung nach Länderportal (`zuugle.at`, `zuugle.de`, `zuugle.ch`, `zuugle.it`, `zuugle.si`, `zuugle.fr`, `zuugle.li`).
  - Physischer Standort der Besucher (Top 15 GeoIP Städte mit Länderkennzeichen).
  - Geräteverteilung (Desktop vs. Smartphone vs. Tablet).
  - Akquise-Kanäle (Direktaufrufe, Suchmaschinen wie Google, Referrals, Social Media).
- **⏱️ Startort-Aktivierung & Onboarding-Funnel ("Time to City"):**
  - Ø Zeit bis zur ersten Stadtwahl (`Time to City` in Sekunden).
  - Startstadt-Aktivierungsquote (% der Besuche, die eine Startstadt für Fahrpläne wählen).
  - Top gewählte Start-Städte (aus `city=` URL-Parametern).
  - Sprachverteilung (Deutsch, Englisch, Italienisch, etc.).
- **🔍 Filter-Radar (Dedizierte Tortendiagramme für jeden Filter):**
  - **Sportarten (`types=...`):** Wandern, Bergtour, Skitour, Schneeschuh, Klettersteig, Klettern, Bike & Hike, Rodeln, Langlaufen, Trailrunning, Weitwandern.
  - **Schwierigkeit (`difficulties=...`):** Leicht (1), Mittel (2), Schwer (3) sowie Kombinationen.
  - **Tour-Länge:** Tagestouren vs. Mehrtagestouren (`singleDayTour` vs. `multipleDayTour`).
  - **Kartenansicht:** Kartenansicht aktiv (`map=true`) vs. Listenansicht.
  - **Routen-Typ:** Überschreitung (`traverse=true`) vs. Beliebig/Rundtour.
  - **Saison:** Nur Sommer (`summerSeason`) vs. Nur Winter (`winterSeason`) vs. Ganzjährig.
  - **Wetterfilter:** Wetterfilter aktiv (`weather=true`) vs. aus.
  - **Regionen / Gebirgsgruppen:** Top gefilterte Gebirgsgruppen (`ranges=...`).
  - **Freitextsuche:** Top 20 eingetippte Berggipfel, Regionen und Hüttennamen.
- **🏔️ Touren-Interesse & Outbound-Conversions:**
  - **📊 Meistaufgerufene Touren nach Städten (Pivottabelle über volle Breite):** In den Zeilen die Touren mit IDs (`Tour #...`), in den Spalten die Start-Cities alphabetisch sortiert, in den Zellen die Pageviews.
  - **Partner-Outlinks:** Klicks zu externen Partnern und Tourenportalen (Alpenvereinaktiv, Bahn zum Berg, etc.).
- **📈 Traffic-Entwicklung im Zeitverlauf:**
  - Kombinierter Zeitverlauf von Seitenaufrufen und Besuchen.

---

## 7. Empfohlenes Alerting (Optional)

In Grafana kann eine Benachrichtigungsregel eingerichtet werden, um bei nächtlichen Abbrüchen automatisch alarmiert zu werden (z. B. via Telegram, Slack oder E-Mail):

- **Rule Name:** `Zuugle Nightly Sync Aborted`
- **Data Source:** `Loki`
- **LogQL Query:**
  ```logql
  count_over_time({job=~"zuugle.*"} |= "SYNC TOURS ABORT" [15m]) > 0
  ```
- **Zustand:** Feuert sofort, wenn innerhalb von 15 Minuten ein Swap-Abbruch geloggt wird.

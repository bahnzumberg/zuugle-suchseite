#!/usr/bin/python3
import sys
import logging
import subprocess
import os
import mod_jobcontrolcenter
from datetime import datetime
import time

# --- KONFIGURATION ---
PROJECT_DIR = "/root/suchseite/api"
LOG_FORMAT = '%(asctime)s %(levelname)-8s %(message)s'
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

# Logging Setup
logging.basicConfig(
    format=LOG_FORMAT,
    level=logging.INFO,
    stream=sys.stdout,
    datefmt=DATE_FORMAT
)


while not mod_jobcontrolcenter.JCC_hasjobfinished('hermes2search.datatransfer.zuugle', datetime.now()):
    time.sleep(222)

    now = datetime.now()
    time_to_check = now.replace(hour=22, minute=30, second=0, microsecond=0)

    if now > time_to_check:
        logging.info("It's past 22:30. Exiting the script. No dump today.")
        sys.exit()  # This will terminate the script

print("Skript startet...")



def run_node_task(npm_command):
    """
    Führt einen npm-Befehl aus und gibt True zurück, wenn er erfolgreich war.
    """
    try:
        logging.info(f"Starte Prozess: npm run {npm_command}")

        # Erstelle eine Kopie der aktuellen Umgebungsvariablen
        # und füge/überschreibe die benötigten Werte
        env = os.environ.copy()
        env["NODE_ENV"] = "production"

        # subprocess.run wartet auf das Ende des Prozesses
        # shell=True ist für npm unter Linux oft am einfachsten
        result = subprocess.run(
            f"npm run {npm_command}",
            cwd=PROJECT_DIR,
            shell=True,
            capture_output=False, # Output geht direkt in die Logdatei via stdout
            text=True,
            env=env  # <-- Umgebungsvariablen übergeben
        )

        if result.returncode == 0:
            logging.info(f"Erfolg: {npm_command} wurde sauber beendet.")
            return True
        else:
            logging.error(f"Fehler: {npm_command} abgebrochen mit Exit-Code {result.returncode}")
            return False

    except Exception as e:
        logging.error(f"Kritischer Fehler beim Ausführen von {npm_command}: {str(e)}")
        return False

def main():
    # --- START DER VERARBEITUNG ---
    logging.info("Start Zuugle load sequence...")

    # Task 1: Data Import
    mod_jobcontrolcenter.JCC_jobstarted('zuugle.load')
    if run_node_task('import-data-prod'):
        # Nur wenn der Import erfolgreich war, markieren wir ihn als fertig
        mod_jobcontrolcenter.JCC_jobfinished('zuugle.load')

        # Task 2: Files & GPX (Nur wenn Task 1 erfolgreich war)
        logging.info("Start Zuugle files generation...")
        mod_jobcontrolcenter.JCC_jobstarted('zuugle.files')

        if run_node_task('import-files'):
            mod_jobcontrolcenter.JCC_jobfinished('zuugle.files')
            logging.info("...Zuugle load und files erfolgreich abgeschlossen.")
        else:
            logging.error("Zuugle files fehlerhaft. Job bleibt für nächsten Versuch offen.")
    else:
        # Falls die Datenbank (ECONNREFUSED) nicht erreichbar war:
        # JCC_jobfinished wird NICHT aufgerufen.
        # Der Cronjob wird es in 10 Minuten erneut versuchen.
        logging.error("Zuugle load abgebrochen. Kein 'finished' Flag gesetzt.")

if __name__ == "__main__":
    main()

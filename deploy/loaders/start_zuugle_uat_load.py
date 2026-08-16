#!/usr/bin/python3
import sys
import logging
import subprocess
import os
import mod_jobcontrolcenter
import datetime
import time
from datetime import datetime # Korrektur für direkten Aufruf von datetime.now()

# --- KONFIGURATION ---
PROJECT_DIR = "/root/suchseite/api"
PROJECT_DIR2 = "/root/suchseite/dev-api"
LOG_FORMAT = '%(asctime)s %(levelname)-8s %(message)s'
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

# Logging Setup
logging.basicConfig(
    format=LOG_FORMAT,
    level=logging.INFO,
    stream=sys.stdout,
    datefmt=DATE_FORMAT
)

# Warten auf Vorbedingungen
while not mod_jobcontrolcenter.JCC_hasjobfinished('hermes2search.datatransfer.uat', datetime.now()):
    time.sleep(222)

    now = datetime.now()
    time_to_check = now.replace(hour=20, minute=30, second=0, microsecond=0)

    if now > time_to_check:
        logging.info("It's past 20:30. Exiting the script. No dump today.")
        sys.exit()

print("Skript startet...")
mod_jobcontrolcenter.JCC_jobstarted('zuugle.load.uat')


def run_restore_databases():
    """
    Führt das Datenbank-Restore-Skript in beiden Verzeichnissen aus.
    Ersetzt den alten npm import-data-docker-download Aufruf.
    """
    script_name = "./restore_databases.sh"
    
    try:
        # 1. Ausführung im API Verzeichnis (PROJECT_DIR)
        logging.info(f"Starte Restore in {PROJECT_DIR}...")
        result_api = subprocess.run(
            [script_name],
            cwd=PROJECT_DIR,       # Entspricht: cd /root/suchseite/api
            shell=True,            # Erlaubt Ausführung als Shell-Befehl
            capture_output=False,  # Output direkt ins Log
            text=True
        )
        
        if result_api.returncode != 0:
            logging.error(f"Fehler beim Restore in {PROJECT_DIR}. Exit-Code: {result_api.returncode}")
            return False

        # 2. Ausführung im DEV-API Verzeichnis (PROJECT_DIR2)
        logging.info(f"Starte Restore in {PROJECT_DIR2}...")
        result_dev = subprocess.run(
            [script_name],
            cwd=PROJECT_DIR2,      # Entspricht: cd /root/suchseite/dev-api
            shell=True,
            capture_output=False,
            text=True
        )

        if result_dev.returncode != 0:
            logging.error(f"Fehler beim Restore in {PROJECT_DIR2}. Exit-Code: {result_dev.returncode}")
            return False
            
        logging.info("Datenbank-Restore in beiden Verzeichnissen erfolgreich.")
        return True

    except Exception as e:
        logging.error(f"Kritischer Fehler beim Datenbank-Restore: {str(e)}")
        return False


def run_node_task(npm_command):
    """
    Führt einen npm-Befehl aus und gibt True zurück, wenn er erfolgreich war.
    (Wird noch für Task 2 benötigt)
    """
    try:
        logging.info(f"Starte Prozess: npm run {npm_command}")
        
        env = os.environ.copy()
        env["NODE_ENV"] = "production"

                
        # Zuerst DEV
        result = subprocess.run(
            f"npm run {npm_command}",
            cwd=PROJECT_DIR2,
            shell=True,
            capture_output=False,
            text=True,
            env=env
        )
        
        # DANN UAT
        result = subprocess.run(
            f"npm run {npm_command}",
            cwd=PROJECT_DIR,
            shell=True,
            capture_output=False,
            text=True,
            env=env
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
    logging.info("Start Zuugle load UAT sequence...")
    
    # Task 1: Database Restore (Neu: Shell Skripte statt npm)
    mod_jobcontrolcenter.JCC_jobstarted('zuugle.load.uat')
    
    # HIER DIE ÄNDERUNG: Aufruf der neuen Funktion
    if run_restore_databases():
        # Wenn Restore erfolgreich war, markieren wir ihn als fertig
        mod_jobcontrolcenter.JCC_jobfinished('zuugle.load.uat')
        
        # Task 2: Files & GPX (Bleibt wie bisher via npm)
        logging.info("Start Zuugle files generation...")
        mod_jobcontrolcenter.JCC_jobstarted('zuugle.files.uat')
        
        if run_node_task('import-files'):
            mod_jobcontrolcenter.JCC_jobfinished('zuugle.files.uat')
            logging.info("...Zuugle load und files UAT erfolgreich abgeschlossen.")
        else:
            logging.error("Zuugle files UAT fehlerhaft. Job bleibt für nächsten Versuch offen.")
    else:
        # Falls Restore fehlschlug
        logging.error("Zuugle load UAT (Restore DB) abgebrochen. Kein 'finished' Flag gesetzt.")

if __name__ == "__main__":
    main()

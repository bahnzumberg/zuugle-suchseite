# zuugle.at API


## Erstinstallation
Im Projekt-Verzeichnis 

    nvm use
ausführen und dann 
 
    npm install
ausführen und sämtliche Abhängigkeiten installieren.


## Knexfiles umbenennen
Im src Verzeichnis liegen zwei Example Dateien: knexfile.js.example und knexfileTourenDb.js.example. 
Bitte diese auf knexfile.js und knexfileTourenDb.js umbenennen.


### Datenbank einrichten
1. Docker (https://www.docker.com/) lokal installieren
2. docker build -t zuugle-postgres-db ./
3. docker run -d --name zuugle-container -p 5432:5432 zuugle-postgres-db
4. Manuell diese leeren Folder anlegen:
    * public/gpx
    * public/gpx-image
    * public/gpx-image-with-track
    * public/gpx-track
5. Um die Daten lokal einzurichten müssen folgende Befehle ausgeführt werden:
    1. npm run build
    2. npm run import-data-full
	3. Alternativ für Delta Load (an jedem folgenden Tag): npm run import-data
    4. npm run import-files
6. Danach sollten sämtliche Daten und Files vorhanden sein
7. npm run start


## Lokal ausführen
Sobald die Dependencies und die Datenbank eingerichtet sind, kann die Applikation mit 
    npm run start 
lokal gestartet werden.

# zuugle.at API

## Erstinstallation
Im Projekt-Verzeichnis 
 
    nvm use
 ausführen und dann 
 
    npm install
ausführen um sämtliche Dependencies zu installieren.

### Datenbank einrichten

1. Eine Postgres Instanz mit der Version 11 installieren 
2. Eine Datenbank „zuugle“ anlegen
3. Danach das File „database.sql“ vom Root-Verzeichnis in der DB ausführen
4. Sicherstellen dass folgende Folder existieren:
    * public/gpx
    * public/gpx-image
    * public/gpx-image-with-track
    * public/gpx-track
    * public/headless-leaflet
    * public/range-image 
5. Um die Daten lokal einzurichten müssen folgende Befehle ausgeführt werden:
    1. npm run build
    2. npm run import-data (for delta load) or npm run import-data-full (for full load)
    3. npm run import-files
6. Danach sollten sämtliche Daten und Files vorhanden sein und können lokal genutzt werden


## Lokal ausführen

Sobald die Dependencies und die Datenbank eingerichtet sind, kann die Applikation mit 

    npm run start
    
lokal gestartet werden.

## Deployment

Vorabinfo: Das File .deploy/deploy.sh muss angepasst werden, je nachdem wo dein Keyfile liegt. Das selbe gilt für .deploy/connect.sh

Aufruf von
    
    sh .deploy/deploy.sh
    
Dieser Befehl führt den Build aus und lädt die Daten auf den Server
    
Mit Server verbinden 

    .deploy/connect.sh

Auf Server folgenden Befehl ausführen 
    
    pm2 restart zuugle_api
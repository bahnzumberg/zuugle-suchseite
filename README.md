# this is the final functional version of branch 'falsal-update-versions-languages'
# what is new here:
This version includes updated packages , main changes:
node to v19.8.1 (npm v9.5.1)
react and react-dom both to v18.2.0
react-redux to 8.0.5
react-leaflet: 4.2.1,
react-leaflet-cluster: 2.1.0,
react-leaflet-fullscreen: 2.0.2,

# zuugle.at Suchseite
## Erstinstallation
Bei der Erstinstallation muss zuerst der Befehl 

npm install
    
ausgeführt werden. Danach sind alle Dependencies installiert und die Suchseite kann lokal ausgeführt werden. 

## Start Lokal

Um die Suchseite lokal zu starten muss vorab darauf geachtet werden das die richtige Node Version verwendet wird. Mit

    nvm use
    
wir das sichergestellt. Danach den Befehl 

    npm run start
    
ausführen und im Browser http://localhost:3000 aufrufen.

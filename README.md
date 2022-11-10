# zuugle.at Suchseite
## Erstinstallation
Bei der Erstinstallation muss zuerst der Befehl 

    npm install
    
ausgeführt werden. Danach sind alle Dependencies installiert und die Suchseite kann lokal ausgeführt werden. 

## Start Lokal

Um die Suchseite lokal zu starten muss vorab darauf geachtet werden das die richtige Node Version verwendet wird. Mit

    nvm use
    
wir das sichergestellt. Danach einfach den Befehl 

    npm run start
    
ausführen und im Browser http://localhost:3000 aufrufen.

## Deployment

Für das Deployment sind zwei Schritte notwendig: 
Zuerst den Befehl

    npm run build
  
ausführen. Mit diesem Befehl wird das Paket gebaut. Mit 

    sh .deploy/deploy.sh
    
wird das Build-Verzeichnis in weiterer Folge auf den Server geladen. Am Server muss nichts neu gestartet werden.
# Zuugle Suchseite

## First time installation

### Install Volta

Volta makes it really easy to always have the correct node engine (similar to nvm but faster and even simpler).

Follow the installation directions: https://docs.volta.sh/guide/getting-started

### Install all modules

Execute in the project directory:

    npm install

and install all dependencies.

## Run frontend with local backend

### Prepare API

Follow the steps described at https://github.com/bahnzumberg/zuugle-api#zuugleat-api

### Execute frontend locally

    npm run start

This will run the frontend in a browser on http://localhost:3000

## Run frontend with remote backend

    npm run start-remote-api

## Common issues

- `Error: ENOSPC: System limit for number of file watchers reached`  
  Fix (Linux):

```bash
echo "fs.inotify.max_user_watches=131070" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

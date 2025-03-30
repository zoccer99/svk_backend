# Nutze eine schlanke Node-Version für ARM (Pi 4 ist ARM-basiert)
FROM node:lts-alpine  

# Setze das Arbeitsverzeichnis
WORKDIR /svk_backend_app

# Kopiere Package-Dateien und installiere Dependencies
COPY package*.json ./
RUN npm install

# Kopiere den Rest des Codes
COPY . .  

# Port freigeben
EXPOSE 5000

# Starte das Backend
CMD ["node", "server.js"]  



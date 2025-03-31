# Basis-Image mit Node.js
FROM node:18

# Arbeitsverzeichnis im Container
WORKDIR /app

# Nur package.json zuerst kopieren für besseres Caching
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

# Port freigeben
EXPOSE 5000

# Startbefehl
CMD ["node", "server.js"]


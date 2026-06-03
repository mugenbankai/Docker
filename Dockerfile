# Utilisation d'une image de base Node.js
FROM node:18

# Installation de iputils pour ping
RUN apt-get update && apt-get install -y iputils-ping && rm -rf /var/lib/apt/lists/*

# Création du répertoire de travail dans le conteneur
WORKDIR /app

# Copie des fichiers du projet dans le conteneur
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers dans le conteneur
COPY . .

# Exposition du port utilisé par l'application
EXPOSE 3001

# Commande pour démarrer l'application
CMD ["npm", "start"]

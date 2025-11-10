# Usa Node.js + Python (para yt-dlp)
FROM node:22-bullseye

# Instala Python y ffmpeg
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Crea directorio de la app
WORKDIR /app

# Copia los archivos
COPY package*.json ./
RUN npm install --production

COPY . .

# Expone el puerto
EXPOSE 8080

# Comando de inicio
CMD ["npm", "start"]
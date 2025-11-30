# Usa Node.js + Python (para yt-dlp)
FROM node:22-bookworm
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg && ln -s /usr/bin/python3 /usr/bin/python && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]

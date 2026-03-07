# PlaylistDownloaderMobile

Aplicación móvil (Expo/React Native) con backend Node.js para buscar, extraer metadata y descargar audio MP3 desde YouTube. Este README documenta arquitectura, tecnologías, requisitos, configuración, ejecución local y con Docker, además de un recorrido por los módulos clave.


<img width="315" height="215" alt="imagen" src="https://github.com/user-attachments/assets/4768be79-99df-42d5-b0e0-ad6e6b33db72" />

## Estructura del repositorio

- play-list-mobile-app/ — Frontend móvil con Expo (React Native).
- play-list-backend/ — API REST con Express que descarga y sirve los MP3.

## Tecnologías

- Frontend: Expo SDK 54, React Native 0.81, React 19, React Navigation.
- Backend: Node.js (ESM), Express 5, Helmet, CORS, yt-dlp, ytdl-core, ffmpeg.
- Infra: Docker (Node 22 bookworm; incluye Python y ffmpeg).

## Arquitectura y Flujo

- El usuario ingresa una URL de YouTube en la app móvil.
- La app llama al backend para:
  - Obtener metadata del video: GET/POST /api/youtube/metadata
  - Solicitar la descarga a MP3: GET/POST /api/youtube/download
- El backend usa yt-dlp + ffmpeg para extraer audio y guarda el archivo en una carpeta de descargas.
- Los archivos quedan expuestos estáticamente bajo /downloads; la API responde con un downloadUrl.
- La app puede abrir ese enlace o administrarlo según la plataforma.

## Backend (play-list-backend)

- Punto de entrada: [src/index.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/index.js)
- App y configuración: [src/config/server.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/config/server.js)
- Rutas:
  - YouTube: [src/routes/youtube.routes.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/routes/youtube.routes.js)
  - Historial/Limpieza: [src/routes/history.routes.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/routes/history.routes.js)
- Controladores:
  - YouTube: [src/controllers/youtube.controller.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/controllers/youtube.controller.js)
  - Limpieza: [src/controllers/history.controller.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/controllers/history.controller.js)
- Servicios: [src/services/youtube.service.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/services/youtube.service.js)
- Utilidades: [src/utils/fileHelper.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/src/utils/fileHelper.js)

### Endpoints

- GET /api/youtube/metadata?url=<YouTubeURL>
- POST /api/youtube/metadata { "url": "<YouTubeURL>" }
- GET /api/youtube/download?url=<YouTubeURL>
- POST /api/youtube/download { "url": "<YouTubeURL>" }
- GET /api/youtube/search?q=<texto>&page=<n>&pageSize=<n>
- GET /api/history
- GET|POST /api/cleanup?days=<n>

Ejemplos:

```bash
curl "http://localhost:3001/api/youtube/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
curl "http://localhost:3001/api/youtube/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### Variables de entorno

- PORT: puerto del servidor (por defecto 3001).
- DOWNLOAD_DIR: carpeta donde se guardan los MP3 (por defecto ./downloads).
- CLEANUP_DAYS: días para la tarea programada de limpieza (por defecto 7).

El directorio de descargas se expone estáticamente en /downloads. La tarea de limpieza corre cada hora y elimina archivos más antiguos que CLEANUP_DAYS.

### Requisitos y scripts

- Requisitos: Node.js 18+ (recomendado 18 o 20), ffmpeg si corres fuera de Docker.
- Instalación: `npm install`
- Desarrollo: `npm run dev` (nodemon)
- Producción: `npm start`
- Lint: `npm run lint` / `npm run lint:fix`

### Docker (backend)

Dockerfile: [play-list-backend/Dockerfile](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-backend/Dockerfile)

Construir imagen:

```bash
docker build -t playlist-backend ./play-list-backend
```

Ejecutar contenedor mapeando puerto y persistiendo descargas:

```bash
docker run --name playlist-backend \
  -p 3001:3001 \
  -e PORT=3001 \
  -e DOWNLOAD_DIR=/app/downloads \
  -e CLEANUP_DAYS=7 \
  -v "$(pwd)/downloads":/app/downloads \
  -d playlist-backend
```

Ver logs:

```bash
docker logs -f playlist-backend
```

Parar/Eliminar:

```bash
docker stop playlist-backend && docker rm playlist-backend
```

## Frontend Móvil (play-list-mobile-app)

- Entrada: [index.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/index.js) y [App.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/App.js)
- Navegación: [src/navigation/AppNavigator.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/src/navigation/AppNavigator.js)
- Pantallas: [src/screens](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/src/screens)
- Servicios API: [src/services/api.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/src/services/api.js)

### URL del backend

La app resuelve BASE_URL así:

- Toma extra.apiUrl desde la configuración de Expo.
- Si no está, usa el fallback configurado en el código.

Archivos relevantes:

- [app.config.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/app.config.js) — campo `extra.apiUrl`
- [src/services/api.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/src/services/api.js) — resolución de BASE_URL y test de conexión

Actualiza `extra.apiUrl` con la URL donde corre el backend:

- Dispositivo físico: `http://<IP_LOCAL_PC>:3001`
- Android emulator (AVD): `http://10.0.2.2:3001`
- iOS simulator: `http://localhost:3001`

### Requisitos y scripts

- Requisitos: Node.js 18+, Expo CLI, Android Studio o Xcode (opcional según plataforma).
- Instalación: `npm install`
- Iniciar Metro: `npm start` (abre Expo)
- Android: `npm run android`
- iOS (macOS): `npm run ios`
- Web: `npm run web`
- Lint: `npm run lint` / `npm run lint:fix`

### Ejecución típica

1. Inicia el backend (local o Docker).
2. Ajusta `extra.apiUrl` en [app.config.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/app.config.js) para apuntar al backend.
3. Inicia la app con `npm start` y abre en Android/iOS/Web.
4. Desde la pantalla de YouTube, pega una URL y prueba metadata/descarga.

## Levantar todo con Docker + Dispositivo

- Levanta el backend con Docker como se indicó.
- Asegúrate de que el dispositivo y el host estén en la misma red.
- Configura `extra.apiUrl` con la IP del host: `http://<IP_LOCAL_PC>:3001`.
- En Android, `usesCleartextTraffic` ya está habilitado en la configuración de Expo Android.

## Solución de problemas

- La app no conecta: verifica `BASE_URL` efectivo en [api.js](file:///e:/IdeaProjects/PERSONAL/PlaylistDownloaderMobile/play-list-mobile-app/src/services/api.js). Revisa CORS y que el puerto 3001 esté accesible desde el dispositivo.
- Descargas vacías: confirma permisos de escritura del directorio de descargas y que ffmpeg/yt-dlp funcionen (en Docker ya vienen incluidos).
- En emulador Android: usa `10.0.2.2:3001` en lugar de `localhost`.
- Firewall: autoriza el puerto 3001 en el host.

## Estilo y calidad

- Lint/format disponibles en ambos proyectos.
- Código organizado en módulos pequeños y responsabilidades separadas.

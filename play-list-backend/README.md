# play-list-backend

## Requisitos

- Node.js v18+

## Instalar

```
npm install
```

## Desarrollo

```
npm run dev
```

## Producción

```
npm start
```

## Endpoints

- `GET /api/youtube/metadata?url=<YouTubeURL>`
- `POST /api/youtube/metadata` body `{"url":"<YouTubeURL>"}`
- `GET /api/youtube/download?url=<YouTubeURL>`
- `POST /api/youtube/download` body `{"url":"<YouTubeURL>"}`
- `GET /api/history`
- `GET|POST /api/cleanup?days=<n>`

## Ejemplos

```
curl "http://localhost:3001/api/youtube/metadata?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
curl "http://localhost:3001/api/youtube/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

## Estructura

```
src/
  config/
  controllers/
  routes/
  services/
  utils/
```

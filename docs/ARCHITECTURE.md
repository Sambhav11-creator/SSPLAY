# SSPLAY Architecture

## Monorepo Structure

```
SSPLAY/
├── client/          # React + Vite frontend
├── server/          # Python FastAPI backend
├── shared/          # Shared constants
├── docker/          # Container configs
├── scripts/         # Seed utilities (Python)
└── docs/            # Documentation
```

## Backend (Python)

- **FastAPI** REST API with async/await
- **Beanie** ODM on **MongoDB** (Motor async driver)
- **JWT** authentication (`python-jose` + `passlib`)
- **Redis** optional caching
- **python-socketio** real-time live activity
- **httpx** for external API integrations (Spotify, Deezer, Audius, Jamendo, Last.fm, Genius, Musixmatch)
- **Cloudinary** for media uploads

### Server layout

```
server/
├── app/
│   ├── main.py           # FastAPI + Socket.IO ASGI app
│   ├── config.py         # Pydantic settings
│   ├── database.py       # Beanie init
│   ├── dependencies.py   # Auth dependencies
│   ├── models/           # Beanie documents
│   ├── routers/          # API route modules
│   └── services/         # Search, streaming, recommendations
├── requirements.txt
└── run.py                # Dev entry point
```

## Frontend

- **React 19** + Vite with lazy-loaded routes
- **Zustand** persistent player state
- **Redux Toolkit** authentication
- **React Query** server state
- **Howler.js** + **HLS.js** audio engine

## Deployment

| Service  | Platform |
|----------|----------|
| Frontend | Vercel   |
| Backend  | Railway  |
| Database | MongoDB Atlas |
| Cache    | Redis (optional) |

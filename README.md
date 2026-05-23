# SSPLAY

Premium cinematic music streaming platform — dark luxury UI, unified multi-API search, AI recommendations, and an advanced floating player with video backgrounds.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React, Vite, Tailwind CSS, Framer Motion, Redux Toolkit, Zustand, React Query, Howler.js, HLS.js, Wavesurfer.js |
| Backend | **Python 3.12**, **FastAPI**, Beanie, MongoDB, JWT, Redis, Socket.IO, Cloudinary |
| Deploy | Vercel (client), Railway (server), MongoDB Atlas |

## Project Structure

```
SSPLAY/
├── client/                 # React frontend
├── server/                 # Python FastAPI API
│   └── app/
│       ├── models/         # Beanie documents
│       ├── routers/        # REST endpoints
│       └── services/       # Search, streaming, recommendations
├── shared/
├── docker/
└── scripts/seed.py
```

## Quick Start

### Prerequisites

- Node.js 20+ (frontend)
- Python 3.11–3.12 recommended (3.14 may need newer pydantic wheels)
- MongoDB (local or Atlas)
- Redis (optional)

### 1. Environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` with `MONGODB_URI` and `JWT_SECRET`.

### 2. Install dependencies

```bash
# Backend
cd server
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd ../client
npm install
```

### 3. Seed database

```bash
cd ..
python scripts/seed.py
```

### 4. Run development (both apps at once)

From project root:

```bash
npm run dev
```

This starts the Python API and Vite client together.

Or run separately:

```bash
# Terminal 1 — Python API
cd server
python run.py

# Terminal 2 — React app
cd client
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api/health

### OAuth (optional)

See [docs/OAUTH.md](docs/OAUTH.md) for Google and GitHub setup. Login/register pages show OAuth buttons only when credentials are configured in `server/.env`.

### Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ssplay.app | admin123456 |
| User | demo@ssplay.app | demo123456 |

## API (unchanged contract for frontend)

All routes remain under `/api/*` with `{ success, data }` responses.

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register |
| `POST /api/auth/login` | Login |
| `GET /api/search?q=` | Unified search |
| `GET /api/stream` | Resolve playback URL |
| `GET /api/recommendations/for-you` | Recommendations |
| `GET /api/admin/dashboard` | Admin stats |

## Docker

```bash
docker-compose up --build
```

## Railway (Python backend)

Start command: `uvicorn app.main:socket_app --host 0.0.0.0 --port $PORT`

Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in Railway variables.

## License

MIT © SSPLAY

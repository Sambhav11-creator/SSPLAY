from contextlib import asynccontextmanager
from datetime import datetime

# pyrefly: ignore [missing-import]
import beanie
# pyrefly: ignore [missing-import]
from beanie.odm.utils.pydantic import get_field_type, get_model_fields, parse_object_as
# pyrefly: ignore [missing-import]
from beanie.odm.utils.typing import extract_id_class
# pyrefly: ignore [missing-import]
import socketio
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from starlette.middleware.sessions import SessionMiddleware

# Monkeypatch beanie.Document.get to gracefully return None on invalid document IDs
_original_get = beanie.Document.get

async def _safe_get(cls, document_id, *args, **kwargs):
    try:
        id_type = get_field_type(get_model_fields(cls)["id"])
        id_class = extract_id_class(id_type)
        if not isinstance(document_id, id_class):
            parse_object_as(id_type, document_id)
    except Exception:
        return None
    return await _original_get.__func__(cls, document_id, *args, **kwargs)

beanie.Document.get = classmethod(_safe_get)

from app.config import settings
from app.database import close_db, connect_db
from app.routers import (
    admin,
    albums,
    artists,
    auth,
    misc,
    playlists,
    recommendations,
    search,
    songs,
    stream,
    trending,
    users,
)
from app.utils.security import decode_token
from app.models.user import User

# Socket.IO
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins=[settings.client_url])


@sio.event
async def connect(sid, environ, auth):
    pass


@sio.event
async def activity_playing(sid, data):
    await sio.emit("live:activity", {**data, "at": datetime.utcnow().timestamp()})


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    print("MongoDB connected (Python/FastAPI)")
    yield
    await close_db()


app = FastAPI(
    title="SSPLAY API",
    description="Premium music streaming API",
    version="1.0.0",
    lifespan=lifespan,
)

# Required for Authlib OAuth state (Google / GitHub)
app.add_middleware(SessionMiddleware, secret_key=settings.jwt_secret, same_site="lax")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = FastAPI()
prefix = "/api"

app.include_router(auth.router, prefix=prefix)
app.include_router(songs.router, prefix=prefix)
app.include_router(search.router, prefix=prefix)
app.include_router(stream.router, prefix=prefix)
app.include_router(recommendations.router, prefix=prefix)
app.include_router(trending.router, prefix=prefix)
app.include_router(artists.router, prefix=prefix)
app.include_router(albums.router, prefix=prefix)
app.include_router(playlists.router, prefix=prefix)
app.include_router(users.router, prefix=prefix)
app.include_router(admin.router, prefix=prefix)
app.include_router(misc.history_router, prefix=prefix)
app.include_router(misc.queue_router, prefix=prefix)
app.include_router(misc.notif_router, prefix=prefix)
app.include_router(misc.podcast_router, prefix=prefix)
app.include_router(misc.analytics_router, prefix=prefix)
app.include_router(misc.follow_router, prefix=prefix)
app.include_router(misc.comment_router, prefix=prefix)
app.include_router(misc.upload_router, prefix=prefix)


@app.get("/api/health")
async def health():
    return {"success": True, "service": "SSPLAY API (Python)", "timestamp": datetime.utcnow().isoformat()}


# Mount Socket.IO at root for client connection
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

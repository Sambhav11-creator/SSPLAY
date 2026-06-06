from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.dependencies import require_admin
from app.models.user import User
from app.models.artist import Artist
from app.models.history import History
from app.models.song import Song
from app.models.user import User
from app.config import settings
from app.utils.responses import success

router = APIRouter(prefix="/admin", tags=["admin"])


class ModerateBody(BaseModel):
    status: str


class RoleBody(BaseModel):
    role: str


@router.get("/dashboard")
async def dashboard(_: User = Depends(require_admin)):
    users = await User.count()
    songs = await Song.count()
    artists = await Artist.count()
    plays = await History.count()
    pending = await Song.find(Song.status == "pending").count()
    recent = await User.find().sort(-User.created_at).limit(10).to_list()
    return success({
        "stats": {"users": users, "songs": songs, "artists": artists, "plays": plays, "pending": pending},
        "recentUsers": [
            {"_id": str(u.id), "name": u.name, "email": u.email, "role": u.role, "createdAt": u.created_at.isoformat()}
            for u in recent
        ],
        "apiStatus": {
            "spotify": bool(settings.spotify_client_id),
            "deezer": True,
            "redis": bool(settings.redis_url),
            "cloudinary": bool(settings.cloudinary_cloud_name),
        },
    })


@router.patch("/songs/{song_id}")
async def moderate_song(song_id: str, body: ModerateBody, _: User = Depends(require_admin)):
    song = await Song.get(song_id)
    if song:
        song.status = body.status
        await song.save()
    return success(await song.to_dict() if song else None)


@router.patch("/users/{user_id}/role")
async def update_role(user_id: str, body: RoleBody, _: User = Depends(require_admin)):
    user = await User.get(user_id)
    if user:
        user.role = body.role
        await user.save()
    return success(user.to_public() if user else None)

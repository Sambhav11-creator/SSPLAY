from datetime import datetime

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.config import settings
from app.dependencies import get_current_user
from app.models.artist import Artist
from app.models.follow import Follow
from app.models.history import History
from app.models.notification import Notification
from app.models.playlist import Playlist
from app.models.podcast import Podcast
from app.models.queue import Queue
from app.models.song import Song
from app.models.user import User
from app.models.comment import Comment
from app.utils.responses import success

router = APIRouter(tags=["misc"])


# History (alias route)
history_router = APIRouter(prefix="/history", tags=["history"])


@history_router.get("")
async def get_history(user: User = Depends(get_current_user)):
    entries = await History.find(History.user == str(user.id)).sort(-History.played_at).limit(50).to_list()
    songs = []
    for h in entries:
        s = await Song.get(h.song)
        if s:
            songs.append(await s.to_dict())
    return success(songs)


# Queue
queue_router = APIRouter(prefix="/queue", tags=["queue"])


class QueueBody(BaseModel):
    songs: list[str] | None = None
    currentIndex: int | None = None
    shuffle: bool | None = None
    repeat: str | None = None


@queue_router.get("")
async def get_queue(user: User = Depends(get_current_user)):
    q = await Queue.find_one(Queue.user == str(user.id))
    if not q:
        q = Queue(user=str(user.id))
        await q.insert()
    songs = []
    for sid in q.songs:
        s = await Song.get(sid)
        if s:
            songs.append(await s.to_dict())
    return success({
        "_id": str(q.id),
        "songs": songs,
        "currentIndex": q.current_index,
        "shuffle": q.shuffle,
        "repeat": q.repeat,
    })


@queue_router.put("")
async def sync_queue(body: QueueBody, user: User = Depends(get_current_user)):
    q = await Queue.find_one(Queue.user == str(user.id))
    if not q:
        q = Queue(user=str(user.id))
    if body.songs is not None:
        q.songs = body.songs
    if body.currentIndex is not None:
        q.current_index = body.currentIndex
    if body.shuffle is not None:
        q.shuffle = body.shuffle
    if body.repeat is not None:
        q.repeat = body.repeat
    await q.save()
    return success({"_id": str(q.id)})


# Notifications
notif_router = APIRouter(prefix="/notifications", tags=["notifications"])


@notif_router.get("")
async def get_notifications(user: User = Depends(get_current_user)):
    items = await Notification.find(Notification.user == str(user.id)).sort(-Notification.created_at).limit(50).to_list()
    return success([
        {
            "_id": str(n.id),
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "read": n.read,
            "createdAt": n.created_at.isoformat(),
        }
        for n in items
    ])


class ReadBody(BaseModel):
    ids: list[str] = []


@notif_router.post("/read")
async def mark_read(body: ReadBody, user: User = Depends(get_current_user)):
    for nid in body.ids:
        n = await Notification.get(nid)
        if n and n.user == str(user.id):
            n.read = True
            await n.save()
    return success({"updated": True})


# Podcasts
podcast_router = APIRouter(prefix="/podcasts", tags=["podcasts"])


@podcast_router.get("")
async def get_podcasts():
    items = await Podcast.find().sort(-Podcast.subscribers).limit(30).to_list()
    return success([
        {
            "_id": str(p.id),
            "title": p.title,
            "description": p.description,
            "coverArt": p.cover_art,
            "subscribers": p.subscribers,
        }
        for p in items
    ])


# Analytics
analytics_router = APIRouter(prefix="/analytics", tags=["analytics"])


@analytics_router.get("/me")
async def user_stats(user: User = Depends(get_current_user)):
    count = await History.find(History.user == str(user.id)).count()
    return success({"totalPlays": count})


# Follow
follow_router = APIRouter(prefix="/follow", tags=["follow"])


@follow_router.post("/{target_id}")
async def follow_user(target_id: str, user: User = Depends(get_current_user)):
    if target_id == str(user.id):
        raise HTTPException(400, "Cannot follow yourself")
    existing = await Follow.find_one(Follow.follower == str(user.id), Follow.following == target_id)
    if existing:
        await existing.delete()
        target = await User.get(target_id)
        if target:
            target.followers_count = max(0, target.followers_count - 1)
            await target.save()
        user.following_count = max(0, user.following_count - 1)
        await user.save()
        return success({"following": False})
    await Follow(follower=str(user.id), following=target_id).insert()
    target = await User.get(target_id)
    if target:
        target.followers_count += 1
        await target.save()
    user.following_count += 1
    await user.save()
    await Notification(
        user=target_id,
        type="follow",
        title="New follower",
        message=f"{user.name} started following you",
    ).insert()
    return success({"following": True})


# Comments
comment_router = APIRouter(prefix="/comments", tags=["comments"])


class CommentBody(BaseModel):
    text: str
    song: str | None = None
    playlist: str | None = None


@comment_router.get("")
async def get_comments(songId: str | None = None, playlistId: str | None = None):
    query = {}
    if songId:
        query["song"] = songId
    if playlistId:
        query["playlist"] = playlistId
    items = await Comment.find(query).sort(-Comment.created_at).to_list()
    result = []
    for c in items:
        u = await User.get(c.user)
        result.append({
            "_id": str(c.id),
            "text": c.text,
            "user": u.to_public() if u else None,
            "createdAt": c.created_at.isoformat(),
        })
    return success(result)


@comment_router.post("")
async def add_comment(body: CommentBody, user: User = Depends(get_current_user)):
    c = Comment(user=str(user.id), text=body.text, song=body.song, playlist=body.playlist)
    await c.insert()
    return success({"_id": str(c.id), "text": c.text, "user": user.to_public()})


# Upload
upload_router = APIRouter(prefix="/upload", tags=["upload"])


@upload_router.post("/song")
async def upload_song(
    user: User = Depends(get_current_user),
    title: str = Form(...),
    duration: int = Form(...),
    genre: str = Form(""),
    artistName: str = Form(""),
    audioUrl: str = Form(""),
    coverArt: str = Form(""),
    audio: UploadFile | None = File(None),
    cover: UploadFile | None = File(None),
):
    artist = await Artist.find_one(Artist.name == artistName) if artistName else None
    if not artist:
        artist = Artist(name=artistName or user.name)
        await artist.insert()

    final_audio = audioUrl or None
    final_cover = coverArt or None

    if settings.cloudinary_cloud_name and audio:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
        )
        content = await audio.read()
        result = cloudinary.uploader.upload(content, resource_type="video", folder="ssplay/audio")
        final_audio = result.get("secure_url")

    song = Song(
        title=title,
        duration=duration,
        genre=genre or None,
        artist=artist,
        audio_url=final_audio,
        cover_art=final_cover,
        uploaded_by=str(user.id),
        status="approved" if user.role == "admin" else "pending",
    )
    await song.insert()
    return success(await song.to_dict())

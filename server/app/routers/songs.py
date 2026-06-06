from fastapi import APIRouter, Depends, HTTPException, Query

from app.dependencies import get_current_user, get_optional_user
from app.models.history import History
from app.models.like import Like
from app.models.song import Song
from app.models.user import User
from app.services.external import lyrics as lyrics_service
from app.utils.responses import paginated, success

router = APIRouter(prefix="/songs", tags=["songs"])


@router.get("")
async def list_songs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    genre: str | None = None,
):
    query = {"status": "approved"}
    if genre:
        query["genre"] = genre
    skip = (page - 1) * limit
    songs = await Song.find(query).sort(-Song.play_count).skip(skip).limit(limit).to_list()
    total = await Song.find(query).count()
    data = [await s.to_dict() for s in songs]
    return paginated(data, page, limit, total)


@router.get("/{song_id}/lyrics")
async def get_lyrics(song_id: str):
    song = await Song.get(song_id)
    if not song:
        raise HTTPException(404, "Song not found")
    if song.lyrics:
        return success({"lyrics": song.lyrics, "synced": [l.model_dump() for l in song.lyrics_synced]})
    artist = await song.artist.fetch()
    external = await lyrics_service.get_lyrics(song.title, artist.name if artist else "")
    return success(external or {"lyrics": None})


@router.get("/{song_id}")
async def get_song(song_id: str):
    song = await Song.get(song_id)
    if not song:
        raise HTTPException(404, "Song not found")
    return success(await song.to_dict())


@router.post("/{song_id}/play")
async def record_play(song_id: str, user: User | None = Depends(get_optional_user)):
    song = await Song.get(song_id)
    if song:
        song.play_count += 1
        await song.save()
        if user:
            await History(user=str(user.id), song=song_id).insert()
    return success({"recorded": True})


@router.post("/{song_id}/like")
async def like_song(song_id: str, user: User = Depends(get_current_user)):
    existing = await Like.find_one(Like.user == str(user.id), Like.song == song_id)
    song = await Song.get(song_id)
    if not song:
        raise HTTPException(404, "Song not found")
    if existing:
        await existing.delete()
        song.like_count = max(0, song.like_count - 1)
        await song.save()
        return success({"liked": False})
    await Like(user=str(user.id), song=song_id).insert()
    song.like_count += 1
    await song.save()
    return success({"liked": True})

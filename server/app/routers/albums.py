from fastapi import APIRouter, HTTPException

from app.models.album import Album
from app.models.song import Song
from app.utils.responses import success

router = APIRouter(prefix="/albums", tags=["albums"])


@router.get("")
async def list_albums():
    albums = await Album.find().limit(30).to_list()
    result = []
    for a in albums:
        artist = await a.artist.fetch()
        result.append({
            "_id": str(a.id),
            "title": a.title,
            "coverArt": a.cover_art,
            "artist": artist.to_dict() if artist else None,
        })
    return success(result)


@router.get("/{album_id}")
async def get_album(album_id: str):
    album = await Album.get(album_id)
    if not album:
        raise HTTPException(404, "Album not found")
    artist = await album.artist.fetch()
    songs = []
    for sid in album.songs:
        s = await Song.get(sid)
        if s:
            songs.append(await s.to_dict())
    return success({
        "_id": str(album.id),
        "title": album.title,
        "coverArt": album.cover_art,
        "artist": artist.to_dict() if artist else None,
        "songs": songs,
    })

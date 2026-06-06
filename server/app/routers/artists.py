from fastapi import APIRouter, HTTPException

from app.models.artist import Artist
from app.models.song import Song
from app.utils.responses import success

router = APIRouter(prefix="/artists", tags=["artists"])


@router.get("")
async def list_artists():
    artists = await Artist.find().sort(-Artist.monthly_listeners).limit(40).to_list()
    return success([a.to_dict() for a in artists])


@router.get("/{artist_id}")
async def get_artist(artist_id: str):
    from beanie import PydanticObjectId

    artist = None
    try:
        artist = await Artist.get(PydanticObjectId(artist_id))
    except Exception:
        artist = await Artist.find_one(Artist.slug == artist_id)
    if not artist:
        raise HTTPException(404, "Artist not found")
    songs = await Song.find({"artist.$id": artist.id, "status": "approved"}).sort("-play_count").to_list()
    return success({"artist": artist.to_dict(), "songs": [await s.to_dict() for s in songs]})

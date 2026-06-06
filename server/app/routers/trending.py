from fastapi import APIRouter, Query

from app.models.song import Song
from app.services.external import lastfm
from app.utils.responses import success

router = APIRouter(prefix="/trending", tags=["trending"])


@router.get("")
async def trending(limit: int = Query(20)):
    songs = await Song.find({"status": "approved"}).sort("-play_count").limit(limit).to_list()
    local = [await s.to_dict() for s in songs]
    external = await lastfm.get_top_tracks(10)
    return success({"local": local, "external": external})

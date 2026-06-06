from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.dependencies import get_current_user, get_optional_user
from app.models.playlist import Playlist
from app.models.song import Song
from app.models.user import User
from app.utils.responses import success

router = APIRouter(prefix="/playlists", tags=["playlists"])


class PlaylistBody(BaseModel):
    name: str
    description: str | None = None
    coverArt: str | None = None
    isPublic: bool = True


class AddSongBody(BaseModel):
    songId: str


@router.get("")
async def list_playlists(mine: bool = False, user: User | None = Depends(get_optional_user)):
    if mine and user:
        playlists = await Playlist.find(Playlist.owner == str(user.id)).to_list()
    else:
        playlists = await Playlist.find(Playlist.is_public == True).limit(50).to_list()
    result = []
    for p in playlists:
        owner = await User.get(p.owner)
        result.append({
            "_id": str(p.id),
            "name": p.name,
            "description": p.description,
            "coverArt": p.cover_art,
            "owner": owner.to_public() if owner else None,
        })
    return success(result)


@router.get("/{playlist_id}")
async def get_playlist(playlist_id: str):
    playlist = await Playlist.get(playlist_id)
    if not playlist:
        raise HTTPException(404, "Playlist not found")
    owner = await User.get(playlist.owner)
    songs = []
    for sid in playlist.songs:
        s = await Song.get(sid)
        if s:
            songs.append(await s.to_dict())
    return success({
        "_id": str(playlist.id),
        "name": playlist.name,
        "description": playlist.description,
        "coverArt": playlist.cover_art,
        "owner": owner.to_public() if owner else None,
        "songs": songs,
    })


@router.post("")
async def create_playlist(body: PlaylistBody, user: User = Depends(get_current_user)):
    p = Playlist(
        name=body.name,
        description=body.description,
        cover_art=body.coverArt,
        owner=str(user.id),
        is_public=body.isPublic,
    )
    await p.insert()
    return success({"_id": str(p.id), **body.model_dump()})


@router.post("/{playlist_id}/songs")
async def add_song(playlist_id: str, body: AddSongBody, user: User = Depends(get_current_user)):
    playlist = await Playlist.get(playlist_id)
    if not playlist or playlist.owner != str(user.id):
        raise HTTPException(404, "Not found")
    if body.songId not in playlist.songs:
        playlist.songs.append(body.songId)
        await playlist.save()
    return success({"_id": str(playlist.id), "songs": playlist.songs})

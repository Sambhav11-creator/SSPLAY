from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.models.history import History
from app.models.like import Like
from app.models.song import Song
from app.models.user import User
from app.utils.responses import success

router = APIRouter(prefix="/users", tags=["users"])


class UpdateProfileBody(BaseModel):
    name: str | None = None
    bio: str | None = None
    avatar: str | None = None


@router.put("/me")
async def update_me(body: UpdateProfileBody, user: User = Depends(get_current_user)):
    if body.name:
        user.name = body.name
    if body.bio is not None:
        user.bio = body.bio
    if body.avatar is not None:
        user.avatar = body.avatar
    await user.save()
    return success(user.to_public())


@router.get("/me/liked")
async def liked_songs(user: User = Depends(get_current_user)):
    likes = await Like.find(Like.user == str(user.id)).to_list()
    songs = []
    for like in likes:
        s = await Song.get(like.song)
        if s:
            songs.append(await s.to_dict())
    return success(songs)


@router.get("/me/history")
async def history(user: User = Depends(get_current_user)):
    entries = await History.find(History.user == str(user.id)).sort(-History.played_at).limit(50).to_list()
    songs = []
    for h in entries:
        s = await Song.get(h.song)
        if s:
            songs.append(await s.to_dict())
    return success(songs)


@router.get("/{user_id}")
async def get_profile(user_id: str):
    user = await User.get(user_id)
    if not user:
        raise HTTPException(404, "User not found")
    return success(user.to_public())

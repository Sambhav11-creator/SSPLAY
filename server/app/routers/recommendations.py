from fastapi import APIRouter, Depends, Query

from app.dependencies import get_optional_user
from app.models.user import User
from app.services import recommendations as rec
from app.utils.responses import success

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/for-you")
async def for_you(user: User | None = Depends(get_optional_user), limit: int = Query(20)):
    uid = str(user.id) if user else None
    songs = await rec.get_recommendations(uid, limit)
    return success(songs)


@router.get("/discover-weekly")
async def discover_weekly(user: User | None = Depends(get_optional_user)):
    uid = str(user.id) if user else None
    return success(await rec.discover_weekly(uid))


@router.get("/because-you-listened")
async def because_you_listened(user: User | None = Depends(get_optional_user)):
    uid = str(user.id) if user else None
    return success(await rec.because_you_listened(uid))

from fastapi import APIRouter, HTTPException, Query

from app.services.streaming_resolver import resolve_stream
from app.utils.responses import success

router = APIRouter(prefix="/stream", tags=["stream"])


@router.get("")
async def get_stream(
    songId: str | None = Query(None),
    source: str | None = Query(None),
    externalId: str | None = Query(None),
):
    stream = await resolve_stream(songId, source, externalId)
    if not stream:
        raise HTTPException(404, "Stream unavailable")
    return success(stream)

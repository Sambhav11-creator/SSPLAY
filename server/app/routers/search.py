from fastapi import APIRouter, Query

from app.services.search_aggregator import unified_search
from app.utils.responses import success

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
async def search(q: str = Query(""), limit: int = 20, page: int = 1):
    if not q.strip():
        return success({"local": [], "external": [], "combined": []})
    result = await unified_search(q, limit, page)
    return success(result)

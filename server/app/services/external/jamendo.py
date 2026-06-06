import httpx

from app.config import settings
from app.services.cache import cache_get, cache_set


async def search(query: str, limit: int = 10) -> list:
    if not settings.jamendo_client_id:
        return []
    key = f"jamendo:search:{query}:{limit}"
    cached = await cache_get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://api.jamendo.com/v3.0/tracks",
                params={
                    "client_id": settings.jamendo_client_id,
                    "format": "json",
                    "limit": limit,
                    "namesearch": query,
                },
            )
            items = res.json().get("results", [])
        tracks = [
            {
                "id": t["id"],
                "title": t["name"],
                "artist": t["artist_name"],
                "coverArt": t.get("image"),
                "duration": t.get("duration"),
                "audioUrl": t.get("audio"),
                "source": "jamendo",
                "externalIds": {"jamendo": t["id"]},
            }
            for t in items
        ]
        await cache_set(key, tracks, 600)
        return tracks
    except Exception:
        return []

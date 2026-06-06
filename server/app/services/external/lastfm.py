import httpx

from app.config import settings
from app.services.cache import cache_get, cache_set


async def get_top_tracks(limit: int = 20) -> list:
    if not settings.lastfm_api_key:
        return []
    key = f"lastfm:top:{limit}"
    cached = await cache_get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://ws.audioscrobbler.com/2.0/",
                params={
                    "method": "chart.gettoptracks",
                    "api_key": settings.lastfm_api_key,
                    "format": "json",
                    "limit": limit,
                },
            )
            items = res.json().get("tracks", {}).get("track", [])
        tracks = [
            {
                "title": t["name"],
                "artist": t.get("artist", {}).get("name"),
                "playCount": int(t.get("playcount", 0)),
                "source": "lastfm",
            }
            for t in items
        ]
        await cache_set(key, tracks, 900)
        return tracks
    except Exception:
        return []

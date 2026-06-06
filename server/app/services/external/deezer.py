import httpx

from app.services.cache import cache_get, cache_set


async def search(query: str, limit: int = 10) -> list:
    key = f"deezer:search:{query}:{limit}"
    cached = await cache_get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get("https://api.deezer.com/search", params={"q": query, "limit": limit})
            items = res.json().get("data", [])
        tracks = [
            {
                "id": str(t["id"]),
                "title": t["title"],
                "artist": t.get("artist", {}).get("name"),
                "album": t.get("album", {}).get("title"),
                "coverArt": t.get("album", {}).get("cover_medium"),
                "duration": t["duration"],
                "previewUrl": t.get("preview"),
                "source": "deezer",
                "externalIds": {"deezer": str(t["id"])},
            }
            for t in items
        ]
        await cache_set(key, tracks, 600)
        return tracks
    except Exception:
        return []

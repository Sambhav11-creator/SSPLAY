import httpx

from app.config import settings
from app.services.cache import cache_get, cache_set


async def search(query: str, limit: int = 10) -> list:
    key = f"audius:search:{query}:{limit}"
    cached = await cache_get(key)
    if cached:
        return cached
    base = settings.audius_api_url
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{base}/v1/full/search",
                params={"query": query, "kind": "tracks", "limit": limit},
            )
            items = res.json().get("data", {}).get("tracks", [])
        tracks = [
            {
                "id": t["id"],
                "title": t["title"],
                "artist": t.get("user", {}).get("name"),
                "coverArt": t.get("artwork", {}).get("150x150"),
                "duration": t.get("duration"),
                "audioUrl": f"{base}/v1/tracks/{t['id']}/stream",
                "source": "audius",
                "externalIds": {"audius": t["id"]},
            }
            for t in items
        ]
        await cache_set(key, tracks, 600)
        return tracks
    except Exception:
        return []

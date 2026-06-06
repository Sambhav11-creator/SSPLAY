import base64
import time

import httpx

from app.config import settings
from app.services.cache import cache_get, cache_set

_token: dict = {"value": None, "expires": 0}


async def _get_token() -> str | None:
    global _token
    if _token["value"] and time.time() < _token["expires"]:
        return _token["value"]
    if not settings.spotify_client_id or not settings.spotify_client_secret:
        return None
    auth = base64.b64encode(
        f"{settings.spotify_client_id}:{settings.spotify_client_secret}".encode()
    ).decode()
    async with httpx.AsyncClient() as client:
        res = await client.post(
            "https://accounts.spotify.com/api/token",
            data={"grant_type": "client_credentials"},
            headers={"Authorization": f"Basic {auth}"},
        )
        data = res.json()
    _token = {"value": data["access_token"], "expires": time.time() + data["expires_in"] - 60}
    return _token["value"]


async def search(query: str, limit: int = 10) -> list:
    key = f"spotify:search:{query}:{limit}"
    cached = await cache_get(key)
    if cached:
        return cached
    token = await _get_token()
    if not token:
        return []
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "https://api.spotify.com/v1/search",
            params={"q": query, "type": "track", "limit": limit},
            headers={"Authorization": f"Bearer {token}"},
        )
        items = res.json().get("tracks", {}).get("items", [])
    tracks = [
        {
            "id": t["id"],
            "title": t["name"],
            "artist": ", ".join(a["name"] for a in t.get("artists", [])),
            "album": t.get("album", {}).get("name"),
            "coverArt": (t.get("album", {}).get("images") or [{}])[0].get("url"),
            "duration": t["duration_ms"] // 1000,
            "previewUrl": t.get("preview_url"),
            "source": "spotify",
            "externalIds": {"spotify": t["id"]},
        }
        for t in items
    ]
    await cache_set(key, tracks, 600)
    return tracks

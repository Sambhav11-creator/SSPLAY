import httpx

from app.config import settings
from app.services.cache import cache_get, cache_set


async def get_lyrics(title: str, artist: str) -> dict | None:
    mx = await _musixmatch(title, artist)
    if mx:
        return mx
    return await _genius(title, artist)


async def _musixmatch(title: str, artist: str) -> dict | None:
    if not settings.musixmatch_api_key:
        return None
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://api.musixmatch.com/ws/1.1/matcher.lyrics.get",
                params={"apikey": settings.musixmatch_api_key, "q_track": title, "q_artist": artist},
            )
            body = res.json().get("message", {}).get("body", {})
            text = body.get("lyrics", {}).get("lyrics_body")
            if text:
                return {"lyrics": text.split("*******")[0].strip()}
    except Exception:
        pass
    return None


async def _genius(title: str, artist: str) -> dict | None:
    if not settings.genius_access_token:
        return None
    key = f"genius:{title}:{artist}"
    cached = await cache_get(key)
    if cached:
        return cached
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                "https://api.genius.com/search",
                params={"q": f"{title} {artist}"},
                headers={"Authorization": f"Bearer {settings.genius_access_token}"},
            )
            hit = res.json().get("response", {}).get("hits", [{}])[0].get("result")
            if hit:
                result = {"lyricsUrl": hit["url"], "title": hit["title"]}
                await cache_set(key, result, 3600)
                return result
    except Exception:
        pass
    return None

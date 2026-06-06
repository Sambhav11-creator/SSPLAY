import httpx

from app.config import settings
from app.models.song import Song
from app.services import external
from app.services.cache import cache_get, cache_set


async def resolve_stream(song_id: str | None = None, source: str | None = None, external_id: str | None = None) -> dict | None:
    key = f"stream:{source}:{song_id or external_id}"
    cached = await cache_get(key)
    if cached:
        return cached

    if song_id:
        song = await Song.get(song_id)
        if song:
            artist = await song.artist.fetch()
            if song.source == "jiosaavn" and not song.audio_url:
                jio_id = song.external_ids.get("jiosaavn")
                if not jio_id:
                    artist_name = artist.name if artist else ""
                    search_res = await external.jiosaavn.search(f"{song.title} {artist_name}", 1)
                    if search_res:
                        jio_id = search_res[0]["id"]
                if jio_id:
                    resolved = await resolve_stream(source="jiosaavn", external_id=jio_id)
                    if resolved:
                        await cache_set(key, resolved, 300)
                        return resolved

            if song.hls_url or song.audio_url:
                result = {
                    "url": song.hls_url or song.audio_url,
                    "type": "hls" if song.hls_url else "audio",
                    "title": song.title,
                    "artist": artist.name if artist else None,
                    "coverArt": song.cover_art,
                    "videoUrl": song.video_url,
                    "duration": song.duration,
                    "lyrics": song.lyrics,
                }
                await cache_set(key, result, 120)
                return result

    if source == "deezer" and external_id:
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(f"https://api.deezer.com/track/{external_id}")
                t = res.json()
            result = {
                "url": t.get("preview"),
                "type": "audio",
                "title": t.get("title"),
                "artist": t.get("artist", {}).get("name"),
                "coverArt": t.get("album", {}).get("cover_medium"),
                "duration": t.get("duration"),
            }
            await cache_set(key, result, 120)
            return result
        except Exception:
            pass

    if source == "audius" and external_id:
        base = settings.audius_api_url
        result = {"url": f"{base}/v1/tracks/{external_id}/stream", "type": "audio"}
        await cache_set(key, result, 120)
        return result

    if source == "jamendo" and external_id and settings.jamendo_client_id:
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    "https://api.jamendo.com/v3.0/tracks/file",
                    params={"client_id": settings.jamendo_client_id, "id": external_id},
                )
                track = (res.json().get("results") or [None])[0]
            if track and track.get("audio"):
                result = {"url": track["audio"], "type": "audio", "title": track.get("name")}
                await cache_set(key, result, 120)
                return result
        except Exception:
            pass

    if source == "jiosaavn" and external_id:
        try:
            resolved = await external.jiosaavn.get_song_details(external_id)
            if resolved:
                await cache_set(key, resolved, 120)
                return resolved
        except Exception:
            pass

    fallback = await external.audius.search(external_id or "", 1)
    if fallback and fallback[0].get("audioUrl"):
        return {"url": fallback[0]["audioUrl"], "type": "audio", **fallback[0]}
    return None

import asyncio
import re

from beanie import PydanticObjectId

from app.models.song import Song
from app.services import external
from app.services.cache import cache_get, cache_set


def _dedupe_key(t: dict) -> str:
    title = (t.get("title") or "").lower()
    artist = (t.get("artist") or "").lower()
    if isinstance(artist, dict):
        artist = artist.get("name", "").lower()
    return re.sub(r"\s+", " ", f"{title}|{artist}")


def _merge(arrays: list[list]) -> list:
    seen, merged = set(), []
    for arr in arrays:
        for item in arr:
            k = _dedupe_key(item)
            if k not in seen:
                seen.add(k)
                merged.append(item)
    return merged


async def unified_search(query: str, limit: int = 20, page: int = 1) -> dict:
    key = f"unified:search:{query}:{limit}:{page}"
    cached = await cache_get(key)
    if cached:
        return cached

    skip = (page - 1) * limit
    local_songs = await Song.find(
        {"title": {"$regex": query, "$options": "i"}, "status": "approved"}
    ).skip(skip).limit(limit).to_list()

    jiosaavn_res, spotify_res, deezer_res, audius_res, jamendo_res = await asyncio.gather(
        external.jiosaavn.search(query, limit),
        external.spotify.search(query, limit),
        external.deezer.search(query, limit),
        external.audius.search(query, limit),
        external.jamendo.search(query, limit),
    )

    local_formatted = []
    for s in local_songs:
        d = await s.to_dict()
        local_formatted.append(d)

    external_merged = _merge([jiosaavn_res, spotify_res, deezer_res, audius_res, jamendo_res])
    result = {
        "local": local_formatted,
        "external": external_merged[:limit],
        "combined": _merge([local_formatted, external_merged])[: limit * 2],
        "query": query,
    }
    await cache_set(key, result, 180)
    return result

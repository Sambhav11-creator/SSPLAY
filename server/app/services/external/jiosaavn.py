import base64
import httpx
from pyDes import des, ECB, PAD_PKCS5
from app.services.cache import cache_get, cache_set

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
}

def clean_image_url(url: str) -> str:
    if not url:
        return ""
    # Replace 150x150 with 500x500 to get high resolution artwork
    url = url.replace("150x150", "500x500")
    if url.startswith("http:"):
        url = url.replace("http:", "https:")
    return url


def decrypt_url(enc_url: str) -> str:
    if not enc_url:
        return ""
    try:
        key = des(b"38346591", ECB, b"\0\0\0\0\0\0\0\0", pad=None, padmode=PAD_PKCS5)
        enc_data = base64.b64decode(enc_url.strip())
        decrypted = key.decrypt(enc_data)
        dec_str = decrypted.decode('utf-8').strip()
        # Upgrade quality suffix to 320kbps
        if "_96.mp4" in dec_str:
            dec_str = dec_str.replace("_96.mp4", "_320.mp4")
        elif "_160.mp4" in dec_str:
            dec_str = dec_str.replace("_160.mp4", "_320.mp4")
        elif "_48.mp4" in dec_str:
            dec_str = dec_str.replace("_48.mp4", "_320.mp4")
        if dec_str.startswith("http:"):
            dec_str = dec_str.replace("http:", "https:")
        return dec_str
    except Exception:
        return ""


async def search(query: str, limit: int = 10) -> list:
    key = f"jiosaavn:search:{query}:{limit}"
    cached = await cache_get(key)
    if cached:
        return cached

    url = "https://www.jiosaavn.com/api.php"
    params = {
        "__call": "search.getResults",
        "q": query,
        "_format": "json",
        "_marker": "0",
        "ctx": "web6s",
        "api_version": "4",
        "n": limit,
    }

    tracks = []
    try:
        async with httpx.AsyncClient(headers=HEADERS) as client:
            res = await client.get(url, params=params, timeout=6.0)
            if res.status_code == 200:
                data = res.json()
                results = data.get("results") or []
                for t in results:
                    more_info = t.get("more_info") or {}

                    # Parse artist names
                    artist_names = []
                    artist_map = more_info.get("artistMap") or {}
                    for a in artist_map.get("primary_artists", []):
                        artist_names.append(a.get("name"))
                    for a in artist_map.get("featured_artists", []):
                        artist_names.append(a.get("name"))
                    artist = ", ".join([x for x in artist_names if x]) or t.get("subtitle", "Unknown Artist")

                    enc_url = more_info.get("encrypted_media_url")
                    dec_url = decrypt_url(enc_url)

                    tracks.append(
                        {
                            "id": str(t["id"]),
                            "title": t.get("title", "Unknown Title"),
                            "artist": artist,
                            "album": more_info.get("album", "Single"),
                            "coverArt": clean_image_url(t.get("image")),
                            "duration": int(more_info.get("duration") or 0),
                            "previewUrl": dec_url,
                            "source": "jiosaavn",
                            "externalIds": {"jiosaavn": str(t["id"])},
                        }
                    )
    except Exception as e:
        print(f"JioSaavn search error for query '{query}': {e}")

    await cache_set(key, tracks, 600)
    return tracks


async def get_song_details(song_id: str) -> dict | None:
    url = "https://www.jiosaavn.com/api.php"
    params = {
        "__call": "song.getDetails",
        "pids": song_id,
        "_format": "json",
        "_marker": "0",
        "ctx": "web6s",
        "api_version": "4",
    }
    try:
        async with httpx.AsyncClient(headers=HEADERS) as client:
            res = await client.get(url, params=params, timeout=6.0)
            if res.status_code == 200:
                data = res.json()
                song_details = data.get(song_id)
                if not song_details and isinstance(data, list) and len(data) > 0:
                    song_details = data[0]
                elif not song_details and isinstance(data, dict):
                    song_details = list(data.values())[0] if data else {}

                if song_details:
                    more_info = song_details.get("more_info") or {}
                    enc_url = more_info.get("encrypted_media_url")
                    dec_url = decrypt_url(enc_url)

                    artist_names = []
                    artist_map = more_info.get("artistMap") or {}
                    for a in artist_map.get("primary_artists", []):
                        artist_names.append(a.get("name"))
                    for a in artist_map.get("featured_artists", []):
                        artist_names.append(a.get("name"))
                    artist = ", ".join([x for x in artist_names if x]) or song_details.get("subtitle", "Unknown Artist")

                    return {
                        "url": dec_url,
                        "type": "audio",
                        "title": song_details.get("title"),
                        "artist": artist,
                        "coverArt": clean_image_url(song_details.get("image")),
                        "duration": int(more_info.get("duration") or 0),
                    }
    except Exception as e:
        print(f"JioSaavn get_song_details error for {song_id}: {e}")
    return None

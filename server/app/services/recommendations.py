from collections import Counter

from app.models.history import History
from app.models.song import Song
from app.models.user import User


async def get_recommendations(user_id: str | None = None, limit: int = 20) -> list:
    genre_weights: Counter = Counter()

    if user_id:
        history = await History.find(History.user == user_id).sort("-played_at").limit(50).to_list()
        for h in history:
            song = await Song.get(h.song)
            if song and song.genre:
                genre_weights[song.genre] += 1
        user = await User.get(user_id)
        if user:
            for g in user.preferences.genres:
                genre_weights[g] += 2

    top_genres = [g for g, _ in genre_weights.most_common(3)]
    if top_genres:
        songs = await Song.find({"genre": {"$in": top_genres}, "status": "approved"}).sort("-play_count").limit(limit).to_list()
    else:
        songs = await Song.find({"status": "approved"}).sort("-play_count").limit(limit).to_list()

    if len(songs) < limit:
        existing = {str(s.id) for s in songs}
        extra = await Song.find({"status": "approved"}).sort("-created_at").limit(limit * 2).to_list()
        for s in extra:
            if str(s.id) not in existing:
                songs.append(s)
            if len(songs) >= limit:
                break

    return [await s.to_dict() for s in songs]


async def discover_weekly(user_id: str | None = None) -> list:
    return await get_recommendations(user_id, 30)


async def because_you_listened(user_id: str | None) -> list:
    if not user_id:
        return await get_recommendations(user_id)
    last = await History.find(History.user == user_id).sort("-played_at").first_or_none()
    if not last:
        return await get_recommendations(user_id)
    song = await Song.get(last.song)
    if not song or not song.genre:
        return await get_recommendations(user_id)
    songs = await Song.find(
        {"genre": song.genre, "status": "approved"}
    ).sort("-play_count").limit(15).to_list()
    return [await s.to_dict() for s in songs if str(s.id) != str(song.id)]

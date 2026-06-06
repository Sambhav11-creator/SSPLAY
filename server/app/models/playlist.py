from datetime import datetime

from beanie import Document
from pydantic import Field


class Playlist(Document):
    name: str
    description: str | None = None
    cover_art: str | None = None
    owner: str
    songs: list[str] = []
    is_public: bool = True
    is_collaborative: bool = False
    followers: list[str] = []
    play_count: int = 0
    genre: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "playlists"

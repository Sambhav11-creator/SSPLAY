from datetime import datetime

from beanie import Document
from pydantic import BaseModel, Field


class Episode(BaseModel):
    title: str
    audio_url: str | None = None
    duration: int | None = None
    published_at: datetime | None = None


class Podcast(Document):
    title: str
    description: str | None = None
    host: str | None = None
    cover_art: str | None = None
    category: str | None = None
    episodes: list[Episode] = []
    subscribers: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "podcasts"

from datetime import datetime
from typing import Literal

from beanie import Document, Link
from pydantic import Field
from slugify import slugify

from app.models.artist import Artist


class Album(Document):
    title: str
    slug: str | None = None
    artist: Link[Artist]
    cover_art: str | None = None
    release_date: datetime | None = None
    genre: str | None = None
    type: Literal["album", "single", "ep"] = "album"
    songs: list[str] = []
    total_duration: int = 0
    play_count: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "albums"

    async def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{datetime.utcnow().timestamp()}")
        return await super().save(*args, **kwargs)

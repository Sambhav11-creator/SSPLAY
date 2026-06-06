from datetime import datetime
from typing import Literal

from beanie import Document, Link
from pydantic import BaseModel, Field
from slugify import slugify

from app.models.artist import Artist


class LyricsLine(BaseModel):
    time: float
    text: str


class Song(Document):
    title: str
    slug: str | None = None
    artist: Link[Artist]
    album: str | None = None
    duration: int
    genre: str | None = None
    cover_art: str | None = None
    audio_url: str | None = None
    video_url: str | None = None
    hls_url: str | None = None
    lyrics: str | None = None
    lyrics_synced: list[LyricsLine] = []
    is_explicit: bool = False
    play_count: int = 0
    like_count: int = 0
    uploaded_by: str | None = None
    status: Literal["pending", "approved", "rejected"] = "approved"
    external_ids: dict = Field(default_factory=dict)
    source: str = "local"
    waveform_peaks: list[float] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "songs"

    async def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.id or 'new'}")
        return await super().save(*args, **kwargs)

    async def to_dict(self, with_artist=True):
        artist = await self.artist.fetch() if with_artist else None
        return {
            "_id": str(self.id),
            "title": self.title,
            "slug": self.slug,
            "artist": artist.to_dict() if artist else None,
            "album": self.album,
            "duration": self.duration,
            "genre": self.genre,
            "coverArt": self.cover_art,
            "audioUrl": self.audio_url,
            "videoUrl": self.video_url,
            "hlsUrl": self.hls_url,
            "lyrics": self.lyrics,
            "playCount": self.play_count,
            "likeCount": self.like_count,
            "status": self.status,
            "source": self.source,
            "externalIds": self.external_ids,
        }

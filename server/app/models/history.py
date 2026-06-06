from datetime import datetime

from beanie import Document
from pydantic import Field


class History(Document):
    user: str
    song: str
    played_at: datetime = Field(default_factory=datetime.utcnow)
    duration_played: int | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "histories"

from datetime import datetime

from beanie import Document
from pydantic import Field


class Comment(Document):
    user: str
    song: str | None = None
    playlist: str | None = None
    text: str
    likes: list[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "comments"

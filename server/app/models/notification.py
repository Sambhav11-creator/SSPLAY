from datetime import datetime
from typing import Literal

from beanie import Document
from pydantic import Field


class Notification(Document):
    user: str
    type: Literal["like", "follow", "comment", "playlist", "release", "system", "premium"]
    title: str | None = None
    message: str | None = None
    link: str | None = None
    read: bool = False
    metadata: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"

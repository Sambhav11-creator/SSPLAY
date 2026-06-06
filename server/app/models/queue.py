from datetime import datetime
from typing import Literal

from beanie import Document
from pydantic import Field


class Queue(Document):
    user: str
    songs: list[str] = []
    current_index: int = 0
    shuffle: bool = False
    repeat: Literal["off", "one", "all"] = "off"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "queues"

from datetime import datetime

from beanie import Document
from pydantic import Field


class Like(Document):
    user: str
    song: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "likes"

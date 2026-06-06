from datetime import datetime

from beanie import Document
from pydantic import Field


class Follow(Document):
    follower: str
    following: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "follows"

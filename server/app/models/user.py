from datetime import datetime
from typing import Literal

from beanie import Document, Link
from pydantic import BaseModel, EmailStr, Field


class UserPreferences(BaseModel):
    genres: list[str] = []
    crossfade: int = 0
    playback_speed: float = 1.0
    theme: str = "dark"


class User(Document):
    name: str
    email: EmailStr
    password: str | None = None
    avatar: str | None = None
    bio: str | None = None
    role: Literal["user", "artist", "admin"] = "user"
    is_premium: bool = False
    is_verified: bool = False
    oauth_provider: str | None = None
    oauth_id: str | None = None
    followers_count: int = 0
    following_count: int = 0
    preferences: UserPreferences = Field(default_factory=UserPreferences)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"

    def to_public(self):
        return {
            "id": str(self.id),
            "_id": str(self.id),
            "name": self.name,
            "email": self.email,
            "avatar": self.avatar,
            "bio": self.bio,
            "role": self.role,
            "isPremium": self.is_premium,
            "isVerified": self.is_verified,
            "preferences": self.preferences.model_dump(),
        }

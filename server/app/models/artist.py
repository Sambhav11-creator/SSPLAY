from datetime import datetime

from beanie import Document
from pydantic import Field
from slugify import slugify


class Artist(Document):
    name: str
    slug: str | None = None
    bio: str | None = None
    image: str | None = None
    banner: str | None = None
    genres: list[str] = []
    monthly_listeners: int = 0
    verified: bool = False
    external_ids: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "artists"

    async def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return await super().save(*args, **kwargs)

    def to_dict(self):
        return {
            "_id": str(self.id),
            "name": self.name,
            "slug": self.slug,
            "bio": self.bio,
            "image": self.image,
            "banner": self.banner,
            "genres": self.genres,
            "monthlyListeners": self.monthly_listeners,
            "verified": self.verified,
        }

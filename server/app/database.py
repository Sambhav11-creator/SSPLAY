from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings
from app.models.album import Album
from app.models.artist import Artist
from app.models.comment import Comment
from app.models.follow import Follow
from app.models.history import History
from app.models.like import Like
from app.models.notification import Notification
from app.models.playlist import Playlist
from app.models.podcast import Podcast
from app.models.queue import Queue
from app.models.song import Song
from app.models.subscription import Subscription
from app.models.user import User

client: AsyncIOMotorClient | None = None

DOCUMENTS = [
    User,
    Artist,
    Album,
    Song,
    Playlist,
    Like,
    Comment,
    Follow,
    Notification,
    History,
    Queue,
    Podcast,
    Subscription,
]


async def connect_db():
    global client
    client = AsyncIOMotorClient(settings.mongodb_uri)
    await init_beanie(database=client.get_default_database(), document_models=DOCUMENTS)


async def close_db():
    if client:
        client.close()

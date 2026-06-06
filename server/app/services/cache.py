import json
from typing import Any

import redis

from app.config import settings

_memory: dict[str, tuple[Any, float]] = {}
_redis_client: redis.Redis | None = None


def get_redis():
    global _redis_client
    if _redis_client is None and settings.redis_url:
        try:
            _redis_client = redis.from_url(settings.redis_url, decode_responses=True)
            _redis_client.ping()
        except Exception:
            _redis_client = None
    return _redis_client


async def cache_get(key: str) -> Any | None:
    r = get_redis()
    if r:
        val = r.get(key)
        if val:
            return json.loads(val)
    return _memory.get(key, (None,))[0] if key in _memory else None


async def cache_set(key: str, value: Any, ttl: int = 300):
    r = get_redis()
    if r:
        r.setex(key, ttl, json.dumps(value, default=str))
    _memory[key] = (value, ttl)

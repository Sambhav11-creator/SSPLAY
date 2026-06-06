from datetime import datetime
from typing import Literal

from beanie import Document
from pydantic import Field


class Subscription(Document):
    user: str
    plan: Literal["free", "premium", "family"] = "free"
    status: Literal["active", "cancelled", "expired"] = "active"
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: datetime | None = None
    stripe_customer_id: str | None = None
    amount: float | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "subscriptions"

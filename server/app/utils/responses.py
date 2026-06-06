from typing import Any


def success(data: Any, **meta):
    return {"success": True, "data": data, **meta}


def paginated(data: list, page: int, limit: int, total: int):
    return {
        "success": True,
        "data": data,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "pages": max(1, (total + limit - 1) // limit),
        },
    }

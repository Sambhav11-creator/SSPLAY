"""OAuth providers via Authlib (Google OpenID + GitHub)."""

from authlib.integrations.starlette_client import OAuth
from fastapi import HTTPException, Request
from starlette.responses import RedirectResponse

from app.config import settings
from app.models.user import User
from app.utils.security import create_access_token

oauth = OAuth()
GOOGLE_ENABLED = bool(settings.google_client_id and settings.google_client_secret)
GITHUB_ENABLED = bool(settings.github_client_id and settings.github_client_secret)

if GOOGLE_ENABLED:
    oauth.register(
        name="google",
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

if GITHUB_ENABLED:
    oauth.register(
        name="github",
        client_id=settings.github_client_id,
        client_secret=settings.github_client_secret,
        access_token_url="https://github.com/login/oauth/access_token",
        access_token_params=None,
        authorize_url="https://github.com/login/oauth/authorize",
        authorize_params=None,
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "user:email"},
    )


def providers_enabled() -> dict[str, bool]:
    return {"google": GOOGLE_ENABLED, "github": GITHUB_ENABLED}


def _google_callback_uri() -> str:
    return settings.google_callback_url or "http://localhost:5000/api/auth/google/callback"


def _github_callback_uri() -> str:
    return settings.github_callback_url or "http://localhost:5000/api/auth/github/callback"


async def upsert_oauth_user(
    *,
    provider: str,
    oauth_id: str,
    email: str | None,
    name: str,
    avatar: str | None = None,
) -> User:
    safe_email = email or f"{oauth_id}@{provider}.oauth"
    user = await User.find_one(
        {"$or": [{"email": safe_email}, {"oauth_id": oauth_id, "oauth_provider": provider}]}
    )
    if user:
        if avatar and not user.avatar:
            user.avatar = avatar
        if not user.is_verified:
            user.is_verified = True
        await user.save()
        return user

    user = User(
        name=name,
        email=safe_email,
        oauth_provider=provider,
        oauth_id=oauth_id,
        avatar=avatar,
        is_verified=True,
    )
    await user.insert()
    return user


async def redirect_oauth_login(request: Request, provider: str) -> RedirectResponse:
    if provider == "google":
        if not GOOGLE_ENABLED:
            raise HTTPException(503, "Google OAuth is not configured")
        return await oauth.google.authorize_redirect(request, _google_callback_uri())
    if provider == "github":
        if not GITHUB_ENABLED:
            raise HTTPException(503, "GitHub OAuth is not configured")
        return await oauth.github.authorize_redirect(request, _github_callback_uri())
    raise HTTPException(404, "Unknown provider")


async def handle_oauth_callback(request: Request, provider: str) -> RedirectResponse:
    client_url = settings.client_url.rstrip("/")

    try:
        if provider == "google":
            if not GOOGLE_ENABLED:
                raise HTTPException(503, "Google OAuth is not configured")
            token = await oauth.google.authorize_access_token(request)
            user_info = token.get("userinfo")
            if not user_info:
                user_info = await oauth.google.parse_id_token(request, token)
            user = await upsert_oauth_user(
                provider="google",
                oauth_id=str(user_info.get("sub")),
                email=user_info.get("email"),
                name=user_info.get("name") or "SSPLAY User",
                avatar=user_info.get("picture"),
            )
        elif provider == "github":
            if not GITHUB_ENABLED:
                raise HTTPException(503, "GitHub OAuth is not configured")
            token = await oauth.github.authorize_access_token(request)
            resp = await oauth.github.get("user", token=token)
            profile = resp.json()
            email = profile.get("email")
            if not email:
                emails_resp = await oauth.github.get("user/emails", token=token)
                emails = emails_resp.json()
                primary = next((e for e in emails if e.get("primary")), None)
                email = primary.get("email") if primary else (emails[0]["email"] if emails else None)
            user = await upsert_oauth_user(
                provider="github",
                oauth_id=str(profile.get("id")),
                email=email,
                name=profile.get("name") or profile.get("login") or "SSPLAY User",
                avatar=profile.get("avatar_url"),
            )
        else:
            raise HTTPException(404, "Unknown provider")
    except HTTPException:
        raise
    except Exception:
        return RedirectResponse(f"{client_url}/login?error=oauth_failed")

    access_token = create_access_token(str(user.id))
    response = RedirectResponse(f"{client_url}/auth/callback?token={access_token}")
    response.set_cookie(
        "token",
        access_token,
        httponly=True,
        samesite="lax",
        max_age=settings.jwt_expire_days * 86400,
    )
    return response

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr

from app.config import settings
from app.dependencies import get_current_user
from app.models.user import User
from app.services.oauth import (
    handle_oauth_callback,
    providers_enabled,
    redirect_oauth_login,
)
from app.utils.responses import success
from app.utils.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterBody(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginBody(BaseModel):
    email: EmailStr
    password: str


@router.get("/providers")
async def auth_providers():
    """Which OAuth providers are configured (for UI)."""
    return success(providers_enabled())


@router.get("/google")
async def google_login(request: Request):
    return await redirect_oauth_login(request, "google")


@router.get("/google/callback")
async def google_callback(request: Request):
    return await handle_oauth_callback(request, "google")


@router.get("/github")
async def github_login(request: Request):
    return await redirect_oauth_login(request, "github")


@router.get("/github/callback")
async def github_callback(request: Request):
    return await handle_oauth_callback(request, "github")


@router.post("/register")
async def register(body: RegisterBody, response: Response):
    if await User.find_one(User.email == body.email):
        raise HTTPException(400, "Email already registered")
    user = User(name=body.name, email=body.email, password=hash_password(body.password))
    await user.insert()
    token = create_access_token(str(user.id))
    response.set_cookie("token", token, httponly=True, samesite="lax", max_age=settings.jwt_expire_days * 86400)
    return success({"user": user.to_public(), "token": token})


@router.post("/login")
async def login(body: LoginBody, response: Response):
    user = await User.find_one(User.email == body.email)
    if not user or not user.password or not verify_password(body.password, user.password):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token(str(user.id))
    response.set_cookie("token", token, httponly=True, samesite="lax", max_age=settings.jwt_expire_days * 86400)
    return success({"user": user.to_public(), "token": token})


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("token")
    return success({"message": "Logged out"})


@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return success(user.to_public())

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: str = "development"
    port: int = 5000
    client_url: str = "http://localhost:5173"
    mongodb_uri: str = "mongodb://127.0.0.1:27017/ssplay"
    jwt_secret: str = "ssplay-dev-secret"
    jwt_expire_days: int = 7
    redis_url: str | None = None
    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_callback_url: str | None = None
    github_client_id: str | None = None
    github_client_secret: str | None = None
    github_callback_url: str | None = None
    cloudinary_cloud_name: str | None = None
    cloudinary_api_key: str | None = None
    cloudinary_api_secret: str | None = None
    spotify_client_id: str | None = None
    spotify_client_secret: str | None = None
    jamendo_client_id: str | None = None
    lastfm_api_key: str | None = None
    genius_access_token: str | None = None
    musixmatch_api_key: str | None = None
    audius_api_url: str = "https://api.audius.co"


settings = Settings()

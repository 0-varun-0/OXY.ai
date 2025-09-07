from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    """
    Application settings.

    Reads settings from environment variables.
    """
    PROJECT_NAME: str = "OXY.ai Dermatology VQA Chatbot"
    PROJECT_VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # Database settings
    SQLALCHEMY_DATABASE_URI: str = "sqlite+aiosqlite:///./oxy_ai.db"

    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 5
    ALLOWED_MIME_TYPES: list[str] = ["image/jpeg", "image/png"]
    
    class Config:
        # If you have a .env file, it will be read automatically
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

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

    # AI Model
    DERMATOLOGY_LABELS: list[str] = [
        "a normal mole",
        "a melanoma",
        "a basal cell carcinoma",
        "an actinic keratosis",
        "a benign keratosis-like lesion",
        "a dermatofibroma",
        "a vascular lesion",
        "a squamous cell carcinoma",
    ]

    # Disclaimer
    MEDICAL_DISCLAIMER: str = (
        "IMPORTANT: This is an AI-generated analysis and not a medical diagnosis. "
        "This tool is for educational purposes only. Consult a qualified dermatologist "
        "for any health concerns."
    )

    # Security
    SECRET_KEY: str = "9b1b54b381f16a4d0e08c661daf362ec690fc879ac42cce28c1f199cd46a8066"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        # If you have a .env file, it will be read automatically
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

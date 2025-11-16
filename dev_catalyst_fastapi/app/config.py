import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

    # Rails Backend
    RAILS_BACKEND_URL: str = os.getenv("RAILS_BACKEND_URL", "http://localhost:3001")

    # JWT Settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your_jwt_secret_key_here")
    JWT_ALGORITHM: str = "HS256"

    # CORS Settings
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",  # Frontend
        "http://localhost:3001",  # Rails Backend
    ]


settings = Settings()

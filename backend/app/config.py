from pydantic_settings import BaseSettings, SettingsConfigDict


# Configuração (variáveis de ambiente)
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=("../.env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    POSTGRES_USER: str = "biblioteca"
    POSTGRES_PASSWORD: str = "biblioteca"
    POSTGRES_DB: str = "biblioteca_virtual"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


settings = Settings()

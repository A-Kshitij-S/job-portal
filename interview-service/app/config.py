from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongo_uri: str
    nvidia_api_key: str
    tavily_api_key: str
    internal_service_key: str
    port: int = 5001

    interview_db_name: str = "interview_service"
    llm_base_url: str = "https://integrate.api.nvidia.com/v1"
    question_model: str = "openai/gpt-oss-20b"
    eval_model: str = "openai/gpt-oss-20b"
    llm_max_tokens: int = 2000


settings = Settings()

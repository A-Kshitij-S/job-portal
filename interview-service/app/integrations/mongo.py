from pymongo import MongoClient

from app.config import settings

_client = MongoClient(settings.mongo_uri)


def get_job_portal_db():
    """Read-only access to the existing Node app's database (jobs/companies/users)."""
    return _client["test"]


def get_interview_db():
    """This service's own database for checkpoints, long-term memory, and session ownership."""
    return _client[settings.interview_db_name]


def get_mongo_client() -> MongoClient:
    return _client

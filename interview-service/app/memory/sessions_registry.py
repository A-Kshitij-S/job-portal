from datetime import datetime, timezone

from app.integrations.mongo import get_interview_db


def _collection():
    return get_interview_db()["interview_sessions"]


def register_session(session_id: str, user_id: str, job_id: str) -> None:
    _collection().insert_one(
        {
            "_id": session_id,
            "user_id": user_id,
            "job_id": job_id,
            "status": "in_progress",
            "created_at": datetime.now(timezone.utc),
        }
    )


def get_session(session_id: str) -> dict | None:
    return _collection().find_one({"_id": session_id})


def mark_complete(session_id: str, result: dict) -> None:
    _collection().update_one(
        {"_id": session_id},
        {"$set": {"status": "complete", "result": result, "completed_at": datetime.now(timezone.utc)}},
    )


def owns_session(session_id: str, user_id: str) -> bool:
    doc = get_session(session_id)
    return doc is not None and doc["user_id"] == user_id

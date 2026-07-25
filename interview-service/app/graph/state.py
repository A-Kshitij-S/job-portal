import operator
from typing import Annotated, Literal, TypedDict

from langchain_core.messages import AnyMessage
from langgraph.graph.message import add_messages

FOLLOWUP_CAP = 2


class TurnRecord(TypedDict):
    topic: str
    difficulty: int
    question: str
    answer: str
    score: int
    verdict: Literal["adequate", "vague"]
    topic_signal: Literal["strong", "weak"]
    feedback: str


class InterviewState(TypedDict):
    user_id: str
    job_id: str
    session_id: str

    job_text: str
    company_text: str
    company_name: str
    resume_text: str
    resume_unavailable: bool
    company_intel_raw: list[dict]
    weak_topics_history: dict

    topics: list[str]
    topic_idx: int
    difficulty: int
    followups_on_topic: int

    current_question: str
    current_answer: str
    last_evaluation: dict

    turns: Annotated[list[TurnRecord], operator.add]
    messages: Annotated[list[AnyMessage], add_messages]

    interview_complete: bool
    final_summary: str
    overall_score: float
    weak_topics_this_session: list[str]


def initial_state(user_id: str, job_id: str, session_id: str) -> InterviewState:
    return InterviewState(
        user_id=user_id,
        job_id=job_id,
        session_id=session_id,
        job_text="",
        company_text="",
        company_name="",
        resume_text="",
        resume_unavailable=False,
        company_intel_raw=[],
        weak_topics_history={},
        topics=[],
        topic_idx=0,
        difficulty=2,
        followups_on_topic=0,
        current_question="",
        current_answer="",
        last_evaluation={},
        turns=[],
        messages=[],
        interview_complete=False,
        final_summary="",
        overall_score=0.0,
        weak_topics_this_session=[],
    )

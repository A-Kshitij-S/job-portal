import uuid

from fastapi import APIRouter, Depends, HTTPException
from langgraph.types import Command

from app.api.schemas import (
    AnswerRequest,
    AnswerResponse,
    HistoryItem,
    StartInterviewRequest,
    StartInterviewResponse,
)
from app.deps import get_graph, get_store, verify_internal_key
from app.graph.state import initial_state
from app.memory.sessions_registry import get_session, mark_complete, register_session

router = APIRouter(prefix="/interview", tags=["interview"], dependencies=[Depends(verify_internal_key)])


@router.post("/start", response_model=StartInterviewResponse)
def start_interview(body: StartInterviewRequest, graph=Depends(get_graph)):
    session_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": session_id}}

    try:
        state = graph.invoke(initial_state(body.userId, body.jobId, session_id), config=config)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    register_session(session_id, body.userId, body.jobId)
    return StartInterviewResponse(
        sessionId=session_id,
        question=state["current_question"],
        difficulty=state["difficulty"],
    )


@router.post("/answer", response_model=AnswerResponse)
def submit_answer(body: AnswerRequest, graph=Depends(get_graph)):
    session_doc = get_session(body.sessionId)
    if session_doc is None:
        raise HTTPException(status_code=404, detail="session not found")
    if session_doc["user_id"] != body.userId:
        raise HTTPException(status_code=403, detail="session does not belong to this user")

    if session_doc["status"] == "complete":
        result = session_doc["result"]
        return AnswerResponse(status="complete", **result)

    config = {"configurable": {"thread_id": body.sessionId}}
    state = graph.invoke(Command(resume=body.answer), config=config)
    still_paused = bool(graph.get_state(config).next)

    if still_paused:
        return AnswerResponse(
            status="in_progress",
            question=state["current_question"],
            difficulty=state["difficulty"],
        )

    result = {
        "summary": state["final_summary"],
        "score": state["overall_score"],
        "weakTopics": state["weak_topics_this_session"],
    }
    mark_complete(body.sessionId, result)
    return AnswerResponse(status="complete", **result)


@router.get("/history", response_model=list[HistoryItem])
def get_history(userId: str, store=Depends(get_store)):
    items = store.search((userId, "sessions"))
    history = [
        HistoryItem(
            date=item.value["date"],
            jobId=item.value["job_id"],
            overallScore=item.value["overall_score"],
            weakTopics=item.value["weak_topics"],
            summary=item.value["summary"],
        )
        for item in items
    ]
    history.sort(key=lambda h: h.date, reverse=True)
    return history

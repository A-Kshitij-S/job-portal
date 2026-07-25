from app.graph.state import InterviewState


def route_after_evaluation(state: InterviewState) -> str:
    if state["last_evaluation"].get("follow_up_granted"):
        return "ask_question"
    return "update_difficulty"


def route_after_topic(state: InterviewState) -> str:
    if state["topic_idx"] < len(state["topics"]):
        return "ask_question"
    return "summarize_session"

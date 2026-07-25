from datetime import datetime, timezone
from typing import Literal

from langchain_core.messages import HumanMessage, RemoveMessage, SystemMessage, ToolMessage
from langchain_openai import ChatOpenAI
from langgraph.graph.message import REMOVE_ALL_MESSAGES
from langgraph.runtime import Runtime
from pydantic import BaseModel, Field

from app.config import settings
from app.graph.state import FOLLOWUP_CAP, InterviewState, TurnRecord
from app.graph.tools import search_prep_materials, web_search_company_live
from app.integrations.tavily_client import fetch_company_intel as tavily_fetch_company_intel
from app.rag.index import build_index_for_session
from app.rag.loaders import load_job_and_company, load_resume_text

_llm_kwargs = {
    "api_key": settings.nvidia_api_key,
    "base_url": settings.llm_base_url,
    "max_tokens": settings.llm_max_tokens,
    "reasoning_effort": "low",  # gpt-oss-20b spends real completion tokens on hidden reasoning
}                               # before it ever writes final content -- "low" keeps that bounded
                                # and reliable; without it, longer/rule-heavy prompts (e.g. the
                                # evaluation grading rules) can burn the whole token budget on
                                # reasoning and return no parseable content at all.

_question_llm = ChatOpenAI(model=settings.question_model, **_llm_kwargs)
_question_llm_with_tools = _question_llm.bind_tools([search_prep_materials, web_search_company_live])
_eval_llm = ChatOpenAI(model=settings.eval_model, **_llm_kwargs)
_summary_llm = ChatOpenAI(model=settings.question_model, **_llm_kwargs)


class AnswerEvaluation(BaseModel):
    verdict: Literal["adequate", "vague"] = Field(
        description="'vague' if the answer is underspecified, evasive, or too short to assess; 'adequate' otherwise."
    )
    topic_signal: Literal["strong", "weak"] = Field(
        description="Whether the answer demonstrates real knowledge of the topic, independent of length -- "
        "a confident but incorrect answer is 'weak'."
    )
    score: int = Field(ge=1, le=5, description="Quality of the answer on this topic, 1 (poor) to 5 (excellent).")
    feedback: str = Field(description="One sentence of internal evaluator feedback, not shown to the candidate mid-interview.")


def load_context(state: InterviewState, runtime: Runtime) -> dict:
    job_info = load_job_and_company(state["job_id"])
    resume_text, resume_unavailable = load_resume_text(state["user_id"])

    weak_topics_item = runtime.store.get((state["user_id"], "profile"), "weak_topics")
    weak_topics_history = weak_topics_item.value if weak_topics_item else {}
    avg_scores = [v["avg_score"] for v in weak_topics_history.values() if "avg_score" in v]
    starting_difficulty = 1 if avg_scores and (sum(avg_scores) / len(avg_scores)) < 2.5 else 2

    return {
        "job_text": job_info["job_text"],
        "company_text": job_info["company_text"],
        "company_name": job_info["company_name"],
        "resume_text": resume_text,
        "resume_unavailable": resume_unavailable,
        "weak_topics_history": weak_topics_history,
        "topics": job_info["topics"],
        "topic_idx": 0,
        "difficulty": starting_difficulty,
        "followups_on_topic": 0,
    }


def fetch_company_intel(state: InterviewState) -> dict:
    return {"company_intel_raw": tavily_fetch_company_intel(state["company_name"])}


def build_index(state: InterviewState) -> dict:
    build_index_for_session(
        state["session_id"],
        state["job_text"],
        state["resume_text"],
        state["company_text"],
        state["company_intel_raw"],
    )
    return {}


def _build_question_prompt(state: InterviewState) -> str:
    topic = state["topics"][state["topic_idx"]]
    context = (
        f"Job description:\n{state['job_text']}\n\n"
        f"Candidate resume:\n{state['resume_text']}\n\n"
        f"Company background:\n{state['company_text']}\n"
    )
    if state["followups_on_topic"] > 0:
        last_turn = state["turns"][-1]
        task = (
            f"The candidate's last answer to \"{last_turn['question']}\" was vague: "
            f"\"{last_turn['answer']}\". Ask ONE probing follow-up question on the same "
            f"topic ('{topic}') to get a more specific answer. Difficulty: {state['difficulty']}/5."
        )
    else:
        task = (
            f"Ask ONE interview question about '{topic}' at difficulty {state['difficulty']}/5 "
            "(1=warm-up, 5=expert-level). Ground it in the job requirements, the candidate's "
            "resume, and the company background where relevant."
        )
    return (
        f"{context}\n{task}\n\n"
        "You may call search_prep_materials to pull more detail from the resume/JD/company "
        "research already gathered, or web_search_company_live if the candidate's background "
        "suggests something the baseline research didn't cover. Only use a tool if it would "
        "meaningfully improve the question -- otherwise ask directly. "
        "Respond with ONLY the question text once ready -- no preamble, no meta-commentary."
    )


def ask_question(state: InterviewState) -> dict:
    messages = state["messages"]
    resuming_tool_loop = bool(messages) and isinstance(messages[-1], ToolMessage)

    if resuming_tool_loop:
        response = _question_llm_with_tools.invoke(messages)
        if response.tool_calls:
            return {"messages": [response]}
        return {"current_question": response.content.strip(), "messages": [response]}

    fresh_messages = [
        SystemMessage(content="You are conducting a technical mock interview. Be concise and professional."),
        HumanMessage(content=_build_question_prompt(state)),
    ]
    response = _question_llm_with_tools.invoke(fresh_messages)
    reset_and_seed = [RemoveMessage(id=REMOVE_ALL_MESSAGES), *fresh_messages, response]

    if response.tool_calls:
        return {"messages": reset_and_seed}
    return {"current_question": response.content.strip(), "messages": reset_and_seed}


def await_answer(state: InterviewState):
    from langgraph.types import interrupt

    answer = interrupt({"question": state["current_question"], "difficulty": state["difficulty"]})
    return {"current_answer": answer}


def evaluate_answer(state: InterviewState) -> dict:
    topic = state["topics"][state["topic_idx"]]
    prompt = (
        "Grade one interview answer.\n\n"
        f"Topic: {topic}\n"
        f"Difficulty: {state['difficulty']}/5\n"
        f"Question asked: {state['current_question']}\n"
        f"Candidate's answer: \"{state['current_answer']}\"\n\n"
        "verdict='vague' ONLY for non-answers: 'idk', 'not sure', refusals, or answers with zero "
        "relevant content. If the candidate attempts a real answer -- even if it's about the wrong "
        "sub-topic, incomplete, or partially wrong -- use verdict='adequate' and reflect the quality "
        "in topic_signal and score instead.\n"
        "topic_signal='strong' only if the answer correctly and directly addresses THIS question. "
        "'weak' otherwise (wrong sub-topic, incomplete, incorrect, or off-target).\n"
        "score: 1=no real content, 3=partially correct or off-target but shows some understanding, "
        "5=precise and complete answer to exactly what was asked."
    )
    result: AnswerEvaluation = _eval_llm.with_structured_output(AnswerEvaluation).invoke(prompt)

    turn = TurnRecord(
        topic=topic,
        difficulty=state["difficulty"],
        question=state["current_question"],
        answer=state["current_answer"],
        score=result.score,
        verdict=result.verdict,
        topic_signal=result.topic_signal,
        feedback=result.feedback,
    )

    followups_on_topic = state["followups_on_topic"]
    follow_up_granted = result.verdict == "vague" and followups_on_topic < FOLLOWUP_CAP
    if follow_up_granted:
        followups_on_topic += 1

    return {
        "last_evaluation": {
            "verdict": result.verdict,
            "score": result.score,
            "topic_signal": result.topic_signal,
            "follow_up_granted": follow_up_granted,
        },
        "turns": [turn],
        "followups_on_topic": followups_on_topic,
    }


def update_difficulty(state: InterviewState) -> dict:
    score = state["last_evaluation"]["score"]
    delta = 1 if score >= 4 else (-1 if score <= 2 else 0)
    new_difficulty = max(1, min(5, state["difficulty"] + delta))
    return {
        "difficulty": new_difficulty,
        "followups_on_topic": 0,
        "topic_idx": state["topic_idx"] + 1,
    }


def summarize_session(state: InterviewState, runtime: Runtime) -> dict:
    turns = state["turns"]
    overall_score = sum(t["score"] for t in turns) / len(turns) if turns else 0.0
    weak_topics = list(dict.fromkeys(t["topic"] for t in turns if t["topic_signal"] == "weak"))

    transcript = "\n\n".join(
        f"Q: {t['question']}\nA: {t['answer']}\nScore: {t['score']}/5 ({t['verdict']}, {t['topic_signal']})"
        for t in turns
    )
    prompt = (
        f"Full mock interview transcript:\n\n{transcript}\n\n"
        "Write a short (3-5 sentence) summary of the candidate's performance for them to read "
        f"afterward, referencing specific strengths and weak areas ({', '.join(weak_topics) or 'none flagged'})."
    )
    response = _summary_llm.invoke(prompt)
    summary_text = response.content.strip()
    now_iso = datetime.now(timezone.utc).isoformat()

    existing = runtime.store.get((state["user_id"], "profile"), "weak_topics")
    weak_topics_data = dict(existing.value) if existing else {}
    for t in turns:
        if t["topic_signal"] != "weak":
            continue
        entry = weak_topics_data.get(t["topic"], {"times_flagged": 0, "avg_score": 0.0})
        prev_count = entry["times_flagged"]
        entry["avg_score"] = (entry["avg_score"] * prev_count + t["score"]) / (prev_count + 1)
        entry["times_flagged"] = prev_count + 1
        entry["last_seen"] = now_iso
        weak_topics_data[t["topic"]] = entry
    runtime.store.put((state["user_id"], "profile"), "weak_topics", weak_topics_data)

    runtime.store.put(
        (state["user_id"], "sessions"),
        state["session_id"],
        {
            "date": now_iso,
            "job_id": state["job_id"],
            "overall_score": overall_score,
            "weak_topics": weak_topics,
            "summary": summary_text,
        },
    )

    return {
        "interview_complete": True,
        "final_summary": summary_text,
        "overall_score": overall_score,
        "weak_topics_this_session": weak_topics,
    }

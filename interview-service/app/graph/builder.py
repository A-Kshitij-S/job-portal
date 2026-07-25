from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition

from app.graph.edges import route_after_evaluation, route_after_topic
from app.graph.nodes import (
    ask_question,
    await_answer,
    build_index,
    evaluate_answer,
    fetch_company_intel,
    load_context,
    summarize_session,
    update_difficulty,
)
from app.graph.state import InterviewState
from app.graph.tools import search_prep_materials, web_search_company_live


def build_graph_structure() -> StateGraph:
    builder = StateGraph(InterviewState)

    builder.add_node("load_context", load_context)
    builder.add_node("fetch_company_intel", fetch_company_intel)
    builder.add_node("build_index", build_index)
    builder.add_node("ask_question", ask_question)
    builder.add_node("tools", ToolNode([search_prep_materials, web_search_company_live]))
    builder.add_node("await_answer", await_answer)
    builder.add_node("evaluate_answer", evaluate_answer)
    builder.add_node("update_difficulty", update_difficulty)
    builder.add_node("summarize_session", summarize_session)

    builder.add_edge(START, "load_context")
    builder.add_edge("load_context", "fetch_company_intel")
    builder.add_edge("fetch_company_intel", "build_index")
    builder.add_edge("build_index", "ask_question")
    builder.add_conditional_edges(
        "ask_question",
        tools_condition,
        {"tools": "tools", END: "await_answer"},
    )
    builder.add_edge("tools", "ask_question")
    builder.add_edge("await_answer", "evaluate_answer")
    builder.add_conditional_edges(
        "evaluate_answer",
        route_after_evaluation,
        {"ask_question": "ask_question", "update_difficulty": "update_difficulty"},
    )
    builder.add_conditional_edges(
        "update_difficulty",
        route_after_topic,
        {"ask_question": "ask_question", "summarize_session": "summarize_session"},
    )
    builder.add_edge("summarize_session", END)

    return builder


def compile_graph(checkpointer, store=None):
    builder = build_graph_structure()
    if store is not None:
        return builder.compile(checkpointer=checkpointer, store=store)
    return builder.compile(checkpointer=checkpointer)

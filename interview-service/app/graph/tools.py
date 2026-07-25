from typing import Annotated

from langchain_core.tools import tool
from langgraph.prebuilt import InjectedState

from app.integrations.tavily_client import search_company_live
from app.rag.index import get_or_build_index


@tool
def search_prep_materials(query: str, state: Annotated[dict, InjectedState]) -> str:
    """Search the candidate's resume, the job description, and the company research already
    gathered for this interview, to find relevant background before asking or evaluating a
    question. Use this when the auto-injected context might not cover what you need."""
    index = get_or_build_index(state)
    results = index.similarity_search(query, k=3)
    if not results:
        return "No relevant materials found."
    return "\n---\n".join(f"[{r.metadata.get('source')}] {r.page_content}" for r in results)


@tool
def web_search_company_live(query: str) -> str:
    """Search the live web for additional company information not already covered by the
    baseline research, e.g. if the candidate mentions something recent or specific that the
    prior research didn't surface."""
    return search_company_live(query)

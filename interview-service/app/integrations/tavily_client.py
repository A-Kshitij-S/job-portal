from functools import lru_cache

from langchain_tavily import TavilySearch

from app.config import settings


@lru_cache(maxsize=1)
def _guaranteed_search() -> TavilySearch:
    return TavilySearch(max_results=5, tavily_api_key=settings.tavily_api_key)


@lru_cache(maxsize=1)
def _on_demand_search() -> TavilySearch:
    return TavilySearch(max_results=3, tavily_api_key=settings.tavily_api_key)


def fetch_company_intel(company_name: str) -> list[dict]:
    """One guaranteed call per session -- the FAISS index always has *some* live grounding."""
    if not company_name:
        return []
    query = f"{company_name} engineering culture tech stack recent news"
    try:
        result = _guaranteed_search().invoke({"query": query})
        return result.get("results", []) if isinstance(result, dict) else []
    except Exception:
        return []


def search_company_live(query: str) -> str:
    """On-demand, LLM-invoked mid-interview search -- the genuinely agentic Tavily call."""
    try:
        result = _on_demand_search().invoke({"query": query})
        results = result.get("results", []) if isinstance(result, dict) else []
        if not results:
            return "No live search results found."
        return "\n---\n".join(f"[{r.get('url', '')}] {r.get('content', '')}" for r in results)
    except Exception as exc:
        return f"Web search failed: {exc}"

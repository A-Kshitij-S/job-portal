from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.rag.embeddings import get_embeddings

_index_cache: dict[str, FAISS] = {}
_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)


def _chunk(text: str, source: str, extra_metadata: dict | None = None) -> list[Document]:
    if not text:
        return []
    metadata = {"source": source, **(extra_metadata or {})}
    return [Document(page_content=chunk, metadata=metadata) for chunk in _splitter.split_text(text)]


def build_index_for_session(
    session_id: str,
    job_text: str,
    resume_text: str,
    company_text: str,
    tavily_snippets: list[dict],
) -> FAISS:
    docs: list[Document] = []
    docs += _chunk(job_text, "jd")
    docs += _chunk(resume_text, "resume")
    docs += _chunk(company_text, "company")
    for snippet in tavily_snippets:
        docs += _chunk(snippet.get("content", ""), "tavily", {"url": snippet.get("url", "")})

    if not docs:
        docs = [Document(page_content="No context available for this session.", metadata={"source": "none"})]

    index = FAISS.from_documents(docs, get_embeddings())
    _index_cache[session_id] = index
    return index


def get_index(session_id: str) -> FAISS | None:
    return _index_cache.get(session_id)


def get_or_build_index(state: dict) -> FAISS:
    session_id = state["session_id"]
    index = get_index(session_id)
    if index is not None:
        return index
    return build_index_for_session(
        session_id,
        state.get("job_text", ""),
        state.get("resume_text", ""),
        state.get("company_text", ""),
        state.get("company_intel_raw", []),
    )

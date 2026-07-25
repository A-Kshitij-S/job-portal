import io

import httpx
import pdfplumber
from bson import ObjectId

from app.integrations.mongo import get_job_portal_db


def load_job_and_company(job_id: str) -> dict:
    db = get_job_portal_db()
    job = db.jobs.find_one({"_id": ObjectId(job_id)})
    if job is None:
        raise ValueError(f"job {job_id} not found")

    company = None
    company_ref = job.get("company")
    if company_ref:
        company = db.companies.find_one({"_id": ObjectId(company_ref)})

    requirements = job.get("requirements") or []
    topics = list(requirements)[:8] or [job.get("title", "the role")]

    job_text = (
        f"Title: {job.get('title', '')}\n"
        f"Description: {job.get('descriptions', '')}\n"
        f"Requirements: {', '.join(requirements)}\n"
        f"Experience level: {job.get('experienceLevel', '')}\n"
        f"Location: {job.get('location', '')}\n"
        f"Job type: {job.get('jobType', '')}"
    )
    company_name = company.get("name", "") if company else ""
    company_text = (
        f"Name: {company_name}\n"
        f"Description: {(company or {}).get('description', '')}\n"
        f"Website: {(company or {}).get('website', '')}\n"
        f"Location: {(company or {}).get('location', '')}"
    )
    return {
        "job_text": job_text,
        "company_text": company_text,
        "company_name": company_name,
        "topics": topics,
    }


def load_resume_text(user_id: str) -> tuple[str, bool]:
    db = get_job_portal_db()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    resume_url = ((user or {}).get("profile") or {}).get("resume")
    if not resume_url:
        return "", True

    try:
        resp = httpx.get(resume_url, timeout=15.0, follow_redirects=True)
        resp.raise_for_status()
        pdf_bytes = resp.content

        text = _extract_with_pdfplumber(pdf_bytes)
        if not text:
            text = _extract_with_pypdf(pdf_bytes)
        return (text, False) if text else ("", True)
    except Exception:
        return "", True


def _extract_with_pdfplumber(pdf_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages).strip()


def _extract_with_pypdf(pdf_bytes: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(pdf_bytes))
    return "\n".join((page.extract_text() or "") for page in reader.pages).strip()

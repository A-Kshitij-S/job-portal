from pydantic import BaseModel


class StartInterviewRequest(BaseModel):
    userId: str
    jobId: str


class StartInterviewResponse(BaseModel):
    sessionId: str
    question: str
    difficulty: int


class AnswerRequest(BaseModel):
    userId: str
    sessionId: str
    answer: str


class AnswerResponse(BaseModel):
    status: str
    question: str | None = None
    difficulty: int | None = None
    summary: str | None = None
    score: float | None = None
    weakTopics: list[str] | None = None


class HistoryItem(BaseModel):
    date: str
    jobId: str
    overallScore: float
    weakTopics: list[str]
    summary: str

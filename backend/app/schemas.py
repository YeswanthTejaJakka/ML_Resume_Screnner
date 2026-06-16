from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class CandidateResultBase(BaseModel):
    filename: str
    semantic_score: float
    ats_score: float
    weighted_score: float
    gemini_analysis: Optional[Any] = None

class CandidateResult(CandidateResultBase):
    id: int
    session_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ScreeningSessionBase(BaseModel):
    job_description_id: int

class ScreeningSession(ScreeningSessionBase):
    id: int
    created_at: datetime
    candidate_results: List[CandidateResult] = []

    class Config:
        from_attributes = True

class JobDescriptionBase(BaseModel):
    text: str

class JobDescription(JobDescriptionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Response model for history list
class ScreeningHistoryItem(BaseModel):
    id: int
    created_at: datetime
    job_description_preview: str
    candidate_count: int
    top_score: float

    class Config:
        from_attributes = True

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sessions = relationship("ScreeningSession", back_populates="job_description")

class ScreeningSession(Base):
    __tablename__ = "screening_sessions"
    id = Column(Integer, primary_key=True, index=True)
    job_description_id = Column(Integer, ForeignKey("job_descriptions.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    job_description = relationship("JobDescription", back_populates="sessions")
    candidate_results = relationship("CandidateResult", back_populates="session", cascade="all, delete-orphan")

class CandidateResult(Base):
    __tablename__ = "candidate_results"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("screening_sessions.id"))
    filename = Column(String, index=True)
    resume_text = Column(Text, nullable=True)
    semantic_score = Column(Float)
    ats_score = Column(Float)
    weighted_score = Column(Float)
    gemini_analysis = Column(JSON)  # Stores the full analysis JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ScreeningSession", back_populates="candidate_results")

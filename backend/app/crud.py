from sqlalchemy.orm import Session
from sqlalchemy import desc
from . import models, schemas
import json

def create_screening_session(db: Session, job_description_text: str, candidates: list):
    # 1. Save Job Description
    db_jd = models.JobDescription(text=job_description_text)
    db.add(db_jd)
    db.commit()
    db.refresh(db_jd)

    # 2. Create Screening Session
    db_session = models.ScreeningSession(job_description_id=db_jd.id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    # 3. Save Candidate Results
    for cand in candidates:
        analysis = cand.get("analysis")
        # Handle weighted score (simple average of semantic and ATS for now, or use provided)
        semantic = cand.get("score") # This was the similarity score in original
        ats = analysis.get("ats_score", semantic) if analysis else semantic
        weighted = (semantic + ats) / 2
        
        db_cand = models.CandidateResult(
            session_id=db_session.id,
            filename=cand["filename"],
            resume_text=cand.get("text_snippet"),
            semantic_score=semantic,
            ats_score=ats,
            weighted_score=weighted,
            gemini_analysis=analysis
        )
        db.add(db_cand)
    
    db.commit()
    db.refresh(db_session)
    return db_session

def get_screenings(db: Session, skip: int = 0, limit: int = 10, search: str = None):
    query = db.query(models.ScreeningSession).join(models.JobDescription)
    
    if search:
        query = query.filter(
            (models.JobDescription.text.ilike(f"%{search}%")) |
            (models.ScreeningSession.candidate_results.any(models.CandidateResult.filename.ilike(f"%{search}%")))
        )
    
    sessions = query.order_by(desc(models.ScreeningSession.created_at)).offset(skip).limit(limit).all()
    
    # Map to history items
    history = []
    for s in sessions:
        top_score = 0
        if s.candidate_results:
            top_score = max(c.weighted_score for c in s.candidate_results)
        
        history.append({
            "id": s.id,
            "created_at": s.created_at,
            "job_description_preview": s.job_description.text[:100] + "...",
            "candidate_count": len(s.candidate_results),
            "top_score": top_score
        })
    return history

def get_screening_details(db: Session, session_id: int):
    return db.query(models.ScreeningSession).filter(models.ScreeningSession.id == session_id).first()

def delete_screening(db: Session, session_id: int):
    db_session = db.query(models.ScreeningSession).filter(models.ScreeningSession.id == session_id).first()
    if db_session:
        db.delete(db_session)
        db.commit()
        return True
    return False

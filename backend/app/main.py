import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set this before any other imports to prevent symlink warnings on Windows
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlalchemy.orm import Session
from app.utils import extract_text_from_pdf
from app.core import matcher
from . import models, schemas, crud, database

app = FastAPI(title="AI Resume Screener", version="1.0")

@app.on_event("startup")
def startup_event():
    logger.info("Initializing database tables...")
    try:
        models.Base.metadata.create_all(bind=database.engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        # We don't raise here so the app can still start and we can see logs

# Enable CORS so the frontend can talk to the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    logger.info("Health check endpoint called.")
    return {
        "status": "online",
        "message": "Resume Screening API is running.",
        "models_loaded": {
            "sentence_transformer": matcher.model is not None,
            "gemini": matcher.gemini is not None
        }
    }

@app.post("/screen")
async def screen_resumes(
    job_description: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(database.get_db)
):
    logger.info(f"Received screening request for {len(files)} files.")
    processed_resumes = []

    for file in files:
        filename = file.filename.lower()
        if filename.endswith(".pdf"):
            logger.info(f"Processing PDF file: {file.filename}")
            try:
                content = await file.read()
                text = extract_text_from_pdf(content)
                if text:
                    processed_resumes.append({
                        "filename": file.filename,
                        "text": text
                    })
                    logger.info(f"✅ Extracted {len(text)} characters from {file.filename}")
                else:
                    logger.warning(f"⚠️ No text extracted from {file.filename}")
            except Exception as e:
                logger.error(f"❌ Error reading {file.filename}: {e}")
        else:
            logger.warning(f"🚫 Skipping non-PDF file: {file.filename}")

    if not processed_resumes:
        return {"error": "No valid PDF text extracted."}

    logger.info("Ranking resumes...")
    ranked_results = matcher.rank_resumes(job_description, processed_resumes)

    # Save to Database
    logger.info("Saving results to database...")
    db_session = crud.create_screening_session(db, job_description, ranked_results)

    logger.info("Screening complete.")
    return {
        "session_id": db_session.id,
        "job_description_preview": job_description[:50] + "...",
        "candidates_ranked": ranked_results
    }

@app.get("/history", response_model=List[schemas.ScreeningHistoryItem])
def get_screening_history(
    skip: int = 0, 
    limit: int = 20, 
    search: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    return crud.get_screenings(db, skip=skip, limit=limit, search=search)

@app.get("/history/{session_id}", response_model=schemas.ScreeningSession)
def get_screening_detail(
    session_id: int, 
    db: Session = Depends(database.get_db)
):
    db_session = crud.get_screening_details(db, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Screening session not found")
    return db_session

@app.delete("/history/{session_id}")
def delete_screening_record(
    session_id: int, 
    db: Session = Depends(database.get_db)
):
    success = crud.delete_screening(db, session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Screening session not found")
    return {"message": "Screening record deleted successfully"}
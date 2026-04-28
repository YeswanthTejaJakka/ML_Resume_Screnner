from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from app.utils import extract_text_from_pdf
from app.core import matcher

app = FastAPI(title="AI Resume Screener", version="1.0")

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
    return {"message": "Resume Screening API is running."}

@app.post("/screen")
async def screen_resumes(
    job_description: str = Form(...),
    files: List[UploadFile] = File(...)
):
    processed_resumes = []
    
    for file in files:
        if file.filename.endswith(".pdf"):
            content = await file.read()
            text = extract_text_from_pdf(content)
            if text:
                processed_resumes.append({
                    "filename": file.filename,
                    "text": text
                })
    
    if not processed_resumes:
        return {"error": "No valid PDF text extracted."}

    ranked_results = matcher.rank_resumes(job_description, processed_resumes)
    
    return {
        "job_description_preview": job_description[:50] + "...",
        "candidates_ranked": ranked_results
    }
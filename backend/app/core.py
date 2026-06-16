import os
from dotenv import load_dotenv
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set environment variables BEFORE importing AI libraries
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import google.generativeai as genai
import json

load_dotenv()

class ResumeMatcher:
    def __init__(self):
        self.model = None
        self.gemini = None
        
        try:
            # We use a lightweight model designed for efficiency/speed
            logger.info("⏳ Loading Sentence Transformer Model (all-MiniLM-L6-v2)...")
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("✅ Sentence Transformer Model Loaded.")
        except Exception as e:
            logger.error(f"❌ Failed to load Sentence Transformer model: {e}")
        
        # Configure Gemini
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            try:
                genai.configure(api_key=api_key)
                self.gemini = genai.GenerativeModel('gemini-2.5-flash')
                logger.info("✅ Gemini AI Configured.")
            except Exception as e:
                logger.error(f"❌ Failed to configure Gemini AI: {e}")
        else:
            logger.warning("⚠️ GEMINI_API_KEY not found. Detailed analysis will be disabled.")

    def get_embedding(self, text: str):
        if not self.model:
            logger.error("Sentence Transformer model not loaded.")
            return np.zeros((1, 384)) # Default size for MiniLM-L6-v2
        return self.model.encode(text)

    def generate_detailed_analysis(self, job_description: str, resume_text: str):
        if not self.gemini:
            return None
        
        prompt = f"""
        Act as an expert ATS (Applicant Tracking System) and Hiring Manager.
        Analyze the following resume against the job description.
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text[:4000]}
        
        Provide a detailed review in JSON format with the following keys:
        - ats_score: (a number between 0-100)
        - summary: (a short professional summary of the fit)
        - detailed_fit: (a deeper explanation of why they are or are not a good fit for this specific role)
        - strong_matches: (a list of bullet points of skills/experience that match well)
        - gaps: (a list of bullet points of missing requirements or weak areas)
        - interview_questions: (a list of 3-4 tailored interview questions to ask this candidate)
        
        Ensure the response is valid JSON.
        """
        
        try:
            response = self.gemini.generate_content(prompt)
            # Clean response if it contains markdown code blocks
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:-3].strip()
            elif text.startswith("```"):
                text = text[3:-3].strip()
            
            return json.loads(text)
        except Exception as e:
            logger.error(f"Gemini Analysis Error: {e}")
            return None

    def rank_resumes(self, job_description: str, resumes: list):
        """
        resumes: list of dicts [{'filename': 'x.pdf', 'text': '...'}]
        Returns ranked list with scores.
        """
        # 1. Vectorize Job Description
        jd_vector = self.get_embedding(job_description).reshape(1, -1)

        results = []
        
        # 2. Vectorize and Compare each Resume
        for res in resumes:
            res_vector = self.get_embedding(res['text']).reshape(1, -1)
            similarity = cosine_similarity(jd_vector, res_vector)[0][0]
            # Base score from semantic similarity
            base_score = round(float(similarity) * 100, 2)
            
            # 3. Generate Detailed Analysis for all (or top N for speed)
            analysis = self.generate_detailed_analysis(job_description, res['text'])
            
            # If AI score is available, use it as a more precise ATS score
            gemini_score = analysis.get('ats_score', base_score) if analysis else base_score

            final_score = round(
                0.75 * base_score +
                0.25 * gemini_score,
                2
            )
            results.append({
                "filename": res['filename'],
                "score": final_score,
                "text_snippet": res['text'][:200] + "...", # Preview
                "analysis": analysis
            })

        # 4. Sort by Score (Descending)
        return sorted(results, key=lambda x: x['score'], reverse=True)

# Create a global instance
matcher = ResumeMatcher()

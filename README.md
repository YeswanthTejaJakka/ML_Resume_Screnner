# AI Resume Screener

An intelligent tool to screen and rank resumes using Semantic Matching and LLM analysis.

## 🚀 Features
- **Ranking:** Uses Sentence Transformers to rank resumes by context, not just keywords.
- **Interview Prep:** Automatically generates tailored interview questions for each candidate.
- **Cinematic UI:** Smooth, interactive frontend built with React and Framer Motion.

## 🛠️ Tech Stack
- **Backend:** FastAPI, Python, Sentence-Transformers,  Generative AI.
- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide React.
- **Deployment:** Docker support (Dockerfile/Docker-compose included).

## 📦 Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Confirm that folder first
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 🐳 Docker Deployment
For a quick setup using Docker:

1. **Build and Start:**
   ```bash
   docker-compose up --build -d
   ```
2. **Access the App:**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:8000`

3. **Stop the Containers:**
   ```bash
   docker-compose down
   ```

## 📄 Usage
1. Paste the **Job Description** in the requirements box.
2. Upload **Resume PDFs**.
3. Click **Analyze Candidates**.
4. View the ranked shortlist and click **View Reasoning** for a detailed breakdown and interview questions.

---
*Jakka Yeswanth Teja ©️ 2026., AI212 IIT Ropar Project*

# AI Resume Screener

An intelligent tool to screen and rank resumes using Semantic Matching and LLM analysis.

## 🚀 Features (Upgraded)
- **Persistent Storage:** Local PostgreSQL integration saves every screening session.
- **Recruiter Dashboard:** Search, filter, and review historical screenings.
- **Ranking:** Uses Sentence Transformers to rank resumes by context.
- **Interview Prep:** Automatically generates tailored interview questions via Gemini.
- **Cinematic UI:** Smooth, interactive frontend built with React and Framer Motion.

## 🛠️ Tech Stack
- **Backend:** FastAPI, Python, SQLAlchemy, PostgreSQL, Sentence-Transformers, Generative AI.
- **Frontend:** React, Tailwind CSS, Framer Motion, Lucide React.
- **Infrastructure:** Docker, Docker Compose, Kubernetes.

## 📦 Setup Instructions

### 🐳 Docker Deployment (Recommended)
The easiest way to run the entire stack (Frontend, Backend, and PostgreSQL) is using Docker Compose:

1. **Configure Environment:**
   Ensure `backend/.env` has your `GEMINI_API_KEY`.
2. **Build and Start:**
   ```bash
   docker-compose up --build -d
   ```
3. **Access the App:**
   - Frontend: `http://localhost` (or `http://localhost:5173` in dev)
   - Backend API: `http://localhost:8000`

### ☸️ Kubernetes Deployment
1. **Configure Secrets:** Update `k8s/secrets.yaml` with your API key.
2. **Deploy:**
   ```bash
   kubectl apply -f k8s/
   ```

## 📄 Usage
1. **Scanner:** Paste Job Description, upload PDFs, and click "Analyze". Results are automatically saved.
2. **Dashboard:** Switch to the "Dashboard" tab to see history. Search by keywords or filenames, and click any record to reload its full analysis and interview questions.

---
*Jakka Yeswanth Teja ©️ 2026., AI212 IIT Ropar Project*

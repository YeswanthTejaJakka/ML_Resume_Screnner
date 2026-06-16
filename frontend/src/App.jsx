import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Fingerprint,
  Sparkles,
  Command,
  ArrowRight,
  X,
  Search,
  Trash2,
  Calendar,
  Layers
} from 'lucide-react';
import OrganicBackground from './components/OrganicBackground';
import MagneticButton from './components/MagneticButton';
import { LetterSlideReveal, AtmosphericSubtitle, ScrollReveal } from './components/KineticTypography';
import MouseFollower from './components/MouseFollower';
import BackgroundGrid from './components/BackgroundGrid';

const App = () => {
  const [activeView, setActiveView] = useState('scanner'); // 'scanner' or 'dashboard'
  const [jobDesc, setJobDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async (search = '') => {
    setIsHistoryLoading(true);
    try {
      const response = await axios.get(`/api/history?search=${search}`);
      setHistory(response.data);
    } catch {
      setError("Failed to fetch history.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const loadScreeningDetail = async (sessionId) => {
    setIsScanning(true);
    try {
      const response = await axios.get(`/api/history/${sessionId}`);
      // Map candidate results back to frontend format
      const mapped = response.data.candidate_results.map(c => ({
        filename: c.filename,
        score: c.weighted_score,
        text_snippet: c.resume_text,
        analysis: c.gemini_analysis
      }));
      setResults(mapped);
      setJobDesc(response.data.job_description?.text || "");
      setActiveView('scanner');
      setTimeout(() => handleScrollToResults(), 100);
    } catch {
      setError("Failed to load details.");
    } finally {
      setIsScanning(false);
    }
  };

  const deleteHistoryItem = async (sessionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this screening record?")) return;
    try {
      await axios.delete(`/api/history/${sessionId}`);
      fetchHistory(searchQuery);
    } catch {
      setError("Failed to delete.");
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const triggerAnalysis = async () => {
    if (!jobDesc || files.length === 0) {
      setError("Provide both requirements and documents.");
      return;
    }
    
    setError('');
    setResults(null);
    setIsScanning(true);

    const formData = new FormData();
    formData.append('job_description', jobDesc);
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('/api/screen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.error) {
        setError(`Processing Error: ${response.data.error}`);
        setIsScanning(false);
        return;
      }

      if (!response.data.candidates_ranked || response.data.candidates_ranked.length === 0) {
        setError("No candidates found in the analysis results.");
        setIsScanning(false);
        return;
      }

      // Keep scanning for a brief moment to feel "processed"
      setTimeout(() => {
        // Map backend results to frontend format
        const mappedResults = response.data.candidates_ranked.map(cand => ({
          filename: cand.filename,
          score: cand.score, 
          text_snippet: cand.text_snippet,
          analysis: cand.analysis
        }));
        setResults(mappedResults);
        setIsScanning(false);
        setTimeout(() => handleScrollToResults(), 200);
      }, 1000);
      
    } catch (err) {
      console.error("🔥 Detailed Failure:", err);
      if (err.response) {
        // Server responded with a status code outside the 2xx range
        setError(`Server Error (${err.response.status}): ${err.response.data?.detail || err.response.statusText || "Engine internal failure"}`);
      } else if (err.request) {
        // Request was made but no response was received
        setError("Network Error: No response from engine. Check if containers are healthy and verify Gemini API key.");
      } else {
        setError(`Application Error: ${err.message}`);
      }
      setIsScanning(false);
    }
  };

  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1
  };

  const handleScrollToResults = () => {
    const element = document.getElementById('results-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-neon-cyan/30">
      <OrganicBackground />
      <BackgroundGrid />
      <MouseFollower />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md"
            >
              <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-red-200">{error}</span>
                </div>
                <button onClick={() => setError('')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={14} className="text-red-200/50" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Navigation / Header - Floating Glass Pill */}
        <div className="fixed top-8 left-0 right-0 z-50 px-6 pointer-events-none">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-fit mx-auto premium-glass backdrop-blur-2xl glass-border-gradient rounded-full px-8 py-3 flex items-center gap-12 pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/5 inner-shine"
          >
            <div className="flex items-center gap-3">
              <Fingerprint className="text-neon-cyan" size={18} />
              <span className="font-serif italic text-lg tracking-tight">AI Resume Screener</span>
            </div>
            <div className="hidden md:flex gap-8 text-[9px] uppercase tracking-[0.4em] font-bold opacity-40">
              <button 
                onClick={() => setActiveView('scanner')} 
                className={`cursor-pointer transition-opacity ${activeView === 'scanner' ? 'text-neon-cyan opacity-100' : 'hover:opacity-100'}`}
              >
                Scanner
              </button>
              <button 
                onClick={() => {
                  setActiveView('dashboard');
                  fetchHistory();
                }} 
                className={`cursor-pointer transition-opacity ${activeView === 'dashboard' ? 'text-neon-cyan opacity-100' : 'hover:opacity-100'}`}
              >
                Dashboard
              </button>
            </div>
          </motion.nav>
        </div>

        {activeView === 'scanner' ? (
          <section id="app-section" className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mt-24">
            
            {/* Hero Section */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <div className="micro-label mb-6 flex items-center gap-2">
                  <Sparkles size={12} className="text-neon-cyan" />
                  <AtmosphericSubtitle text="SCREEN HUNDREDS IN MINUTES..." className="micro-label" targetOpacity={0.6} />
                </div>
                
                <LetterSlideReveal 
                  text="AI Resume Screener" 
                  className="text-7xl md:text-8xl font-serif leading-[0.9] mb-8"
                />

                <ScrollReveal>
                  <p className="text-lg text-white/60 font-light leading-relaxed max-w-md text-balance mb-4">
                    Screen hundreds of resumes in minutes, not days.
                  </p>
                  <p className="text-sm text-white/40 font-light leading-relaxed max-w-md text-balance mb-8">
                    Paste your job description, upload resumes, and get a ranked shortlist with clear reasons why each candidate fits the role. No more manual scanning or guesswork.
                  </p>
                </ScrollReveal>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <MagneticButton
                  onClick={triggerAnalysis}
                  disabled={isScanning}
                  className="group relative px-10 py-5 premium-glass glass-border-gradient rounded-full flex items-center gap-4 overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(0,242,255,0.15)]"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative micro-label opacity-100 text-white tracking-[0.2em]">
                    {isScanning ? "Scanning..." : "Analyze Candidates"}
                  </span>
                  <ArrowRight size={16} className={`relative text-neon-cyan group-hover:translate-x-1 transition-transform ${isScanning ? 'animate-pulse' : ''}`} />
                </MagneticButton>
                
              </motion.div>
            </div>

            {/* Cards Section */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              
              {/* Scanning Line Animation */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ top: "0%", opacity: 0 }}
                    animate={{ top: "100%", opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      top: { duration: 2, repeat: Infinity, ease: "linear" },
                      opacity: { duration: 0.3 }
                    }}
                    className="scan-line"
                  />
                )}
              </AnimatePresence>

              {/* Job Description Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.3 }}
                className="premium-glass glass-border-gradient p-10 rounded-[40px] space-y-6 group bg-white/[0.03]"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-neon-cyan/20 flex items-center justify-center">
                    <FileText size={20} className="text-neon-cyan" />
                  </div>
                  <div className="micro-label">01 / Input</div>
                </div>
                <h3 className="text-2xl font-serif italic">Requirements</h3>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Describe the ideal candidate profile..."
                  className="w-full h-48 bg-transparent border-none text-white/80 placeholder:text-white/20 outline-none resize-none font-sans text-sm leading-relaxed"
                />
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                    <Command size={14} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">ML Model Engine Active</span>
                  </div>
                </div>
              </motion.div>

              {/* Upload Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springTransition, delay: 0.4 }}
                className="premium-glass glass-border-gradient p-10 rounded-[40px] space-y-6 group mt-12 md:mt-24 bg-white/[0.03]"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-royal-purple/20 flex items-center justify-center">
                    <Upload size={20} className="text-royal-purple" />
                  </div>
                  <div className="micro-label">02 / Source</div>
                </div>
                <h3 className="text-2xl font-serif italic">Documents</h3>
                <div className="relative h-48 border border-dashed border-white/20 rounded-[30px] flex flex-col items-center justify-center hover:bg-white/[0.05] transition-colors cursor-pointer group/upload">
                  <input 
                    type="file" multiple accept=".pdf" onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="p-4 rounded-full bg-white/10 mb-4 group-hover/upload:scale-110 transition-transform">
                    <Upload size={18} className="text-white/60" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Drop PDFs here</span>
                  {files.length > 0 && (
                    <div className="mt-4 px-4 py-1 rounded-full glass border border-white/10 text-[10px] font-bold text-neon-cyan bg-neon-cyan/10">
                      {files.length} Files Cached
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        ) : (
          <section className="mt-24 space-y-12 min-h-[60vh]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="micro-label">Recruiter Dashboard</div>
                <h2 className="text-5xl font-serif italic">Screening History</h2>
              </div>
              <div className="relative group max-w-md w-full">
                <input 
                  type="text"
                  placeholder="Search by keywords or candidate..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    fetchHistory(e.target.value);
                  }}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full px-8 py-4 text-sm outline-none focus:border-neon-cyan/50 transition-all placeholder:text-white/20"
                />
                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {isHistoryLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40">
                  <div className="w-12 h-12 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                  <div className="micro-label uppercase tracking-widest">Querying database...</div>
                </div>
              ) : history.length > 0 ? (
                history.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => loadScreeningDetail(item.id)}
                    className="group premium-glass glass-border-gradient p-6 rounded-[25px] flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center font-serif">
                        <span className="text-xs text-white/40 leading-none">ID</span>
                        <span className="text-xl text-neon-cyan">{item.id}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">
                          <Calendar size={10} />
                          {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                        <h4 className="text-lg font-serif italic truncate max-w-md">{item.job_description_preview}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                      <div className="text-center">
                        <div className="micro-label mb-1">Candidates</div>
                        <div className="text-xl font-serif flex items-center justify-center gap-2">
                          <Layers size={14} className="text-white/20" />
                          {item.candidate_count}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="micro-label mb-1">Top Match</div>
                        <div className="text-xl font-serif text-neon-cyan">{item.top_score}%</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => deleteHistoryItem(item.id, e)}
                          className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-white/40 hover:text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan group-hover:translate-x-1 transition-transform">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-40 border border-dashed border-white/10 rounded-[40px]">
                  <FileText size={40} />
                  <div className="micro-label uppercase tracking-widest">No screenings found in history</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Results Section */}
        <AnimatePresence>
          {results && activeView === 'scanner' && (
            <motion.section 
              id="results-section"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springTransition}
              className="mt-20 space-y-16"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="micro-label">Analysis Output</div>
                <h2 className="text-5xl font-serif italic max-w-2xl text-balance">
                  {jobDesc.split('\n')[0].substring(0, 40) || "Job"} – Candidates
                </h2>
                <div className="w-px h-24 bg-gradient-to-b from-neon-cyan to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((candidate, index) => (
                  <ScrollReveal key={candidate.filename} delay={index * 0.1}>
                    <motion.div 
                      whileHover={{ y: -10 }}
                      className="premium-glass glass-border-gradient p-8 rounded-[35px] space-y-8 group/card bg-white/[0.02]"
                    >
                      <div className="flex justify-between items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl border ${index === 0 ? 'border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'border-white/10 text-white/40'}`}>
                          {index + 1}
                        </div>
                        <div className="text-3xl font-serif italic opacity-90">{candidate.score}%</div>
                      </div>

                      <div>
                        <h4 className="text-xl font-serif mb-3 group-hover/card:text-neon-cyan transition-colors truncate">{candidate.filename}</h4>
                        <div className="flex gap-2 mb-4">
                          <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[8px] uppercase tracking-widest font-bold opacity-60">New</span>
                          {candidate.score > 80 && <span className="px-2 py-1 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-[8px] uppercase tracking-widest font-bold text-neon-cyan">Shortlisted</span>}
                        </div>
                        <p className="text-xs font-sans font-light leading-relaxed text-white/50 line-clamp-3 text-balance mb-4">
                          {candidate.text_snippet}
                        </p>
                      </div>

                      <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${candidate.score}%` }}
                          transition={{ duration: 2, ease: "circOut" }}
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${index === 0 ? 'from-neon-cyan to-royal-purple shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'from-white/30 to-white/50'}`}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setSelectedCandidate(candidate)}
                          className="col-span-2 py-3 rounded-xl glass border border-white/10 text-[9px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                          View reasoning
                        </button>
                      </div>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Candidate Detail Drawer Overlay */}
        <AnimatePresence>
          {selectedCandidate && (
            <>
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCandidate(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] cursor-pointer"
              />
              
              {/* Drawer */}
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-[#050505] z-[70] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-white/5 flex flex-col"
              >
                {/* Drawer Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center font-serif text-xl text-neon-cyan border border-neon-cyan/30">
                      {selectedCandidate.score}%
                    </div>
                    <div>
                      <h2 className="text-xl font-serif truncate max-w-[200px]">{selectedCandidate.filename}</h2>
                      <div className="micro-label text-neon-cyan opacity-100">ATS Score Analysis</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCandidate(null)}
                    className="p-3 rounded-full hover:bg-white/5 transition-colors group"
                  >
                    <X size={20} className="text-white/40 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-12">
                  {selectedCandidate.analysis ? (
                    <>
                      <section className="space-y-4">
                        <div className="micro-label">Match Summary</div>
                        <p className="text-white/70 font-light leading-relaxed text-balance italic">
                          "{selectedCandidate.analysis.summary}"
                        </p>
                      </section>

                      <section className="space-y-4">
                        <div className="micro-label">Fit Analysis</div>
                        <p className="text-white/70 font-light leading-relaxed text-balance">
                          {selectedCandidate.analysis.detailed_fit}
                        </p>
                      </section>

                      <section className="space-y-6">
                        <div className="micro-label text-neon-cyan opacity-100">Strong Matches</div>
                        <ul className="space-y-3">
                          {selectedCandidate.analysis.strong_matches.map((match, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-light">
                              <CheckCircle2 size={14} className="text-neon-cyan mt-1 flex-shrink-0" />
                              {match}
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="space-y-6">
                        <div className="micro-label text-red-400 opacity-100">Missing or Weak Areas</div>
                        <ul className="space-y-3">
                          {selectedCandidate.analysis.gaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/60 font-light">
                              <AlertCircle size={14} className="text-red-400 mt-1 flex-shrink-0" />
                              {gap}
                            </li>
                          ))}
                        </ul>
                      </section>

                      <section className="space-y-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5">
                        <div className="micro-label text-neon-cyan opacity-100">Interview Prep</div>
                        <ul className="space-y-4">
                          {selectedCandidate.analysis.interview_questions?.map((q, i) => (
                            <li key={i} className="space-y-2">
                              <div className="text-[10px] uppercase tracking-widest font-bold opacity-30">Question 0{i+1}</div>
                              <p className="text-sm text-white/80 font-medium leading-relaxed italic">
                                "{q}"
                              </p>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <Sparkles size={40} className="animate-pulse" />
                      <p className="micro-label">Detailed AI Review Unavailable<br/>ML Model match score displayed above</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </main>

      <footer className="relative z-10 py-12 border-t border-white/5 mt-48">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Fingerprint className="text-neon-cyan" size={18} />
            <span className="font-serif italic text-lg tracking-tight">AI Resume Screener</span>
          </div>
          <div className="micro-label mb-0">© 2026. Built with React & FastAPI.</div>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold opacity-40">
            <a href="https://github.com/YeswanthTejaJakka/ML_Resume_Screnner" className="hover:text-neon-cyan transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/yeswanth-teja/" className="hover:text-neon-cyan transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

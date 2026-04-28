import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Fingerprint,
  Sparkles,
  Command,
  ArrowRight,
  X
} from 'lucide-react';
import OrganicBackground from './components/OrganicBackground';
import MagneticButton from './components/MagneticButton';
import { LetterSlideReveal, AtmosphericSubtitle, ScrollReveal } from './components/KineticTypography';
import MouseFollower from './components/MouseFollower';
import BackgroundGrid from './components/BackgroundGrid';

const App = () => {
  const [jobDesc, setJobDesc] = useState('');
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
      const response = await axios.post('http://localhost:8000/screen', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Keep scanning for a brief moment to feel "processed"
      setTimeout(() => {
        setResults(response.data.candidates_ranked);
        setIsScanning(false);
      }, 1000);
      
    } catch {
      setError("Ecosystem connection failed. Verify engine status.");
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
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})} className="cursor-pointer hover:opacity-100 transition-opacity">How it works</button>
              <button onClick={() => document.getElementById('features')?.scrollIntoView({behavior: 'smooth'})} className="cursor-pointer hover:opacity-100 transition-opacity">Features</button>
              <button onClick={() => document.getElementById('pricing')?.scrollIntoView({behavior: 'smooth'})} className="cursor-pointer hover:opacity-100 transition-opacity">Pricing</button>
              <button onClick={handleScrollToResults} className="cursor-pointer hover:opacity-100 transition-opacity">App</button>
            </div>
          </motion.nav>
        </div>

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
              
              <button className="micro-label hover:opacity-100 transition-opacity underline underline-offset-8 decoration-white/20">
                Watch Demo
              </button>
            </motion.div>

            {/* Social Proof Bar */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.2 }}
              className="pt-8 border-t border-white/5 space-y-4"
            >
              <div className="text-[8px] uppercase tracking-[0.3em] font-bold">Trusted by fast-moving teams at</div>
              <div className="flex flex-wrap gap-8 grayscale opacity-50">
                <span className="font-serif italic text-lg tracking-tighter">Velocity</span>
                <span className="font-serif italic text-lg tracking-tighter">Nexus</span>
                <span className="font-serif italic text-lg tracking-tighter">Aura</span>
                <span className="font-serif italic text-lg tracking-tighter">Pulse</span>
              </div>
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
                placeholder="Describe the ideal candidate profile... (e.g. Senior backend engineer, 5+ years, Python or Node.js...)"
                className="w-full h-48 bg-transparent border-none text-white/80 placeholder:text-white/20 outline-none resize-none font-sans text-sm leading-relaxed"
              />
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                  <Command size={14} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Semantic Engine Active</span>
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
                  <div className="mt-4 px-4 py-1 rounded-full glass border border-white/20 text-[10px] font-bold text-neon-cyan bg-neon-cyan/10">
                    {files.length} Files Cached
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Status Message */}
        <AnimatePresence>
          {results && !isScanning && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-24 flex flex-col items-center gap-4"
            >
              <div className="p-2 rounded-full bg-neon-cyan/20 border border-neon-cyan/40">
                <CheckCircle2 size={24} className="text-neon-cyan" />
              </div>
              <span className="micro-label text-neon-cyan opacity-100">Analysis Complete. Shortlist Generated.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Problem & Value Prop Section */}
        <section className="mt-48 grid grid-cols-1 md:grid-cols-2 gap-24">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="micro-label text-red-400 opacity-100">The Problem</div>
              <h2 className="text-4xl font-serif leading-tight">Why traditional resume screening fails</h2>
              <ul className="space-y-4 text-white/60 font-light">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                  Recruiters spend hours scanning resumes line by line.
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                  Great candidates get missed due to keyword-heavy job boards.
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                  Inconsistent decisions due to different reviewer criteria.
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                  Hiring teams rely on gut feel instead of structured signals.
                </li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="space-y-8">
              <div className="micro-label text-neon-cyan opacity-100">The Solution</div>
              <h2 className="text-4xl font-serif leading-tight">What AI Resume Screener does for you</h2>
              <ul className="space-y-4 text-white/60 font-light">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-1" />
                  Reads every resume end-to-end, not just keywords.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-1" />
                  Understands your job requirements in natural language.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-1" />
                  Scores and ranks candidates based on real fit and experience.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-neon-cyan mt-1" />
                  Shows transparent explanations for every decision.
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="mt-48 space-y-24">
          <div className="text-center space-y-4">
            <div className="micro-label">Process</div>
            <h2 className="text-5xl font-serif italic">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Define the role", desc: "Paste your job description or describe your ideal candidate in plain language." },
              { step: "02", title: "Upload resumes", desc: "Drag and drop PDFs. The system parses skills, experience, and context automatically." },
              { step: "03", title: "Run the AI", desc: "Our semantic engine compares every resume to your role requirements in minutes." },
              { step: "04", title: "Review & Share", desc: "Filter by scores, see detailed reasoning, and export your shortlist." }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="premium-glass p-8 rounded-[30px] space-y-6 h-full border-white/5">
                  <div className="text-4xl font-serif italic text-white/10">{item.step}</div>
                  <h3 className="text-xl font-serif">{item.title}</h3>
                  <p className="text-sm text-white/40 font-light leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mt-48 space-y-24">
          <div className="text-center space-y-4">
            <div className="micro-label">Capabilities</div>
            <h2 className="text-5xl font-serif italic">Built for modern hiring</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Smart semantic matching", desc: "Stop relying on keyword hacks. The engine understands responsibilities and context." },
              { title: "Explainable scoring", desc: "Each candidate gets a 0–100 score with a clear explanation of matched skills and gaps." },
              { title: "Bulk resume intake", desc: "Upload dozens or hundreds of resumes in one go. The system parses them in the background." },
              { title: "Flexible filters", desc: "Filter by location, skills, seniority, or minimum score to find the perfect fit." },
              { title: "Profiles at a glance", desc: "See structured summaries of experience, education, and AI reasoning in a clean view." },
              { title: "Exports & Collaboration", desc: "Download CSVs or share secure links with your team for collaborative review." }
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="group p-8 rounded-[30px] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all">
                  <h3 className="text-xl font-serif mb-4 group-hover:text-neon-cyan transition-colors">{feature.title}</h3>
                  <p className="text-sm text-white/40 font-light leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Global Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 premium-glass border border-red-500/20 rounded-full text-red-400 micro-label flex items-center gap-3 z-50"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Section */}
        <section id="pricing" className="mt-48 space-y-24">
          <div className="text-center space-y-4">
            <div className="micro-label">Pricing</div>
            <h2 className="text-5xl font-serif italic text-balance">Simple pricing that scales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Starter", 
                price: "Free", 
                desc: "For solo founders and small teams.",
                features: ["1 active role", "Up to 100 resumes/mo", "Core AI screening", "CSV export"]
              },
              { 
                name: "Team", 
                price: "$149", 
                period: "/mo",
                desc: "For small HR teams and agencies.",
                features: ["Up to 5 active roles", "Up to 2,000 resumes/mo", "Advanced filters", "5 team seats", "Priority support"],
                popular: true
              },
              { 
                name: "Pro", 
                price: "Custom", 
                desc: "For high-volume hiring companies.",
                features: ["Up to 20 active roles", "Up to 10,000 resumes/mo", "Custom scoring tweaks", "Shared workspaces", "Dedicated success manager"]
              }
            ].map((plan, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`premium-glass p-10 rounded-[40px] flex flex-col h-full border-white/5 ${plan.popular ? 'border-neon-cyan/20 ring-1 ring-neon-cyan/20 bg-white/[0.04]' : ''}`}>
                  {plan.popular && <div className="micro-label text-neon-cyan mb-6">Most Popular</div>}
                  <div className="text-2xl font-serif mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-serif">{plan.price}</span>
                    {plan.period && <span className="text-white/40 text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-white/40 mb-8 h-10">{plan.desc}</p>
                  <ul className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((f, j) => (
                      <li key={j} className="text-xs text-white/60 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-neon-cyan" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 rounded-2xl micro-label transition-all ${plan.popular ? 'bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'glass border border-white/10 hover:bg-white/5'}`}>
                    {plan.price === "Custom" ? "Talk to Sales" : "Start Free Trial"}
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-48 max-w-3xl mx-auto space-y-24">
          <div className="text-center space-y-4">
            <div className="micro-label">FAQ</div>
            <h2 className="text-5xl font-serif italic">Common Questions</h2>
          </div>

          <div className="space-y-8">
            {[
              { q: "Will the AI replace my judgment?", a: "No. It handles the repetitive part—reading and ranking—so you can focus on high-quality evaluation. You stay in full control." },
              { q: "What file types do you support?", a: "We support PDFs and common document formats. Contact us for ATS integrations." },
              { q: "How accurate is the scoring?", a: "Scores are strong signals based on real-world outcomes. We clearly explain the reasoning behind every recommendation." },
              { q: "Is my data secure?", a: "We encrypt resumes in transit and at rest. We provide admin controls to delete roles and associated data." }
            ].map((faq, i) => (
              <ScrollReveal key={i}>
                <div className="space-y-4 border-b border-white/5 pb-8">
                  <h3 className="text-xl font-serif">{faq.q}</h3>
                  <p className="text-white/40 font-light leading-relaxed">{faq.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* About / Philosophy Section */}
        <section className="mt-48 py-24 premium-glass rounded-[60px] border-white/5 text-center px-12">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="micro-label">Our Philosophy</div>
              <h2 className="text-4xl font-serif leading-tight">AI should amplify human judgment—not replace it.</h2>
              <p className="text-white/60 font-light leading-relaxed">
                AI Resume Screener is built by engineers and hiring managers who have been on both sides of the process. We focus on transparent reasoning, customizable filters, and tooling that fits into your existing hiring flow.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {results && (
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
                          className="py-3 rounded-xl glass border border-white/10 text-[9px] uppercase tracking-widest font-bold hover:bg-neon-cyan hover:text-black transition-all"
                        >
                          Shortlist
                        </button>
                        <button 
                          className="py-3 rounded-xl glass border border-white/10 text-[9px] uppercase tracking-widest font-bold hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                          Reject
                        </button>
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
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                      <Sparkles size={40} className="animate-pulse" />
                      <p className="micro-label">Detailed AI Review Unavailable<br/>Semantic match score displayed above</p>
                    </div>
                  )}

                  <section className="pt-12 border-t border-white/5 space-y-6">
                    <div className="micro-label">Next Steps</div>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 rounded-2xl bg-neon-cyan text-black micro-label hover:shadow-[0_0_20px_rgba(0,242,255,0.3)] transition-all">
                        Shortlist
                      </button>
                      <button className="py-4 rounded-2xl glass border border-white/10 micro-label hover:bg-white/5 transition-all">
                        Schedule Call
                      </button>
                    </div>
                  </section>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-32 border-t border-white/5 mt-48">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Fingerprint className="text-neon-cyan" size={20} />
              <span className="font-serif italic text-xl">AI Resume Screener</span>
            </div>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              Screen hundreds of resumes in minutes with precision intelligence and explainable decisions.
            </p>
          </div>
          <div className="space-y-6">
            <div className="micro-label opacity-100">Product</div>
            <div className="flex flex-col gap-4 text-sm text-white/40">
              <a href="#features" className="hover:text-neon-cyan transition-colors">Features</a>
              <a href="#pricing" className="hover:text-neon-cyan transition-colors">Pricing</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Security</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Roadmap</a>
            </div>
          </div>
          <div className="space-y-6">
            <div className="micro-label opacity-100">Support</div>
            <div className="flex flex-col gap-4 text-sm text-white/40">
              <a href="#" className="hover:text-neon-cyan transition-colors">Help Center</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Contact</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Status</a>
              <a href="#" className="hover:text-neon-cyan transition-colors">Privacy</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="micro-label mb-0">© 2026 AI Resume Screener. All rights reserved.</div>
          <div className="text-[10px] tracking-[0.5em] uppercase font-bold opacity-20">Handcrafted by Creative Technologists</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
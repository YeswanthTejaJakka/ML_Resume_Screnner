import React from 'react';
import { motion } from 'framer-motion';

const ArtisticLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-12 px-4 md:px-8">
      {/* Mesh Gradient Background Layer */}
      <div className="mesh-gradient" aria-hidden="true" />
      
      {/* Animated Floating Gradients for extra depth */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] bg-neon-cyan/10 pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, -60, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-5%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[150px] bg-royal-purple/10 pointer-events-none"
      />

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-6xl">
        {children}
      </main>

      {/* Decorative footer line */}
      <footer className="mt-20 opacity-30 text-xs tracking-widest uppercase font-sans">
        Digital Excellence — 2026
      </footer>
    </div>
  );
};

export default ArtisticLayout;

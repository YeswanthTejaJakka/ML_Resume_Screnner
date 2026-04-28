import React from 'react';
import { motion } from 'framer-motion';

const OrganicBackground = () => {
  return (
    <>
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Mesh Gradient Container */}
      <div className="mesh-container">
        {/* Blob 1 - Cyan */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="blob w-[600px] h-[600px] bg-neon-cyan/20 -top-[10%] -left-[10%]"
        />

        {/* Blob 2 - Purple */}
        <motion.div
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 100, -40, 0],
            scale: [1.1, 0.9, 1.2, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="blob w-[700px] h-[700px] bg-royal-purple/20 -bottom-[10%] -right-[10%]"
        />

        {/* Blob 3 - Cyan */}
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, 150, 20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="blob w-[500px] h-[500px] bg-neon-cyan/15 top-[30%] left-[40%]"
        />

        {/* Blob 4 - Purple */}
        <motion.div
          animate={{
            x: [0, 120, -60, 0],
            y: [0, -100, 40, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="blob w-[550px] h-[550px] bg-royal-purple/15 bottom-[20%] left-[10%]"
        />
      </div>
    </>
  );
};

export default OrganicBackground;

import React from 'react';
import { motion } from 'framer-motion';

export const LetterSlideReveal = ({ text, className }) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.1 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 100,
    },
  };

  return (
    <motion.h1
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          variants={child}
          key={index}
          style={{ display: 'inline-block' }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export const AtmosphericSubtitle = ({ text, className, targetOpacity = 0.4 }) => {
  return (
    <motion.p
      initial={{ opacity: 0, letterSpacing: '0.1em' }}
      animate={{ opacity: targetOpacity, letterSpacing: '0.4em' }}
      transition={{ 
        duration: 2.5, 
        ease: "easeOut",
        opacity: { duration: 1.5 }
      }}
      className={className}
    >
      {text}
    </motion.p>
  );
};

export const ScrollReveal = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

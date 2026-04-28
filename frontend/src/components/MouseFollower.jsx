import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const MouseFollower = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 100);
      cursorY.set(e.clientY - 100);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <motion.div
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      className="fixed inset-0 pointer-events-none z-[1] w-[200px] h-[200px] rounded-full bg-neon-cyan/5 blur-[100px]"
    />
  );
};

export default MouseFollower;

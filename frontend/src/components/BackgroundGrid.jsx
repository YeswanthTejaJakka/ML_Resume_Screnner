import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BackgroundGrid = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-2] overflow-hidden">
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[120%]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </motion.div>
    </div>
  );
};

export default BackgroundGrid;

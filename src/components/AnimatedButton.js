'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';

const AnimatedButton = ({ text, imagePath, backgroundClass, textSize, backgroundMode = 'hover' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isStaticBackground = useMemo(() => backgroundMode === 'static', [backgroundMode]);
  
  const handleHoverStart = useCallback(() => setIsHovered(true), []);
  const handleHoverEnd = useCallback(() => setIsHovered(false), []);
  
  return (
    <>
    
    <motion.button
      className={`font-scratchy ${textSize} text-bold antialiased relative inline-block px-3 py-1.5 sm:px-5 sm:py-2.5 no-underline text-black rounded overflow-hidden cursor-pointer text-center z-[2]`}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Background que aparece na hover */}
      <motion.div
        className={backgroundClass}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          // Fallback para imagePath se backgroundClass não for fornecida
          ...(imagePath && !backgroundClass && {
            backgroundImage: `url(${imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }),
          overflow: 'hidden'
        }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ 
          scaleX: isStaticBackground ? 1 : (isHovered ? 1 : 0) 
        }}
        transition={{ 
          duration: isStaticBackground ? 0 : 0.7, 
          ease: "easeInOut" 
        }}
      />

      {/* Texto do botão */}
      <motion.span
        style={{ position: 'relative', zIndex: 1 }}
        animate={{ 
          color: '#000',
           textShadow: (isHovered || isStaticBackground) ? '0px 0px 2px rgba(0,0,0,0.6)' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.span>
    </motion.button>
  
    </>
    
  );
};

export default AnimatedButton;
'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

const AnimatedButton = ({ text, imagePath, textSize, backgroundMode = 'hover' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isStaticBackground = backgroundMode === 'static';
  
  return (
    <motion.button
      className={`font-scratchy ${textSize} text-bold antialiased`}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: '10px 20px',
        textDecoration: 'none',
        color: '#000',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'center',
        zIndex: 2
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
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

      {/* Imagem que aparece na hover */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          backgroundImage: `url(${imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
        initial={{ scaleX: isStaticBackground ? 1 : 0, originX: 0 }}
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
  );
};

export default AnimatedButton;
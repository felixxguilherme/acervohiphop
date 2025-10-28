'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';

const PolaroidCard2 = ({ 
  imageSrc = "https://images.unsplash.com/photo-1629753863735-4c9ba15bc10b", 
  caption = "Distrito HipHop" 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="h-full w-full flex justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="bg-amber-50 shadow-xl rounded-sm p-4 w-full h-full max-h-full relative border-2 border-amber-100 border-opacity-80 overflow-hidden"
        animate={{ 
          rotate: isHovered ? 0 : 2,
          scale: isHovered ? 1.02 : 1
        }}
        transition={{ 
          duration: 0.4,
          ease: "easeInOut"
        }}
        style={{
          boxShadow: "0 10px 15px -3px rgba(160, 120, 40, 0.3), 0 4px 6px -4px rgba(160, 120, 40, 0.2)",
        }}
      >
        {/* Polaroid topo irregular */}
        <div className="relative w-full h-full">
          {/* Área da foto com borda amarelada e efeito antigo */}
          <div className="bg-amber-100 w-full h-5/6 overflow-hidden relative border border-amber-200">
            {/* Overlay para simular foto antiga */}
            <div className="absolute inset-0 bg-yellow-900 bg-opacity-10 z-10 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-yellow-700 opacity-20 z-10 mix-blend-overlay pointer-events-none"></div>
            
            {/* Manchas aleatórias para dar aparência antiga */}
            <div className="absolute top-5 left-10 w-8 h-4 bg-yellow-100 rounded-full opacity-30 rotate-45"></div>
            <div className="absolute bottom-12 right-20 w-10 h-6 bg-amber-100 rounded-full opacity-20 -rotate-12"></div>
            
            {/* Imagem principal - hip-hop/cultura urbana */}
            <img 
              src={imageSrc}
              alt={caption} 
              className="w-full h-full object-cover"
            />

            {/* Canto dobrado */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 origin-top-right rotate-[-10deg] transform-gpu translate-x-4 -translate-y-4"></div>
          </div>
          
          {/* Marcas de desgaste nos cantos */}
          <div className="absolute top-1 left-1 w-4 h-4 bg-amber-200 opacity-40 rounded-full"></div>
          <div className="absolute top-2 right-3 w-5 h-3 bg-amber-100 opacity-30 rounded-full"></div>
          
          {/* Área amarelada abaixo da foto típica de polaroid */}
          <div className="h-1/6 flex items-center justify-center">
            <motion.p 
              className="polaroid-caption text-lg italic opacity-80" 
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ fontFamily: "cursive", color: "#92400e" }}
            >
              {caption}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PolaroidCard2;
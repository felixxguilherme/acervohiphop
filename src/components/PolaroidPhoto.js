'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import AnimatedButton from './AnimatedButton';

const PolaroidCard = ({ 
  imageSrc, 
  caption = "Suas memórias aqui",
  tape = null,
  secondTape = null
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const tapeImage = new Image();
          tapeImage.src = '/silvertape02.png';

          const tapeImage2 = new Image();
          tapeImage2.src = '/silvertape01.png';
          
          const polaroidImage = new window.Image();
          polaroidImage.src = imageSrc;
          
          // Verificar se as imagens estão carregadas
          if (tapeImage.complete && tapeImage2.complete && polaroidImage.complete) {
            setIsLoading(false);
          } else {
            const handleLoad = () => {
              if (tapeImage.complete && tapeImage2.complete && polaroidImage.complete) {
                setIsLoading(false);
              }
            };
            
            tapeImage.onload = handleLoad;
            tapeImage2.onload = handleLoad;
            polaroidImage.onload = handleLoad;
            
            // Fallback em caso de erro
            tapeImage.onerror = () => setIsLoading(false);
            tapeImage2.onerror = () => setIsLoading(false);
            polaroidImage.onerror = () => setIsLoading(false);
            
            // Timeout de segurança
            setTimeout(() => setIsLoading(false), 2000);
          }
        }
    }, [imageSrc]);

  // Função para determinar posicionamento da fita baseado na propriedade
  const getTapeStyles = () => {
    if (!tape) return null;
    
    const { position = 'top-left', angle = 0 } = tape;
    
    // Posições base
    const positions = {
      'top-left': { x: '-45%', y: '-45%', classes: 'top-0 left-0' },
      'top-right': { x: '40%', y: '-40%', classes: 'top-0 right-0' },
      'top-center': { x: '-50%', y: '-50%', classes: 'top-0 left-1/2' },
      'bottom-left': { x: '-40%', y: '40%', classes: 'bottom-0 left-0' },
      'bottom-right': { x: '40%', y: '40%', classes: 'bottom-0 right-0' },
      'bottom-center': { x: '-50%', y: '50%', classes: 'bottom-0 left-1/2' },
    };
    
    // Obter a posição ou default para top-left
    const pos = positions[position] || positions['top-left'];
    
    return {
      className: `absolute ${pos.classes} w-36 h-36 md:w-48 md:h-48 z-10`,
      style: {
        transform: `translate(${pos.x}, ${pos.y}) rotate(${angle}deg)`
      }
    };
  };

  const getTape2Styles = () => {
    if (!secondTape) return null;
    
    const { position = 'top-left', angle = 0 } = secondTape;
    
    // Posições base
    const positions = {
      'top-left': { x: '-45%', y: '-45%', classes: 'top-0 left-0' },
      'top-right': { x: '40%', y: '-40%', classes: 'top-0 right-0' },
      'top-center': { x: '-50%', y: '-50%', classes: 'top-0 left-1/2' },
      'bottom-left': { x: '-40%', y: '40%', classes: 'bottom-0 left-0' },
      'bottom-right': { x: '40%', y: '40%', classes: 'bottom-0 right-0' },
      'bottom-center': { x: '-50%', y: '50%', classes: 'bottom-0 left-1/2' },
    };
    
    // Obter a posição ou default para top-left
    const pos = positions[position] || positions['top-left'];
    
    return {
      className: `absolute ${pos.classes} w-18 h-18 md:w-24 md:h-24 z-10`,
      style: {
        transform: `translate(${pos.x}, ${pos.y}) rotate(${angle}deg)`
      }
    };
  };
  
  // Obter estilos da fita
  const tapeStyles = getTapeStyles();
  const tape2Styles = getTape2Styles();
  
  return (
    <motion.div 
      className="flex justify-center items-center w-full h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className="bg-white shadow-xl rounded-sm p-2 md:p-3 w-full h-full max-w-full max-h-full relative"
        
      >
        {/* Silver Tape */}
        {tape && !isLoading && (
          <div className={tapeStyles.className} style={tapeStyles.style}>
            <img 
              src="/silvertape02.png" 
              alt="Silver tape" 
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {secondTape && !isLoading && (
          <div className={tape2Styles.className} style={tape2Styles.style}>
            <img 
              src="/silvertape01.png" 
              alt="Silver tape" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
        
        {/* Área da foto */}
        <div className="relative bg-gray-200 h-5/6 w-full overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full bg-gray-300 animate-pulse"></div>
          ) : (
            <>
            <img 
              src={imageSrc} 
              alt={caption} 
              className="w-full h-full object-cover"
            />
            </>
          )}
        </div>
        
        {/* Área branca abaixo da foto */}
        <div className="h-1/6 flex items-center justify-center">
          <p className="text-gray-700 text-2xl font-scratchy px-2 text-center">{caption}</p>
        </div>
        
      </motion.div>
    </motion.div>
  );
};

export default PolaroidCard;
'use client'
import { useState, useEffect } from 'react';

const PreloadedBackground = ({ 
  backgroundClass, 
  placeholderColor = '#f3f4f6', 
  children, 
  className = '', 
  style = {} 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Determinar qual imagem carregar baseado na classe
    let imageSrc = '';
    if (backgroundClass === 'fundo-base') {
      imageSrc = '/fundo_base.jpg';
    } else if (backgroundClass === 'fundo-base-preto') {
      imageSrc = '/fundo_base_preto.jpg';
    }

    if (imageSrc) {
      const img = new Image();
      
      img.onload = () => {
        setImageLoaded(true);
        setImageError(false);
      };
      
      img.onerror = () => {
        setImageError(true);
        setImageLoaded(false);
      };
      
      img.src = imageSrc;
    }
  }, [backgroundClass]);

  return (
    <div 
      className={`${className} transition-all duration-500 ease-out ${
        imageLoaded ? backgroundClass : ''
      }`}
      style={{
        ...style,
        backgroundColor: !imageLoaded && !imageError ? placeholderColor : 'transparent',
        backgroundImage: imageError ? 'none' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Loading indicator (opcional) */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin opacity-30"></div>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default PreloadedBackground;
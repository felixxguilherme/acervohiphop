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
      imageSrc = '/fundo_base.webp';
    } else if (backgroundClass === 'fundo-base-preto') {
      imageSrc = '/fundo_base_preto.webp';
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
      
      {children}
    </div>
  );
};

export default PreloadedBackground;
"use client";

import { useState, useEffect } from 'react';

export function useBackgroundImage(imageSrc, enabled = true) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!enabled || !imageSrc) {
      setIsLoaded(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    const handleLoad = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
      console.warn(`Failed to load background image: ${imageSrc}`);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    img.src = imageSrc;

    // Cleanup
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageSrc, enabled]);

  return { isLoaded, isLoading, hasError };
}

export function useThemeBackground(theme) {
  const lightImage = '/fundo_base.webp';
  const darkImage = '/fundo_base_preto.webp';
  
  const currentImage = theme === 'light' ? lightImage : darkImage;
  
  const { isLoaded, isLoading, hasError } = useBackgroundImage(currentImage, true);
  
  // Classes CSS baseadas no estado
  const getBackgroundClass = () => {
    const baseClass = theme === 'light' 
      ? 'theme-background-light' 
      : 'theme-background-dark';
    
    if (isLoading) {
      return `${baseClass} theme-background-loading`;
    }
    
    if (isLoaded && !hasError) {
      return `${baseClass} bg-loaded`;
    }
    
    // Fallback: apenas cor sólida
    return baseClass;
  };

  return {
    backgroundClass: getBackgroundClass(),
    isLoaded,
    isLoading,
    hasError,
    currentImage
  };
}
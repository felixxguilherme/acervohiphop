import { useState, useEffect } from 'react';

const useImagePreloader = (imageSrc, options = {}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { priority = false, timeout = 10000 } = options;

  useEffect(() => {
    if (!imageSrc) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setLoaded(false);

    const img = new Image();
    
    // Configurar prioridade de carregamento
    if (priority) {
      img.fetchPriority = 'high';
    }
    
    // Timer para timeout
    const timeoutId = setTimeout(() => {
      setError(true);
      setLoading(false);
      console.warn(`Timeout carregando imagem: ${imageSrc}`);
    }, timeout);

    img.onload = () => {
      clearTimeout(timeoutId);
      setLoaded(true);
      setLoading(false);
      setError(false);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      setError(true);
      setLoading(false);
      setLoaded(false);
      console.error(`Erro carregando imagem: ${imageSrc}`);
    };

    img.src = imageSrc;

    return () => {
      clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, priority, timeout]);

  return { loaded, error, loading };
};

export default useImagePreloader;
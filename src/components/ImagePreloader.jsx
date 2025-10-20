'use client'
import { useEffect } from 'react';

const ImagePreloader = () => {
  useEffect(() => {
    // Lista de imagens críticas para precarregar
    const criticalImages = [
      '/fundo_base.jpg',
      '/fundo_base_preto.jpg',
      '/marca-texto-vermelho.png',
      '/marca-texto-amarelo.png',
      '/marca-texto-azul.png',
      '/marca-texto-verde.png'
    ];

    // Precarregar imagens de forma assíncrona
    const preloadImages = async () => {
      const imagePromises = criticalImages.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.fetchPriority = 'high'; // Prioridade alta
          img.onload = () => resolve(src);
          img.onerror = () => {
            resolve(src); // Não falhar por uma imagem
          };
          img.src = src;
        });
      });

      try {
        await Promise.allSettled(imagePromises);
        // Imagens críticas pré-carregadas
      } catch (error) {
        // Erro no pré-carregamento
      }
    };

    // Aguardar um pouco antes de iniciar o preload
    // para não bloquear o carregamento inicial da página
    const timeoutId = setTimeout(preloadImages, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return null; // Componente invisível
};

export default ImagePreloader;
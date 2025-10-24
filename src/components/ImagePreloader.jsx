'use client'
import { useEffect } from 'react';

const ImagePreloader = () => {
  useEffect(() => {
    // Lista de imagens por prioridade
    const priorityImages = [
      // ALTA PRIORIDADE: Backgrounds de tema (sempre visíveis)
      '/fundo_base.webp',
      '/fundo_base_preto.webp'
    ];
    
    const secondaryImages = [
      // MÉDIA PRIORIDADE: Elementos de UI comuns
      '/marca-texto-vermelho.webp',
      '/marca-texto-amarelo.webp',
      '/marca-texto-azul.webp',
      '/marca-texto-verde.webp'
    ];
    
    const tertiaryImages = [
      // BAIXA PRIORIDADE: Elementos decorativos
      '/spray_preto-2.webp',
      '/spray_amarelo-1.webp',
      '/spray_azul-1.webp',
      '/silvertape01.webp'
    ];

    // Função para precarregar com prioridade específica
    const preloadImageSet = (images, priority = 'high') => {
      return images.map(src => {
        return new Promise((resolve) => {
          const img = new Image();
          img.fetchPriority = priority;
          img.onload = () => {
            resolve(src);
          };
          img.onerror = () => {
            console.warn(`❌ Failed to load: ${src}`);
            resolve(src); // Não falhar por uma imagem
          };
          img.src = src;
        });
      });
    };

    // Precarregar em sequência por prioridade
    const preloadImages = async () => {
      try {
        // 1. PRIORIDADE ALTA: Backgrounds (críticos para tema)
        await Promise.all(preloadImageSet(priorityImages, 'high'));
        
        // 2. PRIORIDADE MÉDIA: UI elements (carrega depois)
        setTimeout(async () => {
          await Promise.all(preloadImageSet(secondaryImages, 'low'));
          
          // 3. PRIORIDADE BAIXA: Decorações (carrega por último)
          setTimeout(async () => {
            await Promise.all(preloadImageSet(tertiaryImages, 'low'));
          }, 1000);
        }, 500);
      } catch (error) {
        console.error('Error preloading images:', error);
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
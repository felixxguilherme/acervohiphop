'use client'

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SpinningText } from './magicui/spinning-text';
import { motion, AnimatePresence } from 'motion/react';

const GlobalLoader = ({ children }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Atualiza quando o tema muda
    setCurrentTheme(theme);
  }, [theme]);

  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Lista de assets críticos para preload
        const criticalAssets = [
          '/fundo_base.webp',
          '/fundo_base_preto.webp',
          '/marca-texto-amarelo.webp',
          '/marca-texto-vermelho.webp',
          '/marca-texto-azul.webp',
          '/marca-texto-verde.webp',
          '/spray_preto-1.webp',
          '/spray_preto-2.webp'
        ];

        // Criar promises para carregar todas as imagens com validação completa
        const imagePromises = criticalAssets.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
              // Verificar se a imagem foi realmente carregada completamente
              if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                console.log(`✅ Asset carregado: ${src}`);
                resolve(src);
              } else {
                console.warn(`⚠️ Asset incompleto: ${src}`);
                reject(new Error(`Falha ao carregar ${src}`));
              }
            };
            
            img.onerror = () => {
              console.error(`❌ Erro ao carregar: ${src}`);
              reject(new Error(`Erro ao carregar ${src}`));
            };
            
            // Definir src por último para começar o carregamento
            img.src = src;
          });
        });

        console.log('🔄 Iniciando carregamento de assets...');
        
        // Aguardar TODAS as imagens carregarem completamente
        await Promise.allSettled(imagePromises);
        
        console.log('✅ Todos os assets processados');

        // Aguardar que o DOM esteja completamente carregado
        if (document.readyState !== 'complete') {
          console.log('⏳ Aguardando DOM...');
          await new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
          });
        }

        // Aguardar um tempo mínimo para o loader ser visível (UX)
        await new Promise(resolve => setTimeout(resolve, 800));

        console.log('🎯 Loader finalizado - exibindo conteúdo');
        setIsLoading(false);
        
      } catch (error) {
        console.error('Erro crítico no carregamento:', error);
        // Timeout de segurança mais longo para garantir carregamento
        setTimeout(() => {
          console.log('⏰ Timeout de segurança - removendo loader');
          setIsLoading(false);
        }, 3000);
      }
    };

    preloadAssets();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 z-[99999] flex items-center justify-center"
            style={{
              backgroundColor: currentTheme === 'dark' ? '#000000' : '#FFFFFF',
              backgroundImage: 'none',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              {/* SpinningText Loader */}
              <SpinningText
                radius={8}
                className={`h-32 w-32 text-lg tracking-[0.2em] font-scratchy ${
                  currentTheme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                ACERVO • DISTRITO • HIP HOP •
              </SpinningText>

              {/* Texto complementar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center space-y-2"
              >
                <p className={`font-sometype-mono text-sm ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Carregando patrimônio cultural...
                </p>
                
                {/* Indicador de progresso visual */}
                <div className={`w-48 h-1 rounded-full overflow-hidden ${
                  currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className={`h-full rounded-full ${
                      currentTheme === 'dark' ? 'bg-white' : 'bg-black'
                    }`}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Conteúdo da página */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.6, delay: isLoading ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default GlobalLoader;
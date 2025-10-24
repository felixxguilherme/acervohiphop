"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedButton from '@/components/AnimatedButton';
import HeaderApp from '@/components/html/HeaderApp';

const Audiovisual = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estratégia de carregamento otimizado - mesma da homepage
    if (typeof window !== 'undefined') {
      // Pré-armazenar a imagem em cache
      const bgImage = new window.Image();
      bgImage.src = '/fundo_base.webp';

      // Adicionar preload no head se não existir
      let link = document.querySelector('link[href="/fundo_base.webp"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = '/fundo_base.webp';
        link.type = 'image/jpeg';
        link.fetchpriority = 'high';
        document.head.appendChild(link);
      }

      // Mostrar página quando imagem estiver carregada
      if (bgImage.complete) {
        setIsLoading(false);
      } else {
        bgImage.onload = () => setIsLoading(false);
        bgImage.onerror = () => setIsLoading(false);
        setTimeout(() => setIsLoading(false), 2000);
      }
    }
  }, []);

  return (
    <>
      {/* Tela de carregamento - mesma da homepage */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-16 bg-white rounded-sm"
                initial={{ height: 8 }}
                animate={{
                  height: [8, 40, 8],
                  backgroundColor: ["#ffffff", "#f8e71c", "#ffffff"]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da página */}
      <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <HeaderApp title="AUDIOVISUAL" showTitle={true} />

        {/* Page Content with Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full overflow-hidden"
          >
            <div className="container mx-auto px-4 pt-6 pb-16">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center text-theme"
              >
                <h2 className="font-sometype-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 max-w-4xl mx-auto">
                  <span className="marca-texto-verde px-2 py-1">Documentário</span>, <span className="marca-texto-verde px-2 py-1">videoclipes</span>, <span className="marca-texto-verde px-2 py-1">registros de eventos</span> e performances que capturam a essência do Hip Hop <span className="marca-texto-amarelo px-2 py-1">brasiliense</span>
                </h2>
                
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[
                    { title: 'Documentários', description: 'Filmes que contam a história do Hip Hop no DF' },
                    { title: 'Videoclipes', description: 'Produções musicais dos artistas locais' },
                    { title: 'Eventos', description: 'Registro de battles, shows e encontros' },
                    { title: 'Entrevistas', description: 'Depoimentos de pioneiros e veteranos' },
                    { title: 'Performances', description: 'Apresentações ao vivo e improvisações' },
                    { title: 'Making Of', description: 'Bastidores da produção cultural local' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border-2 border-theme cursor-pointer"
                    >
                      <h3 className="font-dirty-stains text-2xl font-semibold mb-3 text-theme">{item.title}</h3>
                      <p className="font-sometype-mono text-sm text-theme/80">{item.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Audiovisual;
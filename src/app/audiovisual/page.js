"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedButton from '@/components/AnimatedButton';

const Audiovisual = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estratégia de carregamento otimizado
    if (typeof window !== 'undefined') {
      // Simular carregamento rápido
      setTimeout(() => setIsLoading(false), 800);
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
        {/* Título ocupando toda a largura da tela - ACIMA DE TUDO */}
        <div className="w-full bg-transparent">
          <motion.h1
            className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-black text-center py-4 md:py-6 lg:py-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              letterSpacing: '0.05em',
              lineHeight: '0.9'
            }}
          >
            AUDIOVISUAL
          </motion.h1>
        </div>

        <motion.div
          className="relative w-full py-4 md:py-6 border-t-3 border-b-3 border-solid border-black z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-4 md:px-8">
            <div className="flex items-start px-4 absolute top-[-50px] left-[-50px]">
              <Image src="cursor03.png" alt="Marca de spray com escorrimento" width={150} height={180} />
            </div>
            {/* Navegação principal - centralizada */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 flex-1">
              <Link href="/">
                <AnimatedButton textSize="text-3xl" text="INÍCIO" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
              </Link>
            </div>
          </div>
        </motion.div>

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
            <div className="container mx-auto px-4 py-16">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center text-black"
              >
                <h2 className="font-sometype-mono text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 max-w-4xl mx-auto">
                  Documentário, videoclipes, registros de eventos e performances que capturam a essência do Hip Hop brasiliense
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
                      className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border-2 border-black cursor-pointer"
                    >
                      <h3 className="font-dirty-stains text-2xl font-semibold mb-3 text-black">{item.title}</h3>
                      <p className="font-sometype-mono text-sm text-black/80">{item.description}</p>
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
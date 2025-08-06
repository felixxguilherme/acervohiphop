"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

import AnimatedButton from '@/components/AnimatedButton';

import { TimelineDemo } from '@/components/acervo/Timeline';

// Componentes do Acervo
import HeroTimeline from '@/components/acervo/HeroTimeline';
import FilterBar from '@/components/acervo/FilterBar';
import StatsOverview from '@/components/acervo/StatsOverview';
import ItemsGrid from '@/components/acervo/ItemsGrid';

const Acervo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
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
            className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-theme-primary text-center py-4 md:py-6 lg:py-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              letterSpacing: '0.05em',
              lineHeight: '0.9'
            }}
          >
            ACERVO DIGITAL
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
            {/* Hero Timeline */}
            <HeroTimeline />

            {/* Stats Overview */}
            <StatsOverview />

            {/* Filter Bar */}
            {/* <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            /> */}

            {/* Items Grid */}
            {/* <ItemsGrid
              searchTerm={searchTerm}
              activeFilters={activeFilters}
            /> */}

            {/* Footer do Acervo */}
            {/* <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-black/60 backdrop-blur-md border-t border-white/20 mt-16 py-12"
            >
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    🎤 Acervo Hip Hop Distrito Federal
                  </h3>
                  <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Preservando e compartilhando a rica história da cultura Hip Hop no Distrito Federal,
                    desde os primeiros movimentos nos anos 80 até os dias atuais.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <h4 className="font-semibold text-white mb-1">Documentação</h4>
                    <p className="text-white/60 text-sm">
                      Fotografias, vídeos, documentos e registros históricos
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🗺️</div>
                    <h4 className="font-semibold text-white mb-1">Territórios</h4>
                    <p className="text-white/60 text-sm">
                      Mapeamento da cultura Hip Hop em todas as regiões do DF
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <h4 className="font-semibold text-white mb-1">Comunidade</h4>
                    <p className="text-white/60 text-sm">
                      Preservando memórias de artistas, crews e coletivos
                    </p>
                  </div>
                </div>

                <div className="text-white/40 text-sm">
                  <p>
                    Projeto desenvolvido em parceria com o Arquivo Público do Distrito Federal
                  </p>
                  <p className="mt-2">
                    © 2024 Acervo Hip Hop DF • Preservando nossa cultura
                  </p>
                </div>
              </div>
            </motion.footer> */}
          </motion.div>
        </AnimatePresence>
      </div>

      <TimelineDemo />
    </>
  );
};

export default Acervo;
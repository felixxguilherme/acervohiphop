/**
 * Hero Section com Timeline em Duas Colunas
 * Coluna esquerda: Texto informativo | Coluna direita: Slides com imagens
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomTimeline } from '../../hooks/useAtom.js';

export default function HeroTimeline() {
  const { events, loading } = useAtomTimeline();
  const [activeEvent, setActiveEvent] = useState(0);

  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        setActiveEvent((prev) => (prev + 1) % events.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length]);

  if (loading) {
    return (
      <div className="relative h-96 flex items-center justify-center">
        <div className="text-white text-xl">Carregando timeline...</div>
      </div>
    );
  }

  const currentEvent = events[activeEvent];

  return (
    <section className="relative border-4 border-black mx-6 my-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[500px]">
        {/* Coluna Esquerda - Texto */}
        <div className="p-8 flex flex-col justify-center border-r-4 border-black bg-white/30">
          <div className="max-w-lg">
            {/* Header */}
            <div className="mb-6">
              <div className="text-black text-xs font-black font-scratchy px-3 py-1 border-2 border-black inline-block mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] tracking-wider uppercase">
                Acervo Distrito Federal
              </div>
              <h2 className="font-sometype-mono text-3xl md:text-4xl font-black text-black mb-4 leading-tight">
                A história e a memória do Hip Hop no Distrito Federal
              </h2>
            </div>

            {/* Texto principal */}
            <div className="mb-6">
              <p className="font-sometype-mono text-lg text-black font-bold leading-relaxed bg-white/50 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Desde os anos 80, o Hip Hop no DF vem construindo uma identidade única, 
                misturando influências nacionais e internacionais com a realidade local 
                das periferias do Distrito Federal.
              </p>
            </div>

            {/* Info do evento atual */}
            <AnimatePresence mode="wait">
              {currentEvent && (
                <motion.div
                  key={activeEvent}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5 }}
                  className="text-white p-4 border-4 border-black shadow-[[6px_6px_0px_0px_rgba(0,0,0,1)]]"
                >
                  <div className="font-scratchy text-black text-xl font-black px-2 py-1 inline-block mb-2 border border-black">
                    {new Date(currentEvent.date).getFullYear()}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-black font-sometype-mono">
                    {currentEvent.title}
                  </h3>
                  <p className="text-sm font-bold leading-relaxed font-sometype-mono text-black">
                    {currentEvent.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Timeline dots */}
            <div className="flex space-x-3 mt-6">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveEvent(index)}
                  className={`w-4 h-4 transition-all duration-200 border-2 border-black ${
                    index === activeEvent 
                      ? 'bg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white hover:bg-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Slides com Imagens */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentEvent && (
              <motion.div
                key={activeEvent}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8 }}
                className="relative h-full"
              >
                {/* Imagem de fundo */}
                {currentEvent.items && currentEvent.items[0]?.thumbnail ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentEvent.items[0].thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-black/60" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500">
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                )}

                {/* Overlay com texto */}
                <div className="relative h-full flex items-end p-8">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-white"
                  >
                    <div className="font-scratchy bg-white text-black text-2xl font-black px-4 py-2 border-2 border-black inline-block mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] tracking-wider">
                      {new Date(currentEvent.date).getFullYear()}
                    </div>
                    
                    <h3 className="font-sometype-mono text-3xl md:text-4xl font-black mb-3 leading-tight text-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">
                      {currentEvent.title}
                    </h3>
                    
                    {currentEvent.items && currentEvent.items.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="font-scratchy bg-white text-black px-3 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {currentEvent.items.length} ITENS NO ACERVO
                        </div>
                        <div className="text-white/80 text-sm font-sometype-mono">
                          📁 {currentEvent.items[0]?.title}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Indicador de slide */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-white text-sm font-bold">
                  {activeEvent + 1} / {events.length}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controles de navegação */}
          <button
            onClick={() => setActiveEvent((prev) => (prev - 1 + events.length) % events.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border-2 border-white hover:bg-white/30 flex items-center justify-center transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setActiveEvent((prev) => (prev + 1) % events.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border-2 border-white hover:bg-white/30 flex items-center justify-center transition-all duration-200 group"
          >
            <svg className="w-6 h-6 text-white group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <motion.div
          key={activeEvent}
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-red-500"
        />
      </div>
    </section>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { CartoonButton } from '@/components/ui/cartoon-button';
import { NumberTicker } from '@/components/magicui/number-ticker';
import { useAtomTimeline, useAtomStatistics, useAtomItems } from '@/hooks/useAtom';

export default function AcervoPreview() {
  const [activeItem, setActiveItem] = useState(0);
  
  // Hooks para dados reais do acervo
  const { events: timelineEvents, loading: timelineLoading } = useAtomTimeline();
  const { statistics, loading: statsLoading } = useAtomStatistics();
  const { items: recentItems, loading: itemsLoading } = useAtomItems({ limit: 6, sort: 'date_desc' });

  // Pegar os primeiros 3 eventos da timeline para preview
  const previewEvents = timelineEvents.slice(0, 3);

  useEffect(() => {
    if (previewEvents.length > 0) {
      const interval = setInterval(() => {
        setActiveItem((prev) => (prev + 1) % previewEvents.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [previewEvents.length]);

  // Se está carregando, mostrar loading
  if (timelineLoading || statsLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mx-6 my-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white/90"
      >
        <div className="bg-[#fae523] border-b-4 border-black p-6">
          <div className="text-center">
            <h2 className="font-dirty-stains text-4xl md:text-5xl text-black mb-2">
              ACERVO DIGITAL
            </h2>
            <p className="font-sometype-mono text-lg text-black font-bold">
              Carregando dados do acervo...
            </p>
          </div>
        </div>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-16 bg-black rounded-sm"
                initial={{ height: 8 }}
                animate={{
                  height: [8, 40, 8],
                  backgroundColor: ["#000000", "#fae523", "#000000"]
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
      </motion.section>
    );
  }

  if (!previewEvents.length) {
    return null;
  }

  const currentEvent = previewEvents[activeItem];
  
  // Criar stats baseado nos dados reais
  const realStats = statistics ? [
    { 
      value: statistics.overview?.totalItems || 0, 
      label: "Itens Preservados", 
      icon: "📚" 
    },
    { 
      value: new Date().getFullYear() - 1980, 
      label: "Anos de História", 
      icon: "📅" 
    },
    { 
      value: statistics.overview?.totalDigitalObjects || 0, 
      label: "Objetos Digitais", 
      icon: "💾" 
    },
    { 
      value: parseInt(statistics.overview?.totalFileSize?.replace(' GB', '') || 0), 
      label: "GB Preservados", 
      icon: "💿" 
    }
  ] : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="my-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white/90"
    >
      {/* Header da seção */}
      <div className="border-b-4 border-black p-6 relative">
        <div className="flex items-start absolute top-[-30px] left-[-30px]">
          <Image src="/cursor03.png" alt="Marca de spray" width={100} height={120} />
        </div>
        <div className="text-center">
          <h2 className="font-dirty-stains text-4xl md:text-5xl text-black mb-2">
            ACERVO DIGITAL
          </h2>
          <p className="font-sometype-mono text-lg text-black font-bold">
            Preservando a memória do Hip Hop do DF
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 min-h-[400px]">
        {/* Coluna Esquerda - Timeline Preview */}
        <div className="p-8 border-r-4 border-black bg-white/50">
          <div className="mb-6">
            <div className="text-black text-sm font-black font-scratchy px-3 py-1 border-2 border-black inline-block mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#e08e6e]">
              AMOSTRA DO ACERVO
            </div>
            
            <p className="font-sometype-mono text-base text-black font-bold leading-relaxed mb-6">
              Desde os anos 80, documentamos a história do Hip Hop no Distrito Federal. 
              Fotografias, vídeos, documentos e registros históricos preservados digitalmente.
            </p>
          </div>

          {/* Item atual da timeline */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="bg-[#e08e6e]/70 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6"
            >
              <div className="font-scratchy text-black text-lg font-black px-2 py-1 inline-block mb-2 border border-black bg-white">
                {new Date(currentEvent.date).getFullYear()}
              </div>
              <h3 className="text-xl font-black mb-2 text-black font-sometype-mono">
                {currentEvent.title}
              </h3>
              <p className="text-sm font-bold leading-relaxed font-sometype-mono text-black mb-3">
                {currentEvent.description}
              </p>
              {currentEvent.items && currentEvent.items.length > 0 && (
                <div className="font-scratchy bg-black text-white px-2 py-1 text-xs font-black inline-block">
                  {currentEvent.items.length} itens no acervo
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots de navegação */}
          <div className="flex space-x-3 mb-6">
            {previewEvents.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveItem(index)}
                className={`w-4 h-4 transition-all duration-200 border-2 border-black ${
                  index === activeItem 
                    ? 'bg-[#e08e6e] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white hover:bg-[#e08e6e] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                }`}
              />
            ))}
          </div>

          {/* Itens recentes */}
          {!itemsLoading && recentItems.length > 0 && (
            <div className="mb-6">
              <h4 className="font-scratchy text-black text-sm font-black mb-3 uppercase tracking-wide">
                Itens Recentes no Acervo:
              </h4>
              <div className="space-y-2">
                {recentItems.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 bg-white/50 border border-black text-xs hover:bg-white/70 transition-colors"
                  >
                    {item.thumbnail && (
                      <div className="w-8 h-8 bg-cover bg-center border border-black flex-shrink-0"
                           style={{ backgroundImage: `url(${item.thumbnail})` }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-black truncate">{item.title}</div>
                      <div className="text-black/70">{new Date(item.createdAt).getFullYear()}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center z-0">
            <CartoonButton 
              color="bg-[#fae523]" 
              label="Explorar Acervo Completo!" 
              onClick={() => window.location.href = '/acervo'}
              className="shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
        </div>

        {/* Coluna Direita - Imagem e Stats */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
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
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500">
                  <div className="absolute inset-0 bg-black/40" />
                </div>
              )}

              {/* Overlay com info */}
              <div className="relative h-full flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="font-scratchy bg-[#fae523] text-black text-2xl font-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {new Date(currentEvent.date).getFullYear()}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-white text-sm font-bold">
                    {activeItem + 1} / {previewEvents.length}
                  </div>
                </div>

                {/* Stats rápidas na parte inferior */}
                <div className="grid grid-cols-2 gap-3">
                  {realStats.slice(0, 4).map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="bg-white/90 border-2 border-black p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-lg font-black text-black">
                        <NumberTicker value={stat.value} className="font-scratchy" />
                      </div>
                      <div className="text-xs font-bold text-black font-sometype-mono">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Barra de progresso */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
            <motion.div
              key={activeItem}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
              className="h-full bg-[#e08e6e]"
            />
          </div>

          {/* Controles de navegação */}
          <button
            onClick={() => setActiveItem((prev) => (prev - 1 + previewEvents.length) % previewEvents.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white hover:bg-white/30 flex items-center justify-center transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <button
            onClick={() => setActiveItem((prev) => (prev + 1) % previewEvents.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm border-2 border-white hover:bg-white/30 flex items-center justify-center transition-all duration-200"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.section>
  );
}
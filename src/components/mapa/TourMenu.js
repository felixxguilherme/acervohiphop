"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import storiesMapboxFormat from '@/data/storiesMapboxFormat';

// AIDEV-NOTE: Tour selection menu for fullscreen map mode
const TourMenu = ({ isFullscreen, onTourSelect, selectedTour }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isFullscreen) return null;

  const handleTourSelect = (tour) => {
    onTourSelect(tour);
    setIsExpanded(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 w-96 max-w-[calc(100vw-2rem)]"
    >
      <div className="bg-black/90 backdrop-blur-md border-2 border-yellow-400 rounded-lg shadow-2xl">
        {/* Menu Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-yellow-400 text-xl">🗺️</div>
              <div>
                <h3 className="font-dirty-stains text-xl text-white">TOURS INTERATIVOS</h3>
                <p className="text-white/60 text-xs font-mono">
                  {selectedTour ? selectedTour.title : 'Selecione uma história para explorar'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-yellow-400 hover:bg-yellow-300 text-black px-3 py-2 rounded text-sm font-mono transition-colors flex items-center gap-2"
            >
              {selectedTour ? 'Trocar' : 'Escolher'} Tour
              <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        </div>

        {/* Tours List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {storiesMapboxFormat.map((tour, index) => (
                  <motion.button
                    key={tour.id}
                    onClick={() => handleTourSelect(tour)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                      selectedTour?.id === tour.id
                        ? 'bg-yellow-400/20 border-yellow-400 shadow-lg'
                        : 'bg-white/5 border-white/20 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Tour Thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-12 rounded bg-yellow-400/20 border border-white/20 flex items-center justify-center">
                          <span className="text-2xl">📖</span>
                        </div>
                      </div>
                      
                      {/* Tour Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-dirty-stains text-lg text-white mb-1 line-clamp-1">
                          {tour.title}
                        </h4>
                        <p className="text-white/70 text-xs mb-2 line-clamp-2">
                          {tour.subtitle}
                        </p>
                        
                        {/* Tour Metadata */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1 text-yellow-400">
                            📍 {tour.chapters.length} capítulos
                          </span>
                          <span className="flex items-center gap-1 text-white/60">
                            👤 {tour.author || tour.byline}
                          </span>
                        </div>
                        
                        {/* Theme indicator */}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs border border-white/20">
                            {tour.theme}
                          </span>
                        </div>
                      </div>
                      
                      {/* Selection Indicator */}
                      <div className="flex-shrink-0 flex items-center">
                        {selectedTour?.id === tour.id ? (
                          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-white/40 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => onTourSelect(null)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded border border-white/20 transition-colors"
                  >
                    🚫 Sair do Tour
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-400 px-3 py-2 rounded border border-yellow-400/40 transition-colors"
                  >
                    ✨ Explorar Livre
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Tour Status */}
        {selectedTour && !isExpanded && (
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white/80">
                <span>📖</span>
                <span>Capítulo 1 de {selectedTour.chapters.length}</span>
              </div>
              <div className="text-yellow-400">
                ▶️ Tour Ativo
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TourMenu;
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
      <div className="bg-[#fae523] border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Menu Header */}
        <div className="p-4 border-b-3 border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-black text-xl">🗺️</div>
              <div>
                <h3 className="font-dirty-stains text-xl text-black">TOURS INTERATIVOS</h3>
                <p className="text-black/60 text-xs font-sometype-mono">
                  {selectedTour ? selectedTour.title : 'Selecione uma história para explorar'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-black text-[#fae523] hover:bg-gray-800 px-3 py-2 border-2 border-black text-sm font-sometype-mono transition-colors flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
                    className={`w-full text-left p-4 border-2 border-black transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                      selectedTour?.id === tour.id
                        ? 'bg-black text-[#fae523]'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Tour Thumbnail */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-12 bg-[#fae523] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <span className="text-2xl">📖</span>
                        </div>
                      </div>
                      
                      {/* Tour Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-dirty-stains text-lg mb-1 line-clamp-1 ${selectedTour?.id === tour.id ? 'text-[#fae523]' : 'text-black'}`}>
                          {tour.title}
                        </h4>
                        <p className={`text-xs mb-2 line-clamp-2 font-sometype-mono ${selectedTour?.id === tour.id ? 'text-[#fae523]/70' : 'text-black/70'}`}>
                          {tour.subtitle}
                        </p>
                        
                        {/* Tour Metadata */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`flex items-center gap-1 ${selectedTour?.id === tour.id ? 'text-[#fae523]' : 'text-black'}`}>
                            📍 {tour.chapters.length} capítulos
                          </span>
                          <span className={`flex items-center gap-1 ${selectedTour?.id === tour.id ? 'text-[#fae523]/60' : 'text-black/60'}`}>
                            👤 {tour.author || tour.byline}
                          </span>
                        </div>
                        
                        {/* Theme indicator */}
                        <div className="flex gap-1 mt-2 flex-wrap">
                          <span className={`px-2 py-1 text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${selectedTour?.id === tour.id ? 'bg-[#fae523] text-black' : 'bg-black text-[#fae523]'}`}>
                            {tour.theme}
                          </span>
                        </div>
                      </div>
                      
                      {/* Selection Indicator */}
                      <div className="flex-shrink-0 flex items-center">
                        {selectedTour?.id === tour.id ? (
                          <div className="w-6 h-6 bg-[#fae523] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <div className="w-3 h-3 bg-black"></div>
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t-3 border-black">
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => onTourSelect(null)}
                    className="flex-1 bg-white hover:bg-gray-100 text-black px-3 py-2 border-2 border-black transition-colors font-sometype-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    🚫 Sair do Tour
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="flex-1 bg-black hover:bg-gray-800 text-[#fae523] px-3 py-2 border-2 border-black transition-colors font-sometype-mono shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
          <div className="p-3 border-t-3 border-black">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-black/80 font-sometype-mono">
                <span>📖</span>
                <span>Capítulo 1 de {selectedTour.chapters.length}</span>
              </div>
              <div className="text-black font-sometype-mono">
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
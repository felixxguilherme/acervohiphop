'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMapLayers } from '@/hooks/useMapLayers';

// AIDEV-NOTE: Component for controlling map layers visibility and properties
const LayerControl = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mapLayers = useMapLayers();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-4 z-20 bg-white/95 backdrop-blur-sm border-2 border-black rounded-lg p-4 min-w-[280px] shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-dirty-stains text-2xl text-black">Controle de Camadas</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-black hover:text-black/70"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* AIDEV-NOTE: List all available layers */}
            {mapLayers.layers.map((layer) => (
              <motion.div
                key={layer.id}
                layout
                className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={layer.visible !== false}
                    onChange={() => mapLayers.toggleLayerVisibility(layer.id)}
                    className="w-4 h-4 text-[#fae523] border-2 border-black rounded focus:ring-[#fae523]"
                  />
                  <span className="font-sometype-mono text-sm text-black">
                    {layer.name || layer.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* AIDEV-NOTE: Layer reordering controls */}
                  <button
                    onClick={() => mapLayers.moveLayerUp(layer.id)}
                    className="px-2 py-1 text-xs bg-[#fae523] border border-black rounded hover:bg-[#f8e71c]"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => mapLayers.moveLayerDown(layer.id)}
                    className="px-2 py-1 text-xs bg-[#fae523] border border-black rounded hover:bg-[#f8e71c]"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                </div>
              </motion.div>
            ))}

            {/* AIDEV-NOTE: Layer management actions */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => mapLayers.toggleMultipleLayers(
                  mapLayers.layers.map(l => l.id), 
                  true
                )}
                className="flex-1 px-3 py-2 bg-[#fae523] border border-black rounded font-sometype-mono text-xs hover:bg-[#f8e71c]"
              >
                Mostrar Todas
              </button>
              <button
                onClick={() => mapLayers.toggleMultipleLayers(
                  mapLayers.layers.map(l => l.id), 
                  false
                )}
                className="flex-1 px-3 py-2 bg-gray-200 border border-black rounded font-sometype-mono text-xs hover:bg-gray-300"
              >
                Ocultar Todas
              </button>
            </div>

            <button
              onClick={mapLayers.resetAllLayers}
              className="w-full px-3 py-2 bg-red-100 border border-red-300 rounded font-sometype-mono text-xs hover:bg-red-200 text-red-800"
            >
              Resetar Camadas
            </button>
          </div>
        </motion.div>
      )}

      {/* AIDEV-NOTE: Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-20 ${isOpen ? 'left-[300px]' : 'left-4'} z-30 bg-[#fae523] border-2 border-black rounded-lg p-3 shadow-lg hover:bg-[#f8e71c] transition-all duration-300`}
        title="Controle de Camadas"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 16l-6-6h12l-6 6z"/>
          <path d="M12 10l-6-6h12l-6 6z"/>
          <path d="M12 22l-6-6h12l-6 6z"/>
        </svg>
      </motion.button>
    </AnimatePresence>
  );
};

export default LayerControl;
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMapLayers } from '@/hooks/useMapLayers';

// GUI-NOTE: Component for controlling map layers visibility and properties
const LayerControl = ({ isVisible = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const mapLayers = useMapLayers();

  // Debug: Check for duplicate or empty layer IDs
  const layerIds = mapLayers.layers.map(layer => layer.id);
  const uniqueIds = [...new Set(layerIds)];
  if (layerIds.length !== uniqueIds.length) {
    console.error('[LayerControl] Duplicate layer IDs detected:', layerIds);
  }
  
  const emptyIds = mapLayers.layers.filter(layer => !layer.id || layer.id === '');
  if (emptyIds.length > 0) {
    console.error('[LayerControl] Layers with empty IDs detected:', emptyIds);
  }

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-4 z-20 fundo-base border-3 border-theme p-4 min-w-[280px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="font-scratchy text-4xl text-theme">Controle de Camadas</p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-theme hover:text-theme/70 bg-white border-2 border-theme p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {/* GUI-NOTE: List all available layers */}
            {mapLayers.layers
              .filter(layer => layer.id && layer.id !== '') // Only render layers with valid IDs
              .map((layer) => (
              <motion.div
                key={layer.id}
                layout
                className="flex items-center justify-between p-3 bg-white border-2 border-theme"
              >
                <div className="flex items-center gap-3">
                  <input
                    key={`checkbox-${layer.id}`}
                    type="checkbox"
                    id={`layer-checkbox-${layer.id}`}
                    checked={layer.visible !== false}
                    onChange={() => mapLayers.toggleLayerVisibility(layer.id)}
                    className="w-4 h-4 text-[#fae523] border-2 border-theme focus:ring-[#fae523]"
                  />
                  <span className="font-sometype-mono text-sm text-theme">
                    {layer.name || layer.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 ml-2">
                  {/* GUI-NOTE: Layer reordering controls */}
                  <button
                    key={`btn-up-${layer.id}`}
                    onClick={() => mapLayers.moveLayerUp(layer.id)}
                    className="px-2 py-1 text-xs border-theme border-1 cursor-pointer hover:bg-black hover:text-white"
                    title="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    key={`btn-down-${layer.id}`}
                    onClick={() => mapLayers.moveLayerDown(layer.id)}
                    className="px-2 py-1 text-xs border-theme border-1 cursor-pointer hover:bg-black hover:text-white"
                    title="Mover para baixo"
                  >
                    ↓
                  </button>
                </div>
              </motion.div>
            ))}

            {/* GUI-NOTE: Layer management actions */}
            <div className="flex gap-2 pt-3 border-t-3 border-theme">
              <button
                onClick={() => mapLayers.toggleMultipleLayers(
                  mapLayers.layers.map(l => l.id), 
                  true
                )}
                className="flex-1 px-3 py-2 bg-black text-white border-2 border-theme font-sometype-mono text-xs hover:bg-[#f8e71c] hover:text-black cursor-pointer"
              >
                Mostrar Todas
              </button>
              <button
                onClick={() => mapLayers.toggleMultipleLayers(
                  mapLayers.layers.map(l => l.id), 
                  false
                )}
                className="cursor-pointer flex-1 px-3 py-2 bg-white border-2 border-theme font-sometype-mono text-xs hover:bg-[#f8e71c]"
              >
                Ocultar Todas
              </button>
            </div>

            <button
              onClick={mapLayers.resetAllLayers}
              className="w-full px-3 py-2 bg-black text-white hover:text-black cursor-pointer border-2 border-theme font-sometype-mono text-xs hover:bg-[#f8e71c]"
            >
              Resetar Camadas
            </button>
          </div>
        </motion.div>
      )}

      {/* GUI-NOTE: Toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`absolute top-5 ${isOpen ? 'left-[300px]' : 'left-5'} z-30 bg-[#fae523] border-3 border-theme p-3 hover:bg-[#f8e71c] transition-all duration-300`}
        title="Controle de Camadas"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path key="path-1" d="M12 16l-6-6h12l-6 6z"/>
          <path key="path-2" d="M12 10l-6-6h12l-6 6z"/>
          <path key="path-3" d="M12 22l-6-6h12l-6 6z"/>
        </svg>
      </motion.button>
    </AnimatePresence>
  );
};

export default LayerControl;
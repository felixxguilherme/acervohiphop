"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import atomMapResponse from '@/data/mapa';
import atomItemsResponse from '@/data/docItems';

const MapSearchComponent = ({ isFullscreen, onLocationFilter, onMarkerClick, selectedLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // AIDEV-NOTE: Search filtering for map locations and their associated items
  const { filteredLocations, filteredItems } = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        filteredLocations: atomMapResponse.locations,
        filteredItems: atomItemsResponse.results
      };
    }
    
    const term = searchTerm.toLowerCase();
    
    // Filter locations by name and description
    const locations = atomMapResponse.locations.filter(location => {
      return (
        location.name.toLowerCase().includes(term) ||
        location.description.toLowerCase().includes(term)
      );
    });

    // Filter items by various fields and match to locations
    const items = atomItemsResponse.results.filter(item => {
      const matchesSearch = (
        item.title.toLowerCase().includes(term) ||
        item.scopeAndContent.toLowerCase().includes(term) ||
        item.subjects.some(subject => subject.toLowerCase().includes(term)) ||
        item.creators.some(creator => creator.name.toLowerCase().includes(term))
      );

      const matchesLocation = item.places && item.places.some(place => {
        return locations.some(loc => loc.name.toLowerCase().includes(place.name.toLowerCase()));
      });

      return matchesSearch || matchesLocation;
    });

    return { filteredLocations: locations, filteredItems: items };
  }, [searchTerm]);

  // Handle search results click
  const handleResultClick = (location) => {
    onMarkerClick(location);
    setIsExpanded(false);
  };

  if (!isFullscreen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="fixed left-4 top-4 z-20 w-80 max-w-[calc(100vw-2rem)]"
    >
      <div className="bg-black/90 backdrop-blur-md border-2 border-yellow-400 rounded-lg shadow-2xl">
        {/* Search Header */}
        <div className="p-4 border-b border-white/20">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar no mapa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full px-4 py-3 bg-transparent border border-white/30 rounded text-white placeholder-white/60 text-sm font-mono focus:border-yellow-400 focus:outline-none transition-colors duration-300"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60">
              🔍
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 transition-colors flex items-center gap-1"
          >
            {isExpanded ? '▼' : '▶'} {filteredLocations.length + filteredItems.length} resultados
          </button>
        </div>

        {/* Expanded Results */}
        <AnimatePresence>
          {(isExpanded || searchTerm) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="max-h-96 overflow-y-auto">
                {/* Locations Section */}
                {filteredLocations.length > 0 && (
                  <div className="p-4 border-b border-white/10">
                    <h4 className="text-yellow-400 text-xs font-bold mb-3 uppercase tracking-wide">
                      Regiões ({filteredLocations.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredLocations.map((location) => (
                        <motion.button
                          key={location.id}
                          onClick={() => handleResultClick(location)}
                          whileHover={{ x: 4 }}
                          className={`w-full text-left p-3 rounded border transition-colors ${
                            selectedLocation?.id === location.id
                              ? 'bg-yellow-400/20 border-yellow-400 text-white'
                              : 'bg-white/5 border-white/20 hover:border-white/40 text-white/90'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-sm mb-1">{location.name}</p>
                              <p className="text-xs text-white/70 line-clamp-2">
                                {location.description}
                              </p>
                            </div>
                            <span className="bg-yellow-400/80 text-black px-2 py-1 rounded text-xs font-bold ml-2 flex-shrink-0">
                              {location.itemCount}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items Section */}
                {filteredItems.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-yellow-400 text-xs font-bold mb-3 uppercase tracking-wide">
                      Itens do Acervo ({filteredItems.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredItems.slice(0, 5).map((item) => {
                        // Find related location
                        const relatedLocation = atomMapResponse.locations.find(loc => 
                          item.places && item.places.some(place => 
                            loc.name.toLowerCase().includes(place.name.toLowerCase())
                          )
                        );

                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => relatedLocation && handleResultClick(relatedLocation)}
                            whileHover={{ x: 4 }}
                            className="w-full text-left p-3 rounded bg-white/5 border border-white/20 hover:border-white/40 transition-colors"
                            disabled={!relatedLocation}
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={item.digitalObjects?.[0]?.thumbnail || '/fundo-base-branca-1.jpg'}
                                alt={item.title}
                                className="w-12 h-12 rounded object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-white mb-1 line-clamp-1">
                                  {item.title}
                                </p>
                                <p className="text-xs text-white/70 line-clamp-2 mb-1">
                                  {item.scopeAndContent}
                                </p>
                                {relatedLocation && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-400 text-xs">📍</span>
                                    <span className="text-yellow-400 text-xs">
                                      {relatedLocation.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                      {filteredItems.length > 5 && (
                        <p className="text-white/60 text-xs text-center py-2">
                          +{filteredItems.length - 5} itens adicionais
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {searchTerm && filteredLocations.length === 0 && filteredItems.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <p className="text-white/80 text-sm font-semibold mb-1">
                      Nenhum resultado encontrado
                    </p>
                    <p className="text-white/60 text-xs">
                      Tente buscar por regiões como "Ceilândia", "Samambaia" ou termos como "hip hop", "breaking"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        {!isExpanded && !searchTerm && (
          <div className="p-4 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-yellow-400 text-lg font-bold">
                  {atomMapResponse.locations.length}
                </p>
                <p className="text-white/60 text-xs">Regiões</p>
              </div>
              <div>
                <p className="text-yellow-400 text-lg font-bold">
                  {atomMapResponse.locations.reduce((sum, loc) => sum + loc.itemCount, 0)}
                </p>
                <p className="text-white/60 text-xs">Itens</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MapSearchComponent;
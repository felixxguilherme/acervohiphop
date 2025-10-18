"use client";

import { useState, useEffect } from 'react';
import StackedPagesScroll from "@/components/ui/stack"
import { motion, AnimatePresence } from "motion/react"
import { CartoonButton } from "@/components/ui/cartoon-button";
import HeaderApp from '@/components/html/HeaderApp';

export default function Mapa() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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
        <HeaderApp title="MAPA DO HIP HOP" showTitle={true} />

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
            <div className="w-full">
              {/* Hero Section */}
              <div className="container mx-auto px-4 py-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center text-black mb-8"
                >
                  <h2 className="font-sometype-mono text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 max-w-4xl mx-auto">
                    Explore o mapa interativo da cultura Hip Hop no Distrito Federal
                  </h2>
                  <p className="font-sometype-mono text-lg text-black/80 max-w-2xl mx-auto">
                    Descubra locais históricos, eventos marcantes e a geografia do movimento Hip Hop brasiliense
                  </p>
                </motion.div>
              </div>

              {/* Container do Mapa */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative w-full"
              >
                <div className="mx-4 md:mx-8 mb-8">
                  <div 
                    ref={mapContainerRef}
                    className={`border-4 border-black rounded-lg overflow-hidden shadow-2xl bg-black/10 backdrop-blur-sm relative ${
                      isFullscreen ? 'fullscreen-map' : ''
                    }`}
                  >
                    {/* Botão de Tela Cheia */}
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 right-4 z-10 bg-[#fae523] border-2 border-black rounded-lg p-2 hover:bg-[#f8e71c] transition-colors shadow-lg"
                      title={isFullscreen ? 'Sair da tela cheia' : 'Expandir para tela cheia'}
                    >
                      {isFullscreen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                      )}
                    </button>
                    
                    <div style={{ height: isFullscreen ? '100vh' : '600px', position: 'relative' }}>
                      {/* Tour Components - only visible in fullscreen when no tour selected */}
                      {!selectedTour && (
                        <TourMenu
                          isFullscreen={isFullscreen}
                          onTourSelect={handleTourSelect}
                          selectedTour={selectedTour}
                        />
                      )}
                      
                      {/* AIDEV-NOTE: Layer control component */}
                      <LayerControl isVisible={isFullscreen && !selectedTour} />
                      
                      {/* AIDEV-NOTE: Mapbox Storytelling Overlay */}
                      <MapboxStorytellingOverlay
                        selectedTour={selectedTour}
                        onMapMove={handleMapFlyTo}
                        onChapterChange={handleChapterChange}
                        onClose={() => handleTourSelect(null)}
                        isVisible={isFullscreen && !!selectedTour}
                      />
                      
                      {/* Search Component - only visible in fullscreen when no tour selected */}
                      {!selectedTour && (
                        <MapSearchComponent
                          isFullscreen={isFullscreen}
                          onLocationFilter={handleLocationFilter}
                          onMarkerClick={handleMarkerClick}
                          selectedLocation={selectedLocation}
                        />
                      )}
                      
                      <MapRenderer
                        ref={mapRef}
                        {...viewState}
                        onLoad={(evt) => {
                          console.log('Map loaded successfully');
                        }}
                        onMove={evt => {
                          // Always update viewState but prevent user interaction during tour
                          setViewState(evt.viewState);
                        }}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          cursor: 'grab'
                        }}
                        mapStyle="https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
                        attributionControl={false}
                      >
                        {filteredLocations.map((location) => (
                          <Marker
                            key={location.id}
                            longitude={location.coordinates.lng}
                            latitude={location.coordinates.lat}
                            onClick={(e) => {
                              e.originalEvent.stopPropagation();
                              handleMarkerClick(location);
                            }}
                          >
                            <motion.div
                              whileHover={{ scale: selectedTour ? 1.1 : 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              animate={{
                                scale: (selectedTour && 
                                  checkTourLocationMatch(selectedTour.chapters[currentChapter], location)) 
                                  ? 1.3 : 1,
                                backgroundColor: (selectedTour &&
                                  checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                  ? '#f8e71c' : '#fae523'
                              }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                              className={`w-8 h-8 border-3 border-black rounded-full flex items-center justify-center shadow-lg cursor-pointer ${
                                selectedTour ? 'ring-2 ring-white/50' : ''
                              }`}
                              style={{
                                backgroundColor: (selectedTour &&
                                  checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                  ? '#f8e71c' : '#fae523'
                              }}
                            >
                              {location.isRandomPoint ? (
                                // AIDEV-NOTE: Render custom SVG icon for random points
                                (() => {
                                  const IconComponent = getIconComponent(location);
                                  return IconComponent ? (
                                    <IconComponent 
                                      size={20} 
                                      color={(selectedTour &&
                                        checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                        ? '#f8e71c' : '#fae523'} 
                                    />
                                  ) : (
                                    <motion.div
                                      animate={{
                                        scale: (selectedTour &&
                                          checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                          ? 1.2 : 1
                                      }}
                                      className="w-3 h-3 bg-black rounded-full"
                                    />
                                  );
                                })()
                              ) : (
                                // AIDEV-NOTE: Default marker for original locations
                                <motion.div
                                  animate={{
                                    scale: (selectedTour &&
                                      checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                      ? 1.2 : 1
                                  }}
                                  className="w-3 h-3 bg-black rounded-full"
                                />
                              )}
                            </motion.div>
                          </Marker>
                        ))}

                        {selectedLocation && !selectedTour && (
                          <Popup
                            longitude={selectedLocation.coordinates.lng}
                            latitude={selectedLocation.coordinates.lat}
                            anchor="bottom"
                            onClose={() => setSelectedLocation(null)}
                            closeButton={true}
                            className="custom-popup"
                          >
                            <div className="bg-white border-2 border-black rounded-lg p-4 min-w-[250px]">
                              <h3 className="font-dirty-stains text-2xl mb-2 text-black">{selectedLocation.name}</h3>
                              <p className="font-sometype-mono text-sm text-black/80 mb-3">{selectedLocation.description}</p>
                              <div className="flex items-center gap-2 mb-3">
                                <span className="bg-[#fae523] text-black px-2 py-1 rounded text-xs font-sometype-mono border border-black">
                                  {selectedLocation.itemCount} itens
                                </span>
                              </div>
                              {selectedLocation.items && selectedLocation.items.length > 0 && (
                                <div className="border-t border-black/20 pt-3">
                                  <h4 className="font-sometype-mono text-sm font-bold mb-2">Item em destaque:</h4>
                                  <div className="flex gap-3">
                                    <img 
                                      src={selectedLocation.items[0].thumbnail} 
                                      alt={selectedLocation.items[0].title}
                                      className="w-12 h-12 object-cover rounded border border-black"
                                    />
                                    <div>
                                      <p className="font-sometype-mono text-xs font-semibold text-black">{selectedLocation.items[0].title}</p>
                                      <p className="font-sometype-mono text-xs text-black/60">{selectedLocation.items[0].date}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Popup>
                        )}
                      </MapRenderer>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lista de Locais */}
              <div className="container mx-auto px-4 py-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="font-dirty-stains text-4xl text-center mb-8 text-black">REGIÕES MAPEADAS</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {atomMapResponse.locations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        onClick={() => handleMarkerClick(location)}
                        className="bg-white/90 backdrop-blur-sm border-3 border-black rounded-lg p-6 cursor-pointer shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-6 h-6 bg-[#fae523] border-2 border-black rounded-full flex items-center justify-center">
                            {location.isRandomPoint ? (
                              // AIDEV-NOTE: Show custom icon for random points in location list
                              (() => {
                                const IconComponent = getIconComponent(location);
                                return IconComponent ? (
                                  <IconComponent size={16} color="#000" />
                                ) : (
                                  <div className="w-2 h-2 bg-black rounded-full"></div>
                                );
                              })()
                            ) : (
                              <div className="w-2 h-2 bg-black rounded-full"></div>
                            )}
                          </div>
                          <h4 className="font-dirty-stains text-2xl text-black">{location.name}</h4>
                        </div>
                        
                        <p className="font-sometype-mono text-sm text-black/80 mb-4">{location.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="bg-[#fae523] text-black px-3 py-1 rounded-full text-sm font-sometype-mono border border-black">
                            {location.itemCount} itens
                          </span>
                          <button className="font-sometype-mono text-sm text-black hover:text-black/70 underline">
                            Ver no mapa →
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}
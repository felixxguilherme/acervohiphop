"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedButton from '@/components/AnimatedButton';
import Map, { Marker, Popup } from 'react-map-gl/maplibre';
import atomMapResponse from '@/data/mapa';

const Mapa = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: atomMapResponse.center.lng,
    latitude: atomMapResponse.center.lat,
    zoom: 10
  });

  useEffect(() => {
    // Estratégia de carregamento otimizado
    if (typeof window !== 'undefined') {
      // Simular carregamento rápido
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setViewState({
      ...viewState,
      longitude: location.coordinates.lng,
      latitude: location.coordinates.lat,
      zoom: 12
    });
  };

  const toggleFullscreen = async () => {
    if (!mapContainerRef.current) return;

    if (!isFullscreen) {
      // Entrar em tela cheia
      try {
        if (mapContainerRef.current.requestFullscreen) {
          await mapContainerRef.current.requestFullscreen();
        } else if (mapContainerRef.current.mozRequestFullScreen) {
          await mapContainerRef.current.mozRequestFullScreen();
        } else if (mapContainerRef.current.webkitRequestFullscreen) {
          await mapContainerRef.current.webkitRequestFullscreen();
        } else if (mapContainerRef.current.msRequestFullscreen) {
          await mapContainerRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error('Erro ao entrar em tela cheia:', error);
      }
    } else {
      // Sair da tela cheia
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      } catch (error) {
        console.error('Erro ao sair da tela cheia:', error);
      }
    }
  };

  // Listener para mudanças no estado de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
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
            MAPA DO HIP HOP
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
                      <Map
                        {...viewState}
                        onMove={evt => setViewState(evt.viewState)}
                        style={{ width: '100%', height: '100%' }}
                        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                        attributionControl={false}
                      >
                        {atomMapResponse.locations.map((location) => (
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
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 bg-[#fae523] border-3 border-black rounded-full cursor-pointer flex items-center justify-center shadow-lg"
                            >
                              <div className="w-3 h-3 bg-black rounded-full"></div>
                            </motion.div>
                          </Marker>
                        ))}

                        {selectedLocation && (
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
                      </Map>
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
                            <div className="w-2 h-2 bg-black rounded-full"></div>
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
    </>
  );
};

export default Mapa;
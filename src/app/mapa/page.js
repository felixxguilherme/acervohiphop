"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedButton from '@/components/AnimatedButton';
import HeaderApp from '@/components/html/HeaderApp';
import { Marker, Popup } from 'react-map-gl/maplibre';
import { MapProvider } from '@/contexts/MapContext';
import MapRenderer from '@/components/mapa/MapRenderer';
import { useMapLayers } from '@/hooks/useMapLayers';
import MapSearchComponent from '@/components/mapa/MapSearchComponent';
import TourMenu from '@/components/mapa/TourMenu';
import MapboxStorytellingOverlay from '@/components/mapa/MapboxStorytellingOverlay';
import LayerControl from '@/components/mapa/LayerControl';

import storiesMapboxFormat from '@/data/storiesMapboxFormat';
import { iconTypes } from '@/components/mapa/MapIcons';
import { useAcervo } from '@/contexts/AcervoContext';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

// AIDEV-NOTE: Internal component that uses map context
const MapaContent = () => {
  // Context hook for real data from development branch
  const { 
    mapData, 
    geoJson, 
    mapStatistics, 
    loadMapData, 
    isLoading, 
    getError 
  } = useAcervo();

  const mapLayers = useMapLayers();

  // AIDEV-NOTE: Initialize map layers when component mounts
  useEffect(() => {
    mapLayers.initializeDefaultLayers();
  }, []);

  // AIDEV-NOTE: Helper function to get icon component for random points
  const getIconComponent = (location) => {
    if (!location.isRandomPoint || !location.iconType) return null;
    const iconType = iconTypes.find(icon => icon.name === location.iconType);
    return iconType ? iconType.component : null;
  };

  // AIDEV-NOTE: Helper function to check if tour chapter matches location
  const checkTourLocationMatch = (chapter, location) => {
    if (!chapter || !chapter.location || !location) return false;
    
    // Check if coordinates are close enough (within ~100m)
    const chapterLng = chapter.location.center[0];
    const chapterLat = chapter.location.center[1];
    const locationLng = location.coordinates.lng;
    const locationLat = location.coordinates.lat;
    
    const distance = Math.sqrt(
      Math.pow(chapterLng - locationLng, 2) + Math.pow(chapterLat - locationLat, 2)
    );
    
    return distance < 0.001; // Approximately 100m
  };

  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const flyToTimeoutRef = useRef(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 regiões por página
  
  // Estado local para controlar carregamento das regiões separadamente
  const [regionsLoading, setRegionsLoading] = useState(false);

  // Load map data de forma assíncrona (não bloqueia a página) - COM CACHE
  useEffect(() => {
    // Verificar se já temos dados carregados
    if (geoJson?.features?.length > 0) {
      console.info('[Mapa] 🎯 Dados do mapa já carregados, pulando requisição');
      return;
    }

    const loadMapDataAsync = async () => {
      setRegionsLoading(true);
      try {
        console.info('[Mapa] 🗺️ Iniciando carregamento dos dados do mapa');
        await loadMapData('8337', false, true); // Modo rápido por padrão
      } catch (error) {
        console.error('[Mapa] ❌ Erro ao carregar dados do mapa:', error);
      } finally {
        setRegionsLoading(false);
      }
    };

    // Delay para permitir que a página renderize primeiro
    const timeoutId = setTimeout(loadMapDataAsync, 100);
    
    // Cleanup do timeout se o componente for desmontado
    return () => clearTimeout(timeoutId);
  }, []); // Dependências vazias para executar apenas uma vez

  // Convert GeoJSON features to locations format for the map (memoized)
  const locations = useMemo(() => {
    if (!geoJson?.features) return [];
    
    return geoJson.features.map(feature => ({
      id: feature.properties.id,
      name: feature.properties.title,
      description: feature.properties.archival_history || 'Sem descrição disponível',
      coordinates: {
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1]
      },
      itemCount: 1,
      items: [{
        thumbnail: feature.properties.thumbnail_url,
        title: feature.properties.title,
        date: feature.properties.creation_dates?.[0] || 'Data não informada'
      }],
      slug: feature.properties.id,
      reference_code: feature.properties.reference_code,
      place_access_points: feature.properties.place_access_points,
      has_real_coordinates: feature.properties.has_real_coordinates,
      isRandomPoint: !feature.properties.has_real_coordinates
    }));
  }, [geoJson]);

  // Set filtered locations state for search functionality
  const [filteredLocations, setFilteredLocations] = useState([]);
  
  // Update filtered locations when locations change
  useEffect(() => {
    setFilteredLocations(locations);
  }, [locations]);

  // Set viewState for map with default center
  const [viewState, setViewState] = useState({
    longitude: -47.9292, // Brasília center
    latitude: -15.7801,
    zoom: 10,
    bearing: 0,
    pitch: 0
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => setIsMapLoading(false), 800);
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

  // AIDEV-NOTE: Handler for search component to filter map locations
  const handleLocationFilter = (locations) => {
    setFilteredLocations(locations);
  };

  // AIDEV-NOTE: Handler for tour selection and management
  const handleTourSelect = (tour) => {
    setSelectedTour(tour);
    setCurrentChapter(0);
    
    if (tour) {
      // Move to first chapter location with flyTo
      const firstChapter = tour.chapters[0];
      handleMapFlyTo({
        longitude: firstChapter.location.center[0],
        latitude: firstChapter.location.center[1],
        zoom: firstChapter.location.zoom || 13,
        bearing: firstChapter.location.bearing || 0,
        pitch: firstChapter.location.pitch || 0,
        speed: firstChapter.location.speed || 2
      });
    }
  };

  // AIDEV-NOTE: Handler for map movement with smooth transitions
  const handleMapMove = (newViewState) => {
    setIsAnimating(true);
    setViewState({
      ...viewState,
      ...newViewState
    });
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  // AIDEV-NOTE: Handler for flyTo using MapLibre GL JS native method
  const handleMapFlyTo = (flyToOptions) => {
    if (!mapRef.current) return;
    
    setIsAnimating(true);
    
    const map = mapRef.current.getMap();
    const speed = flyToOptions.speed || 2;
    const duration = Math.max(1000, Math.min(4000, 2000 / speed));
    
    // Use MapLibre's native flyTo method
    map.flyTo({
      center: [flyToOptions.longitude, flyToOptions.latitude],
      zoom: flyToOptions.zoom || map.getZoom(),
      bearing: flyToOptions.bearing !== undefined ? flyToOptions.bearing : map.getBearing(),
      pitch: flyToOptions.pitch !== undefined ? flyToOptions.pitch : map.getPitch(),
      duration: duration,
      essential: true
    });
    
    // Reset animation flag after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, duration + 200);
  };

  // AIDEV-NOTE: Handler for chapter changes during tour
  const handleChapterChange = (chapterIndex) => {
    setCurrentChapter(chapterIndex);
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

  // Separar loading da página geral do loading das regiões
  const isPageLoading = isMapLoading; // Apenas loading inicial da página
  const isRegionsLoading = regionsLoading || isLoading('map');
  const mapError = getError('map');

  // Cálculos de paginação
  const totalPages = Math.ceil(locations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLocations = locations.slice(startIndex, endIndex);

  // Função para navegar entre páginas
  const goToPage = (page) => {
    setCurrentPage(page);
    
    // Scroll para a seção de regiões
    const regionsSection = document.getElementById('regions-section');
    if (regionsSection) {
      const sectionTop = regionsSection.offsetTop;
      const offset = 100;
      const targetPosition = Math.max(0, sectionTop - offset);
      
      window.scrollTo({ 
        top: targetPosition, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <>
      {/* Tela de carregamento apenas para página inicial */}
      {isPageLoading && (
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
      <div className={`${isPageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <HeaderApp title="MAPA DO HIP HOP" showTitle={true} />
        
        <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen border-black border-l-3 border-r-3 border-b-3">

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
              {/* Hero Section */}
              <motion.section 
                className="mb-12 px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-theme-background pt-6">
                  <h2 className="text-4xl font-dirty-stains text-theme-primary mb-4 text-left">
                    MAPA INTERATIVO
                  </h2>
                  <p className="font-sometype-mono text-lg text-gray-600 text-left mb-4">
                    Explore locais históricos, eventos marcantes e a geografia do movimento Hip Hop brasiliense
                  </p>
                  {mapStatistics && (
                    <div className="flex flex-wrap gap-4 text-sm font-sometype-mono">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-300">
                        {mapStatistics.totalItems} locais mapeados
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 border border-green-300">
                        {mapStatistics.extractionSuccessRate} precisão
                      </span>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Container do Mapa */}
              <motion.section
                className="mb-12 px-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="bg-theme-background">
                  <div 
                    ref={mapContainerRef}
                    className={`border-2 border-black overflow-hidden bg-gray-200 relative ${
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
                    
                    <div style={{ height: isFullscreen ? '100vh' : '600px', position: isFullscreen ? 'fixed' : 'relative', top: isFullscreen ? 0 : 'auto', left: isFullscreen ? 0 : 'auto', width: isFullscreen ? '100vw' : '100%', zIndex: isFullscreen ? 9999 : 'auto' }}>
                      {isFullscreen ? (
                        /* Layout fullscreen - mapa tela inteira com menus flutuantes */
                        <div className="h-full relative">
                          {/* Mapa ocupando toda a tela */}
                          <MapRenderer
                            ref={mapRef}
                            {...viewState}
                            onLoad={(evt) => {
                              console.log('Map loaded successfully');
                            }}
                            onMove={evt => {
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
                          </MapRenderer>
                          
                          {/* Menus flutuantes preservados */}
                          <TourMenu
                            isFullscreen={isFullscreen}
                            onTourSelect={handleTourSelect}
                            selectedTour={selectedTour}
                          />
                          
                          <LayerControl isVisible={isFullscreen && !selectedTour} />
                          
                          <MapboxStorytellingOverlay
                            selectedTour={selectedTour}
                            onMapMove={handleMapFlyTo}
                            onChapterChange={handleChapterChange}
                            isVisible={isFullscreen && !!selectedTour}
                          />
                          
                          {!selectedTour && (
                            <MapSearchComponent
                              isFullscreen={isFullscreen}
                              onLocationFilter={handleLocationFilter}
                              onMarkerClick={handleMarkerClick}
                              selectedLocation={selectedLocation}
                            />
                          )}
                        </div>
                      ) : (
                        /* Layout normal */
                        <>
                          {/* Tour Components - only visible in fullscreen */}
                          <TourMenu
                            isFullscreen={isFullscreen}
                            onTourSelect={handleTourSelect}
                            selectedTour={selectedTour}
                          />
                          
                          {/* AIDEV-NOTE: Layer control component */}
                          <LayerControl isVisible={isFullscreen && !selectedTour} />
                          
                          {/* AIDEV-NOTE: Mapbox Storytelling Overlay */}
                          <MapboxStorytellingOverlay
                            selectedTour={selectedTour}
                            onMapMove={handleMapFlyTo}
                            onChapterChange={handleChapterChange}
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
                                <div className="bg-white border-2 border-black p-4 min-w-[250px]">
                                  <h3 className="font-dirty-stains text-2xl mb-2 text-black">{selectedLocation.name}</h3>
                                  <p className="font-sometype-mono text-sm text-black/80 mb-3">{selectedLocation.description}</p>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-300 text-xs font-sometype-mono">
                                      {selectedLocation.itemCount} itens
                                    </span>
                                    {selectedLocation.has_real_coordinates && (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 border border-green-300 text-xs font-sometype-mono">
                                        GPS
                                      </span>
                                    )}
                                  </div>
                                  {selectedLocation.items && selectedLocation.items.length > 0 && (
                                    <div className="border-t border-black/20 pt-3">
                                      <h4 className="font-sometype-mono text-sm font-bold mb-2">Item em destaque:</h4>
                                      <div className="flex gap-3">
                                        {selectedLocation.items[0].thumbnail && (
                                          <img 
                                            src={selectedLocation.items[0].thumbnail} 
                                            alt={selectedLocation.items[0].title}
                                            className="w-12 h-12 object-cover border border-black"
                                          />
                                        )}
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Lista de Locais */}
              <motion.section
                className="mb-12 px-6"
                id="regions-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-theme-background">
                  <div className="mb-8">
                    <h3 className="text-4xl font-dirty-stains text-theme-primary mb-4 text-left">REGIÕES MAPEADAS</h3>
                    <p className="font-sometype-mono text-lg text-gray-600 text-left">
                      {locations.length} {locations.length === 1 ? 'região mapeada' : 'regiões mapeadas'}
                      {totalPages > 1 && ` - Página ${currentPage} de ${totalPages}`}
                    </p>
                  </div>
                  
                  {mapError && (
                    <div className="text-center py-8 mb-8">
                      <div className="bg-theme-background border-2 border-black p-6">
                        <p className="font-dirty-stains text-xl mb-2">Erro ao carregar mapa</p>
                        <p className="font-sometype-mono">{mapError}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Loading específico para regiões */}
                  {isRegionsLoading ? (
                    <div className="text-center py-12">
                      <div className="bg-white border-2 border-black p-8">
                        <div className="flex justify-center mb-4 h-8">
                          <div className="flex gap-1 items-end">
                            {[0, 1, 2].map((index) => (
                              <motion.div
                                key={index}
                                className="w-3 bg-theme-primary border border-black"
                                style={{ height: '8px' }}
                                animate={{ 
                                  scaleY: [1, 3, 1],
                                  transformOrigin: 'bottom'
                                }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Infinity,
                                  delay: index * 0.2,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="font-dirty-stains text-xl mb-2">Carregando regiões mapeadas...</p>
                        <p className="font-sometype-mono text-sm text-gray-600">
                          🗺️ Processando dados do acervo para gerar coordenadas geográficas automaticamente
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentLocations.map((location, index) => (
                      <motion.div
                        key={location.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        onClick={() => handleMarkerClick(location)}
                        className="bg-white border-2 border-black p-6 cursor-pointer hover:bg-zinc-100 transition-all duration-300"
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
                          <div className="flex gap-2">
                            <span className="bg-[#fae523] text-black px-3 py-1 rounded-full text-sm font-sometype-mono border border-black">
                              {location.itemCount} item
                            </span>
                            {location.has_real_coordinates && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sometype-mono border border-green-300">
                                GPS
                              </span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleMarkerClick(location)}
                            className="font-sometype-mono text-sm text-black hover:text-black/70 underline"
                          >
                            Ver no mapa →
                          </button>
                        </div>
                        
                        {/* Coordenadas para debug */}
                        <div className="mt-3 pt-3 border-t border-black/20">
                          <p className="text-xs font-sometype-mono text-gray-500">
                            📍 {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                          </p>
                          {location.reference_code && (
                            <p className="text-xs font-sometype-mono text-gray-500">
                              🏷️ {location.reference_code}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    </div>
                  )}
                  
                  {locations.length === 0 && !mapError && !isRegionsLoading && (
                    <div className="text-center py-12">
                      <div className="bg-white/90 border-2 border-black rounded-lg p-6 max-w-md mx-auto">
                        <p className="font-dirty-stains text-xl mb-2">Nenhuma região encontrada</p>
                        <p className="font-sometype-mono text-sm">Não foram encontrados dados de localização no acervo</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Paginação - só mostra se não está carregando */}
                  {totalPages > 1 && !isRegionsLoading && (
                    <motion.div 
                      className="flex justify-center mt-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => currentPage > 1 && goToPage(currentPage - 1)}
                              className={`cursor-pointer border-2 border-black ${
                                currentPage === 1 
                                  ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                                  : 'hover:bg-gray-100 transition-colors'
                              }`}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => goToPage(page)}
                                isActive={page === currentPage}
                                className={`cursor-pointer border-2 border-black font-dirty-stains ${
                                  page === currentPage
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-white hover:bg-gray-100 transition-colors'
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                              className={`cursor-pointer border-2 border-black ${
                                currentPage === totalPages 
                                  ? 'opacity-50 cursor-not-allowed pointer-events-none' 
                                  : 'hover:bg-gray-100 transition-colors'
                              }`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </motion.div>
                  )}
                </div>
              </motion.section>

              <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden border-r-3 border-l-3 border-t-3 border-b-3 border-black p-8">
              
              
                      {/* Decorative elements */}
                      <div className="absolute inset-0 z-10 pointer-events-none decorative-elements">
              
                        {/* Spray effects */}
                        <div
                          className="absolute -bottom-10 left-15 w-64 h-64 bg-contain bg-no-repeat"
                          style={{
                            backgroundImage: "url('/cursor02.png')"
                          }}
                        />
              
                        <div
                          className="absolute top-0 -right-15 w-32 h-32 bg-contain bg-no-repeat"
                          style={{
                            backgroundImage: "url('/spray_preto-1.png')"
                          }}
                        />
              
                        <div
                          className="absolute top-5 left-16 w-28 h-28 bg-contain bg-no-repeat rotate-45"
                          style={{
                            backgroundImage: "url('/spray_preto-2.png')"
                          }}
                        />
                      </div>
              
                      {/* Main content */}
                      <div className="relative z-20 text-center max-w-6xl mx-auto px-6">
                        {/* Subtitle */}
                        <motion.p
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="mt-15 text-2xl md:text-2xl font-sometype-mono text-theme-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
                        >
                          Este é o Mapa das Batalhas: uma ferramenta da nossa plataforma interativa que conecta as Batalhas de MC´s do DF, mostrando de forma dinâmica e precisa onde e quando a cultura urbana se manifestou e continua a pulsar.

Neste mapa, geolocalizações e arquivos se unem para criar um panorama da resistência cultural do DF, mapeando encontros, datas e trajetórias que desenham o território Hip Hop. Nosso mapa permite navegar por essa geografia em tempo real, onde a memória se move e se transforma em dados dinâmicos. A cada clique, você mergulha na história do Hip Hop DF.
Veja o Distrito Federal além dos setores e monumentos. Aqui, traçamos pontos que conectam a força de uma cultura que nasceu à margem. E com isso, fazemos do território um palco, onde cada batalha é parte dessa construção. Ao acessar, surpreenda-se com a potência desta cidade, agora também construída por você. 
                        </motion.p>
                      </div>
                    </section>

              {/* Modal de detalhes do local */}
              {/* {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                  onClick={() => setSelectedLocation(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white border-4 border-black rounded-lg p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-dirty-stains text-2xl text-black">{selectedLocation.name}</h3>
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className="text-black hover:text-gray-600 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                    
                    <p className="font-sometype-mono text-sm text-black/80 mb-4">{selectedLocation.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <span className="bg-[#fae523] text-black px-2 py-1 rounded text-xs font-sometype-mono border border-black">
                          {selectedLocation.itemCount} item
                        </span>
                        {selectedLocation.has_real_coordinates && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-sometype-mono border border-green-300">
                            GPS
                          </span>
                        )}
                      </div>
                      
                      <div className="text-xs font-sometype-mono text-gray-600">
                        <p>📍 {selectedLocation.coordinates.lat.toFixed(6)}, {selectedLocation.coordinates.lng.toFixed(6)}</p>
                        {selectedLocation.reference_code && (
                          <p>🏷️ {selectedLocation.reference_code}</p>
                        )}
                        {selectedLocation.place_access_points && selectedLocation.place_access_points.length > 0 && (
                          <p>📍 {selectedLocation.place_access_points.join(', ')}</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedLocation.items && selectedLocation.items.length > 0 && (
                      <div className="border-t border-black/20 pt-4">
                        <h4 className="font-sometype-mono text-sm font-bold mb-2">Item em destaque:</h4>
                        <div className="flex gap-3">
                          {selectedLocation.items[0].thumbnail && (
                            <img 
                              src={selectedLocation.items[0].thumbnail} 
                              alt={selectedLocation.items[0].title}
                              className="w-16 h-16 object-cover rounded border border-black"
                            />
                          )}
                          <div>
                            <p className="font-sometype-mono text-sm font-semibold text-black">{selectedLocation.items[0].title}</p>
                            <p className="font-sometype-mono text-xs text-black/60">{selectedLocation.items[0].date}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )} */}
          </motion.div>
        </AnimatePresence>
        </div>
      </div>
    </>
  );
};

// AIDEV-NOTE: Main component wrapped with MapProvider
const Mapa = () => {
  return (
    <MapProvider>
      <MapaContent />
    </MapProvider>
  );
};

export default Mapa;
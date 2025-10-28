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

  const [currentTheme, setCurrentTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    
    // Delay para evitar conflitos com animações da página
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);

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

  // Estado para controlar hover nos markers
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [showHoverPopup, setShowHoverPopup] = useState(false);

  // Estado para controlar interatividade do mapa com Ctrl
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isMapInteractive, setIsMapInteractive] = useState(false);

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
      isRandomPoint: !feature.properties.has_real_coordinates,
      coordinateType: feature.properties.coordinate_source
    }));
  }, [geoJson]);

  // Set filtered locations state for search functionality
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced search function that searches across multiple fields
  const performSearch = (term, locationsData) => {
    if (!term || term.trim() === '') {
      return locationsData;
    }
    
    const searchLower = term.toLowerCase().trim();
    
    return locationsData.filter(location => {
      // Search in name
      if (location.name && location.name.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in description
      if (location.description && location.description.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in place_access_points (array of access points)
      if (location.place_access_points && Array.isArray(location.place_access_points)) {
        const accessPointsMatch = location.place_access_points.some(point => 
          point && point.toLowerCase().includes(searchLower)
        );
        if (accessPointsMatch) return true;
      }
      
      // Search in reference_code
      if (location.reference_code && location.reference_code.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in items titles (if items exist)
      if (location.items && Array.isArray(location.items)) {
        const itemsMatch = location.items.some(item => 
          item.title && item.title.toLowerCase().includes(searchLower)
        );
        if (itemsMatch) return true;
      }
      
      return false;
    });
  };

  // Function to get search match details for a location
  const getSearchMatches = (location, term) => {
    if (!term || term.trim() === '') return [];
    
    const searchLower = term.toLowerCase().trim();
    const matches = [];
    
    // Check name
    if (location.name && location.name.toLowerCase().includes(searchLower)) {
      matches.push('Nome');
    }
    
    // Check description
    if (location.description && location.description.toLowerCase().includes(searchLower)) {
      matches.push('Descrição');
    }
    
    // Check place_access_points
    if (location.place_access_points && Array.isArray(location.place_access_points)) {
      const accessPointsMatch = location.place_access_points.some(point => 
        point && point.toLowerCase().includes(searchLower)
      );
      if (accessPointsMatch) matches.push('Pontos de Acesso');
    }
    
    // Check reference_code
    if (location.reference_code && location.reference_code.toLowerCase().includes(searchLower)) {
      matches.push('Código de Referência');
    }
    
    // Check items titles
    if (location.items && Array.isArray(location.items)) {
      const itemsMatch = location.items.some(item => 
        item.title && item.title.toLowerCase().includes(searchLower)
      );
      if (itemsMatch) matches.push('Itens');
    }
    
    return matches;
  };

  // Update filtered locations when locations or search term change
  useEffect(() => {
    const filtered = performSearch(searchTerm, locations);
    setFilteredLocations(filtered);
  }, [locations, searchTerm]);

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
    
    // Scroll para o mapa suavemente
    const mapSection = document.querySelector('[ref="mapContainerRef"]') || mapContainerRef.current;
    if (mapSection) {
      const sectionTop = mapSection.offsetTop;
      const offset = 100; // Offset para header
      const targetPosition = Math.max(0, sectionTop - offset);
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
    
    // Enquadrar o mapa na região selecionada
    setViewState({
      ...viewState,
      longitude: location.coordinates.lng,
      latitude: location.coordinates.lat,
      zoom: 14 // Zoom mais próximo para melhor enquadramento
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

  // Listener para tecla Ctrl - controla interatividade do mapa
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && !isCtrlPressed) {
        setIsCtrlPressed(true);
        setIsMapInteractive(true);
      }
    };

    const handleKeyUp = (event) => {
      if (!event.ctrlKey && isCtrlPressed) {
        setIsCtrlPressed(false);
        setIsMapInteractive(false);
      }
    };

    // Listener para quando a janela perde o foco (garante que Ctrl seja "solto")
    const handleWindowBlur = () => {
      setIsCtrlPressed(false);
      setIsMapInteractive(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isCtrlPressed]);

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

        <div className="relative max-w-7xl mx-auto min-h-screen border-theme border-l-3 border-r-3 border-b-3">

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
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >

                <div
                  className={`${currentTheme === 'light' ? 'bg-hip-amarelo-escuro' : 'bg-hip-amarelo-claro'} text-left border-theme w-full pb-10 pt-10 px-6`}
                >
                  <h2 className="text-black font-sometype-mono text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl pl-6 mb-6 text-bold">
                    MAPA INTERATIVO
                  </h2>
                  <p className="border-black border-b-3 pb-2 ml-6 text-xl md:text-2xl font-sometype-mono text-black max-w-4xl leading-relaxed">
                    Explore locais históricos, eventos marcantes e a geografia do movimento Hip Hop brasiliense
                  </p>

                </div>

                <div className="">
                  <div
                    ref={mapContainerRef}
                    className={`border-2 border-theme overflow-hidden bg-gray-200 relative ${isFullscreen ? 'fullscreen-map' : ''
                      }`}
                  >
                    {/* Botão de Tela Cheia */}
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 right-4 z-10 bg-[#fae523] border-2 border-theme rounded-lg p-2 hover:bg-[#f8e71c] transition-colors shadow-lg"
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

                    {/* Indicador de Ctrl - apenas no modo normal (não fullscreen) */}
                    {!isFullscreen && !isCtrlPressed && (
                      <div className="border border-3 border-black bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 px-4 py-3 font-sometype-mono text-sm">
                        <div className="flex items-center gap-2 bg-white text-white p-2">                          
                          <span className="">Pressione <kbd className="border border-black px-2 py-1 text-xs">Ctrl</kbd> para navegar.</span>
                        </div>
                      </div>
                    )}

                    <div style={{ height: isFullscreen ? '100vh' : '600px', position: isFullscreen ? 'fixed' : 'relative', top: isFullscreen ? 0 : 'auto', left: isFullscreen ? 0 : 'auto', width: isFullscreen ? '100vw' : '100%', zIndex: isFullscreen ? 9999 : 'auto' }}>
                      {isFullscreen ? (
                        /* Layout fullscreen - grid com sidebar esquerda + mapa */
                        <div className="h-full flex">
                          {/* Sidebar esquerda */}
                          <div className="w-80 fundo-base border-r-2 border-black flex flex-col overflow-hidden">
                            
                            {/* Header da Sidebar */}
                            <div className="bg-hip-amarelo-escuro border-b-2 border-black p-4">
                              <h2 className="font-dirty-stains text-2xl text-black">EXPLORAR MAPA</h2>
                            </div>

                            {/* Busca e Filtros - quando não há tour ativo */}
                            {!selectedTour && (
                              <div className="flex-1 overflow-y-auto p-4">
                                {/* Seção de Busca */}
                                <div className="mb-6">
                                  <h3 className="font-sometype-mono text-lg font-bold text-black mb-3 border-b border-black pb-1">
                                    BUSCAR LOCAIS
                                  </h3>
                                  <div className="space-y-3">
                                    <div className="relative">
                                      <input
                                        type="text"
                                        placeholder="Buscar em locais, descrições, pontos de acesso..."
                                        className="w-full p-3 pr-10 border-2 border-black font-sometype-mono text-sm"
                                        value={searchTerm}
                                        onChange={(e) => {
                                          setSearchTerm(e.target.value);
                                        }}
                                      />
                                      {searchTerm && (
                                        <button
                                          onClick={() => setSearchTerm('')}
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-600 p-1"
                                          title="Limpar busca"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <p className="text-xs font-sometype-mono text-black/70">
                                        {filteredLocations.length} de {locations.length} locais
                                      </p>
                                      {searchTerm && (
                                        <p className="text-xs font-sometype-mono text-blue-600">
                                          Buscando: "{searchTerm}"
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Lista de Locais */}
                                <div className="mb-6">
                                  <h3 className="font-sometype-mono text-lg font-bold text-black mb-3 border-b border-black pb-1">
                                    LOCAIS ENCONTRADOS
                                  </h3>
                                  <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {filteredLocations.slice(0, 10).map((location) => {
                                      const searchMatches = getSearchMatches(location, searchTerm);
                                      return (
                                        <div
                                          key={location.id}
                                          onClick={() => handleMarkerClick(location)}
                                          className="border border-black p-3 cursor-pointer hover:bg-hip-amarelo-claro transition-colors"
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-dirty-stains text-sm text-black font-bold">
                                              {location.name}
                                            </h4>
                                            <div className="flex gap-1">
                                              {location.coordinateType === 'extracted_from_notes' && (
                                                <span className="bg-green-500 text-white px-1 py-0.5 text-xs font-sometype-mono">GPS</span>
                                              )}
                                              {location.coordinateType === 'estimated_from_places' && (
                                                <span className="bg-blue-500 text-white px-1 py-0.5 text-xs font-sometype-mono">EST</span>
                                              )}
                                              {location.coordinateType === 'default_brasilia' && (
                                                <span className="bg-gray-500 text-white px-1 py-0.5 text-xs font-sometype-mono">DEF</span>
                                              )}
                                            </div>
                                          </div>
                                          
                                          {/* Show search matches */}
                                          {searchTerm && searchMatches.length > 0 && (
                                            <div className="mb-2">
                                              <div className="flex flex-wrap gap-1">
                                                {searchMatches.map((match, index) => (
                                                  <span 
                                                    key={index}
                                                    className="bg-yellow-200 text-black px-1 py-0.5 text-xs font-sometype-mono border border-yellow-400"
                                                  >
                                                    ✓ {match}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          
                                          <p className="font-sometype-mono text-xs text-black/70 line-clamp-2">
                                            {location.description}
                                          </p>
                                          
                                          {/* Show place access points if matched */}
                                          {searchTerm && location.place_access_points && Array.isArray(location.place_access_points) && 
                                           location.place_access_points.some(point => point && point.toLowerCase().includes(searchTerm.toLowerCase())) && (
                                            <div className="mt-1">
                                              <p className="font-sometype-mono text-xs text-blue-600">
                                                <strong>Pontos de acesso:</strong> {location.place_access_points.filter(point => 
                                                  point && point.toLowerCase().includes(searchTerm.toLowerCase())
                                                ).join(', ')}
                                              </p>
                                            </div>
                                          )}
                                          
                                          <div className="mt-2 flex justify-between items-center">
                                            <span className="font-sometype-mono text-xs text-black/50">
                                              {location.itemCount} item(s)
                                            </span>
                                            <button className="font-sometype-mono text-xs text-black underline hover:no-underline">
                                              Ver no mapa →
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    {filteredLocations.length > 10 && (
                                      <p className="text-center font-sometype-mono text-xs text-black/70 py-2">
                                        Mostrando 10 de {filteredLocations.length} resultados
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Estatísticas */}
                                <div className="border-t border-black pt-4">
                                  <h3 className="font-sometype-mono text-lg font-bold text-black mb-3">
                                    ESTATÍSTICAS
                                  </h3>
                                  <div className="space-y-1 text-xs font-sometype-mono text-black">
                                    <div className="flex justify-between">
                                      <span>Total de locais:</span>
                                      <span className="font-bold">{locations.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Com GPS:</span>
                                      <span className="font-bold text-green-600">
                                        {locations.filter(l => l.coordinateType === 'extracted_from_notes').length}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Estimados:</span>
                                      <span className="font-bold text-blue-600">
                                        {locations.filter(l => l.coordinateType === 'estimated_from_places').length}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Tour Ativo - quando há tour selecionado */}
                            {selectedTour && (
                              <div className="flex-1 overflow-y-auto p-4">
                                <div className="mb-4">
                                  <h3 className="font-sometype-mono text-lg font-bold text-black mb-2 border-b border-black pb-1">
                                    TOUR: {selectedTour.title}
                                  </h3>
                                  <p className="font-sometype-mono text-sm text-black/70 mb-4">
                                    {selectedTour.description}
                                  </p>
                                  <button
                                    onClick={() => handleTourSelect(null)}
                                    className="w-full p-2 border border-black bg-white hover:bg-red-100 font-sometype-mono text-sm transition-colors"
                                  >
                                    ✕ Sair do Tour
                                  </button>
                                </div>

                                {/* Capítulos do Tour */}
                                <div>
                                  <h4 className="font-sometype-mono text-md font-bold text-black mb-3">
                                    CAPÍTULOS ({selectedTour.chapters?.length || 0})
                                  </h4>
                                  <div className="space-y-2">
                                    {selectedTour.chapters?.map((chapter, index) => (
                                      <div
                                        key={index}
                                        onClick={() => {
                                          setCurrentChapter(index);
                                          handleMapFlyTo({
                                            longitude: chapter.location.center[0],
                                            latitude: chapter.location.center[1],
                                            zoom: chapter.location.zoom || 13,
                                            bearing: chapter.location.bearing || 0,
                                            pitch: chapter.location.pitch || 0,
                                            speed: chapter.location.speed || 2
                                          });
                                        }}
                                        className={`border border-black p-3 cursor-pointer transition-colors ${
                                          currentChapter === index 
                                            ? 'bg-hip-amarelo-escuro' 
                                            : 'bg-white hover:bg-hip-amarelo-claro'
                                        }`}
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <h5 className="font-dirty-stains text-sm text-black font-bold">
                                            {index + 1}. {chapter.title}
                                          </h5>
                                          {currentChapter === index && (
                                            <span className="bg-black text-white px-2 py-1 text-xs font-sometype-mono">
                                              ATUAL
                                            </span>
                                          )}
                                        </div>
                                        <p className="font-sometype-mono text-xs text-black/70 line-clamp-3">
                                          {chapter.description}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Menu de Tours - sempre visível na parte inferior */}
                            <div className="border-t-2 border-black bg-hip-amarelo-claro p-4">
                              <h3 className="font-sometype-mono text-md font-bold text-black mb-3">
                                TOURS DISPONÍVEIS
                              </h3>
                              <div className="space-y-2">
                                {(storiesMapboxFormat || []).slice(0, 3).map((story, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleTourSelect(story)}
                                    className={`w-full p-2 border border-black text-left font-sometype-mono text-sm transition-colors ${
                                      selectedTour?.title === story.title
                                        ? 'bg-black text-white'
                                        : 'bg-white hover:bg-gray-100'
                                    }`}
                                  >
                                    🎯 {story.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Mapa ocupando o restante da tela */}
                          <div className="flex-1 relative">
                          <MapRenderer
                            ref={mapRef}
                            {...viewState}
                            onLoad={(evt) => {
                              console.log('Mapa carregado.');
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
                            // Controles de interatividade - sempre ativo no fullscreen
                            dragPan={true}
                            dragRotate={true}
                            scrollZoom={true}
                            boxZoom={true}
                            doubleClickZoom={true}
                            touchZoom={true}
                            touchRotate={true}
                            keyboard={true}
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
                                  onMouseEnter={() => {
                                    if (!selectedTour) {
                                      setHoveredLocation(location);
                                      setShowHoverPopup(true);
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (!selectedLocation || selectedLocation.id !== location.id) {
                                      setHoveredLocation(null);
                                      setShowHoverPopup(false);
                                    }
                                  }}
                                  animate={{
                                    scale: (selectedTour &&
                                      checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                      ? 1.3 : 1,
                                    backgroundColor: (selectedTour &&
                                      checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                      ? '#f8e71c' : '#fae523'
                                  }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                  className={`w-8 h-8 border-3 border-theme rounded-full flex items-center justify-center shadow-lg cursor-pointer ${selectedTour ? 'ring-2 ring-white/50' : ''
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

                          {/* LayerControl agora flutua sobre o mapa */}
                          <LayerControl isVisible={!selectedTour} />

                          </div>
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
                              console.log('Mapa carregado.');
                            }}
                            onMove={evt => {
                              // Always update viewState but prevent user interaction during tour
                              setViewState(evt.viewState);
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              cursor: isMapInteractive ? 'grab' : 'default'
                            }}
                            mapStyle="https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
                            attributionControl={false}
                            // Controles de interatividade baseados em Ctrl
                            dragPan={isMapInteractive}
                            dragRotate={isMapInteractive}
                            scrollZoom={isMapInteractive}
                            boxZoom={isMapInteractive}
                            doubleClickZoom={isMapInteractive}
                            touchZoom={isMapInteractive}
                            touchRotate={isMapInteractive}
                            keyboard={isMapInteractive}
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
                                  onMouseEnter={() => {
                                    if (!selectedTour) {
                                      setHoveredLocation(location);
                                      setShowHoverPopup(true);
                                    }
                                  }}
                                  onMouseLeave={() => {
                                    if (!selectedLocation || selectedLocation.id !== location.id) {
                                      setHoveredLocation(null);
                                      setShowHoverPopup(false);
                                    }
                                  }}
                                  animate={{
                                    scale: (selectedTour &&
                                      checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                      ? 1.3 : 1,
                                    backgroundColor: (selectedTour &&
                                      checkTourLocationMatch(selectedTour.chapters[currentChapter], location))
                                      ? '#f8e71c' : '#fae523'
                                  }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                  className={`w-8 h-8 border-3 border-theme rounded-full flex items-center justify-center shadow-lg cursor-pointer ${selectedTour ? 'ring-2 ring-white/50' : ''
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

                            {/* Popup para hover */}
                            {hoveredLocation && showHoverPopup && !selectedLocation && !selectedTour && (
                              <Popup
                                longitude={hoveredLocation.coordinates.lng}
                                latitude={hoveredLocation.coordinates.lat}
                                anchor="bottom"
                                closeButton={false}
                                className="hover-popup"
                                closeOnClick={false}
                                closeOnMove={false}
                              >
                                <div className="popup-folha-pauta px-6 py-3 min-w-[200px]">
                                  <p className="font-scratchy text-4xl mb-1 text-black">{hoveredLocation.name}</p>
                                  <p className="font-sometype-mono text-xs mb-2 line-clamp-2 text-black">{hoveredLocation.description}</p>
                                  <div className="flex items-center gap-1">
                                    <span className="text-black px-2 py-1 text-xl font-scratchy border border-black">
                                      {hoveredLocation.itemCount} item
                                    </span>
                                    {hoveredLocation.coordinateType === 'extracted_from_notes' && (
                                      <span className="text-white px-1 py-1 text-xl font-scratchy border border-black">GPS</span>
                                    )}
                                    {hoveredLocation.coordinateType === 'estimated_from_places' && (
                                      <span className="bg-blue-500 text-white px-1 py-1 text-xl font-scratchy border border-black">EST</span>
                                    )}
                                    {hoveredLocation.coordinateType === 'default_brasilia' && (
                                      <span className="bg-gray-500 text-white px-1 py-1 text-xl font-scratchy border border-black">DEF</span>
                                    )}
                                  </div>
                                </div>
                              </Popup>
                            )}

                            {/* Popup para click (ativo/persistente) */}
                            {selectedLocation && !selectedTour && (
                              <Popup
                                longitude={selectedLocation.coordinates.lng}
                                latitude={selectedLocation.coordinates.lat}
                                anchor="bottom"
                                onClose={() => {
                                  setSelectedLocation(null);
                                  setShowHoverPopup(false);
                                }}
                                closeButton={true}
                                className="active-popup"
                              >
                                <div className="popup-folha-pauta px-7 py-4 min-w-[280px]">
                                  <p className="font-scratchy text-4xl mb-2 text-black">{selectedLocation.name}</p>
                                  <p className="font-scratchy text-2xl mb-3 text-black opacity-80">{selectedLocation.description}</p>
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-black px-2 py-1 border border-black text-xl font-scratchy">
                                      {selectedLocation.itemCount} itens
                                    </span>
                                    {selectedLocation.coordinateType === 'extracted_from_notes' && (
                                      <span className="bg-green-500 text-white px-2 py-1 border border-black text-xl font-scratchy">
                                        GPS
                                      </span>
                                    )}
                                    {selectedLocation.coordinateType === 'estimated_from_places' && (
                                      <span className="bg-blue-500 text-white px-2 py-1 border border-black text-xl font-scratchy">
                                        EST
                                      </span>
                                    )}
                                    {selectedLocation.coordinateType === 'default_brasilia' && (
                                      <span className="bg-gray-500 text-white px-2 py-1 border border-black text-xl font-scratchy">
                                        DEF
                                      </span>
                                    )}
                                  </div>
                                  {selectedLocation.items && selectedLocation.items.length > 0 && (
                                    <div className="pt-3">
                                      <p className="font-scratchy text-2xl font-bold mb-2 text-black">Item em destaque:</p>
                                      <div className="flex gap-3">
                                        {selectedLocation.items[0].thumbnail && (
                                          <img
                                            src={selectedLocation.items[0].thumbnail}
                                            alt={selectedLocation.items[0].title}
                                            className="w-12 h-12 object-cover border border-black"
                                          />
                                        )}
                                        <div>
                                          <p className="font-scratchy text-xl font-semibold text-black">{selectedLocation.items[0].title}</p>
                                          <p className="font-scratchy text-xl text-black opacity-60">{selectedLocation.items[0].date}</p>
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
                className={`mb-12 px-6 ${currentTheme === 'light' ? 'fundo-base' : 'fundo-base-preto'}`}
                id="regions-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div>
                  <div className="mb-8">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-sometype-mono text-black mb-4 text-left">REGIÕES MAPEADAS</h3>
                    <p className="font-sometype-mono text-lg text-black text-left">
                      {locations.length} {locations.length === 1 ? 'região mapeada' : 'regiões mapeadas'}
                      {totalPages > 1 && ` - Página ${currentPage} de ${totalPages}`}
                    </p>
                  </div>

                  {mapError && (
                    <div className="text-center py-8 mb-8">
                      <div className="bg-theme-background border-2 border-theme p-6">
                        <p className="font-dirty-stains text-xl mb-2">Erro ao carregar mapa</p>
                        <p className="font-sometype-mono">{mapError}</p>
                      </div>
                    </div>
                  )}

                  {/* Loading específico para regiões */}
                  {isRegionsLoading ? (
                    <div className="text-center py-12">
                      <div className="bg-white border-2 border-theme p-8">
                        <div className="flex justify-center mb-4 h-8">
                          <div className="flex gap-1 items-end">
                            {[0, 1, 2].map((index) => (
                              <motion.div
                                key={index}
                                className="w-3 bg-theme-primary border border-theme"
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
                          className={`border-2 border-theme p-6 cursor-pointer transition-all duration-300`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 bg-[#fae523] border-2 border-theme rounded-full flex items-center justify-center">
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
                            <h4 className="font-dirty-stains text-2xl text-theme">{location.name}</h4>
                          </div>

                          <p className="font-sometype-mono text-sm text-theme/80 mb-4">{location.description}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              <span className="bg-[#fae523] text-theme px-3 py-1 rounded-full text-sm font-sometype-mono border border-theme">
                                {location.itemCount} item
                              </span>
                              {location.coordinateType === 'extracted_from_notes' && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-sometype-mono border border-green-300">
                                  GPS
                                </span>
                              )}
                              {location.coordinateType === 'estimated_from_places' && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-sometype-mono border border-blue-300">
                                  EST
                                </span>
                              )}
                              {location.coordinateType === 'default_brasilia' && (
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-sometype-mono border border-gray-300">
                                  DEF
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleMarkerClick(location)}
                              className="font-sometype-mono text-sm text-theme hover:text-theme/70 underline"
                            >
                              Ver no mapa →
                            </button>
                          </div>

                          {/* Coordenadas para debug */}
                          <div className="mt-3 pt-3 border-t border-theme/20">
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
                      <div className="bg-white/90 border-2 border-theme rounded-lg p-6 max-w-md mx-auto">
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
                              className={`cursor-pointer border-2 border-theme ${currentPage === 1
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
                                className={`cursor-pointer border-2 border-theme font-dirty-stains ${page === currentPage
                                    ? 'bg-blue-500 text-theme hover:bg-blue-600'
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
                              className={`cursor-pointer border-2 border-theme ${currentPage === totalPages
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

              <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden border-r-3 border-l-3 border-t-3 border-b-3 border-theme p-8">


                {/* Decorative elements */}
                <div className="absolute inset-0 z-10 pointer-events-none decorative-elements">

                  {/* Spray effects */}
                  <div
                    className="absolute -bottom-10 left-15 w-64 h-64 bg-contain bg-no-repeat"
                    style={{
                      backgroundImage: "url('/cursor02.webp')"
                    }}
                  />

                  <div
                    className="absolute top-0 -right-15 w-32 h-32 bg-contain bg-no-repeat"
                    style={{
                      backgroundImage: "url('/spray_preto-1.webp')"
                    }}
                  />

                  <div
                    className="absolute top-5 left-16 w-28 h-28 bg-contain bg-no-repeat rotate-45"
                    style={{
                      backgroundImage: "url('/spray_preto-2.webp')"
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
                    Este é o <span className="marca-texto-amarelo px-2 py-1">Mapa das Batalhas</span>: uma ferramenta da nossa plataforma interativa que conecta as Batalhas de MC´s do DF, mostrando de forma dinâmica e precisa onde e quando a cultura urbana se manifestou e continua a pulsar.

                    Neste mapa, <span className="marca-texto-amarelo px-2 py-1">geolocalizações</span> e <span className="marca-texto-verde px-2 py-1">arquivos</span> se unem para criar um panorama da resistência cultural do DF, <span className="marca-texto-amarelo px-2 py-1">mapeando encontros</span>, datas e trajetórias que desenham o <span className="marca-texto-amarelo px-2 py-1">território Hip Hop</span>. Nosso <span className="marca-texto-amarelo px-2 py-1">mapa</span> permite navegar por essa <span className="marca-texto-amarelo px-2 py-1">geografia</span> em tempo real, onde a <span className="marca-texto-verde px-2 py-1">memória</span> se move e se transforma em dados dinâmicos. A cada clique, você mergulha na <span className="marca-texto-verde px-2 py-1">história</span> do Hip Hop DF.
                    Veja o <span className="marca-texto-amarelo px-2 py-1">Distrito Federal</span> além dos setores e monumentos. Aqui, traçamos <span className="marca-texto-amarelo px-2 py-1">pontos</span> que conectam a força de uma cultura que nasceu à margem. E com isso, fazemos do <span className="marca-texto-amarelo px-2 py-1">território</span> um palco, onde cada <span className="marca-texto-amarelo px-2 py-1">batalha</span> é parte dessa construção. Ao acessar, surpreenda-se com a potência desta <span className="marca-texto-amarelo px-2 py-1">cidade</span>, agora também construída por você.
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
                    className="bg-white border-4 border-theme rounded-lg p-6 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-dirty-stains text-2xl text-theme">{selectedLocation.name}</h3>
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className="text-theme hover:text-gray-600 text-2xl font-bold"
                      >
                        ×
                      </button>
                    </div>
                    
                    <p className="font-sometype-mono text-sm text-theme/80 mb-4">{selectedLocation.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2">
                        <span className="bg-[#fae523] text-theme px-2 py-1 rounded text-xs font-sometype-mono border border-theme">
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
                      <div className="border-t border-theme/20 pt-4">
                        <h4 className="font-sometype-mono text-sm font-bold mb-2">Item em destaque:</h4>
                        <div className="flex gap-3">
                          {selectedLocation.items[0].thumbnail && (
                            <img 
                              src={selectedLocation.items[0].thumbnail} 
                              alt={selectedLocation.items[0].title}
                              className="w-16 h-16 object-cover rounded border border-theme"
                            />
                          )}
                          <div>
                            <p className="font-sometype-mono text-sm font-semibold text-theme">{selectedLocation.items[0].title}</p>
                            <p className="font-sometype-mono text-xs text-theme/60">{selectedLocation.items[0].date}</p>
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
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HeaderApp from '@/components/html/HeaderApp';
import { useAcervo } from '@/contexts/AcervoContext';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

export default function Mapa() {
  // Context hook for real data
  const { 
    mapData, 
    geoJson, 
    mapStatistics, 
    loadMapData, 
    isLoading, 
    getError 
  } = useAcervo();

  const [isMapLoading, setIsMapLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 regiões por página
  
  // Estado local para controlar carregamento das regiões separadamente
  const [regionsLoading, setRegionsLoading] = useState(false);

  // Load map data de forma assíncrona (não bloqueia a página)
  useEffect(() => {
    const loadMapDataAsync = async () => {
      setRegionsLoading(true);
      try {
        await loadMapData();
      } catch (error) {
        console.error('Erro ao carregar dados do mapa:', error);
      } finally {
        setRegionsLoading(false);
      }
    };

    // Delay para permitir que a página renderize primeiro
    setTimeout(loadMapDataAsync, 100);
  }, [loadMapData]);

  // Função para carregar mais dados se necessário
  const loadMoreData = async () => {
    setRegionsLoading(true);
    try {
      await loadMapData('8337', true, false); // Modo completo
    } catch (error) {
      console.error('Erro ao carregar dados completos:', error);
    } finally {
      setRegionsLoading(false);
    }
  };

  // Convert GeoJSON features to locations format for the map
  const locations = geoJson?.features?.map(feature => ({
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
  })) || [];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => setIsMapLoading(false), 800);
    }
  }, []);

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  const toggleFullscreen = async () => {
    if (!mapContainerRef.current) return;

    if (!isFullscreen) {
      try {
        if (mapContainerRef.current.requestFullscreen) {
          await mapContainerRef.current.requestFullscreen();
        }
        setIsFullscreen(true);
      } catch (error) {
        console.error('Erro ao entrar em tela cheia:', error);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
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
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
      <div className={`relative z-10 overflow-hidden ${isPageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <HeaderApp title="MAPA DO HIP HOP" showTitle={true} />

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
                  {mapStatistics && (
                    <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-sometype-mono">
                      <span className="bg-[#fae523] text-black px-3 py-1 rounded border border-black">
                        {mapStatistics.totalItems} locais mapeados
                      </span>
                      <span className="bg-white/90 text-black px-3 py-1 rounded border border-black">
                        {mapStatistics.extractionSuccessRate} precisão
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Container do Mapa Placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative w-full"
              >
                <div className="mx-4 md:mx-8 mb-8">
                  <div 
                    ref={mapContainerRef}
                    className={`border-4 border-black rounded-lg overflow-hidden shadow-2xl bg-gray-200 relative ${
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
                      {/* Mapa placeholder com indicação dos dados carregados */}
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                        <div className="text-center p-8">
                          <div className="mb-6">
                            <div className="w-16 h-16 bg-[#fae523] border-4 border-black rounded-full mx-auto mb-4 flex items-center justify-center">
                              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                              </svg>
                            </div>
                            <h3 className="font-dirty-stains text-2xl mb-2">Mapa Interativo</h3>
                            <p className="font-sometype-mono text-sm text-gray-600 mb-4">
                              {locations.length} locais carregados do acervo
                            </p>
                            {mapStatistics && (
                              <p className="font-sometype-mono text-xs text-gray-500">
                                {mapStatistics.extractionSuccessRate} de precisão GPS
                              </p>
                            )}
                          </div>
                          <div className="bg-white/90 border-2 border-black rounded-lg p-4 max-w-md mx-auto">
                            <p className="font-sometype-mono text-sm">
                              🗺️ Componente de mapa em desenvolvimento<br/>
                              📍 Dados do acervo carregados com sucesso<br/>
                              ⚡ Coordenadas extraídas automaticamente
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Lista de Locais */}
              <div className="container mx-auto px-4 py-8">
                <motion.div
                  id="regions-section"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center mb-8">
                    <h3 className="font-dirty-stains text-4xl text-black mb-4">REGIÕES MAPEADAS</h3>
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-sometype-mono text-lg text-black/80">
                        {locations.length} {locations.length === 1 ? 'região mapeada' : 'regiões mapeadas'}
                        {totalPages > 1 && ` - Página ${currentPage} de ${totalPages}`}
                      </p>
                      {locations.length > 0 && locations.length < 100 && (
                        <button
                          onClick={loadMoreData}
                          disabled={isRegionsLoading}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white border-2 border-black font-dirty-stains text-sm transition-colors"
                        >
                          {isRegionsLoading ? '⏳ Carregando...' : '📈 Carregar Mais Regiões'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {mapError && (
                    <div className="text-center py-8 mb-8">
                      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 max-w-md mx-auto">
                        <p className="font-dirty-stains text-xl text-red-600 mb-2">Erro ao carregar mapa</p>
                        <p className="font-sometype-mono text-red-500">{mapError}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Loading específico para regiões */}
                  {isRegionsLoading ? (
                    <div className="text-center py-12">
                      <div className="bg-white/90 border-2 border-black rounded-lg p-8 max-w-md mx-auto">
                        <div className="flex justify-center mb-4">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((index) => (
                              <motion.div
                                key={index}
                                className="w-3 h-8 bg-[#fae523] rounded-sm border border-black"
                                initial={{ height: 8 }}
                                animate={{ height: [8, 32, 8] }}
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
                          🗺️ Processando dados do acervo para gerar coordenadas geográficas
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
                        onClick={() => handleLocationClick(location)}
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
                            onClick={() => handleLocationClick(location)}
                            className="font-sometype-mono text-sm text-black hover:text-black/70 underline"
                          >
                            Ver detalhes →
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
                                  : 'hover:bg-[#fae523] transition-colors'
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
                                    : 'bg-white hover:bg-[#fae523] transition-colors'
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
                                  : 'hover:bg-[#fae523] transition-colors'
                              }`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Modal de detalhes do local */}
              {selectedLocation && (
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
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HeaderApp from '@/components/html/HeaderApp';
import { Marker, Popup } from 'react-map-gl/maplibre';
import { MapProvider } from '@/contexts/MapContext';
import MapRenderer from '@/components/mapa/MapRenderer';
import { useMapLayers } from '@/hooks/useMapLayers';
import MapSearchComponent from '@/components/mapa/MapSearchComponent';
import TourMenu from '@/components/mapa/TourMenu';
import MapboxStorytellingOverlay from '@/components/mapa/MapboxStorytellingOverlay';
import LayerControl from '@/components/mapa/LayerControl';
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

// Layout expandido customizado seguindo especificações
const FullscreenMapLayout = ({ 
  selectedLocation, 
  selectedTour, 
  currentChapter,
  filteredLocations,
  isFullscreen,
  handleLocationFilter,
  handleMarkerClick,
  handleTourSelect,
  handleMapFlyTo,
  handleChapterChange,
  viewState,
  setViewState,
  mapRef,
  getIconComponent,
  checkTourLocationMatch
}) => {
  return (
    <div className="h-full flex bg-theme-background">
      {/* Menu lateral - 1/5 da tela total */}
      <div className="w-1/5 bg-white border-r-2 border-theme flex flex-col">
        <div className="p-4 border-b-2 border-theme bg-theme-background">
          <h3 className="text-lg font-dirty-stains text-theme-primary text-left">BUSCA E CAMADAS</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search Component */}
          <div className="bg-theme-background border-2 border-theme p-3">
            <h4 className="font-dirty-stains text-sm text-theme-primary mb-2">Busca no Mapa</h4>
            <MapSearchComponent
              isFullscreen={isFullscreen}
              onLocationFilter={handleLocationFilter}
              onMarkerClick={handleMarkerClick}
              selectedLocation={selectedLocation}
            />
          </div>
          
          {/* Layer Control */}
          <div className="bg-theme-background border-2 border-theme p-3">
            <h4 className="font-dirty-stains text-sm text-theme-primary mb-2">Controle de Camadas</h4>
            <LayerControl isVisible={true} />
          </div>
          
          {/* Informações do POI selecionado */}
          {selectedLocation && (
            <div className="bg-blue-50 border-2 border-blue-300 p-3">
              <h4 className="font-dirty-stains text-sm text-blue-800 mb-2">LOCAL SELECIONADO</h4>
              <h5 className="font-dirty-stains text-sm mb-1">{selectedLocation.name}</h5>
              <p className="font-sometype-mono text-xs text-gray-700 mb-2 line-clamp-3">{selectedLocation.description}</p>
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-300 text-xs font-sometype-mono">
                  {selectedLocation.itemCount} {selectedLocation.itemCount === 1 ? 'item' : 'itens'}
                </span>
                {selectedLocation.has_real_coordinates && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 border border-green-300 text-xs font-sometype-mono">
                    GPS
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Área restante - 4/5 da tela */}
      <div className="flex-1 flex flex-col">
        {/* Barra de tours ocupando 1/4 da área restante */}
        <div className="h-1/4 bg-white border-b-2 border-theme flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-theme-background">
            <h3 className="text-lg font-dirty-stains text-theme-primary text-left">TOURS INTERATIVOS</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <TourMenu
              isFullscreen={isFullscreen}
              onTourSelect={handleTourSelect}
              selectedTour={selectedTour}
            />
            
            {/* Mapbox Storytelling Overlay */}
            {selectedTour && (
              <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 p-3">
                <MapboxStorytellingOverlay
                  selectedTour={selectedTour}
                  onMapMove={handleMapFlyTo}
                  onChapterChange={handleChapterChange}
                  isVisible={true}
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Mapa ocupando a maior parte da tela (3/4 da área restante) */}
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
                  className={`w-8 h-8 border-3 border-theme rounded-full flex items-center justify-center shadow-lg cursor-pointer ${
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
        </div>
      </div>
    </div>
  );
};

// Agora você pode usar este componente no modo fullscreen
export default FullscreenMapLayout;
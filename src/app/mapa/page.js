"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedButton from '@/components/AnimatedButton';
import HeaderApp from '@/components/html/HeaderApp';
import { Popup } from 'react-map-gl/maplibre';
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

// GUI-NOTE: Internal component that uses map context
const MapaContent = () => {
  // Context hook for real data from development branch
  const {
    mapData,
    geoJson,
    mapStatistics,
    loadMapData,
    clearCache,
    isLoading,
    getError
  } = useAcervo();

  const mapLayers = useMapLayers();

  const [currentTheme, setCurrentTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    
    // Delay para evitar conflitos com animações da página
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);

  // GUI-NOTE: Initialize map layers when component mounts
  useEffect(() => {
    console.log('[MapPage] Initializing map layers...');
    mapLayers.initializeDefaultLayers();
  }, []);

  // State to track if hip-hop-locations layer has been updated
  const [hipHopLayerUpdated, setHipHopLayerUpdated] = useState(false);

  // Update hip-hop-locations layer when geoJson data is available
  useEffect(() => {
    if (geoJson?.features?.length > 0 && !hipHopLayerUpdated) {
      console.log('[MapPage] 🎯 Atualizando layers hip-hop-locations com', geoJson.features.length, 'itens do acervo');
      mapLayers.updateLayerData('hip-hop-locations', geoJson);
      mapLayers.updateLayerData('hip-hop-locations-center', geoJson);
      mapLayers.updateLayerProperty('hip-hop-locations', 'visible', true);
      mapLayers.updateLayerProperty('hip-hop-locations-center', 'visible', true);
      setHipHopLayerUpdated(true);
    }
  }, [geoJson, hipHopLayerUpdated]);

  // GUI-NOTE: Helper function to get icon component for random points
  const getIconComponent = (location) => {
    if (!location.isRandomPoint || !location.iconType) return null;
    const iconType = iconTypes.find(icon => icon.name === location.iconType);
    return iconType ? iconType.component : null;
  };

  // GUI-NOTE: Helper function to check if tour chapter matches location
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

  // Estados para paginação das regiões
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 regiões por página

  // Estados para paginação da busca no fullscreen
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchItemsPerPage] = useState(10); // 10 resultados de busca por página

  // Estado local para controlar carregamento das regiões separadamente
  const [regionsLoading, setRegionsLoading] = useState(false);

  // Estado para controlar hover nos markers
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const [hoveredCoordinates, setHoveredCoordinates] = useState(null);
  const [showHoverPopup, setShowHoverPopup] = useState(false);


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
        await loadMapData(null, false, true); // Carregar TODOS os itens do acervo
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

  // Effect para fechar modal automaticamente quando sair do fullscreen
  useEffect(() => {
    if (!isFullscreen && isDetailModalOpen) {
      setIsDetailModalOpen(false);
    }
  }, [isFullscreen, isDetailModalOpen]);

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
      coordinateType: feature.properties.coordinate_source,
      ...feature.properties
    }));
  }, [geoJson]);

  // Set filtered locations state for search functionality
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
  // State for DF localities
  const [dfLocalities, setDfLocalities] = useState([]);
  const [allSearchableLocations, setAllSearchableLocations] = useState([]);
  
  // State for Administrative Regions (RAs)
  const [administrativeRegions, setAdministrativeRegions] = useState([]);
  const [selectedRA, setSelectedRA] = useState(null);
  const [isRASearch, setIsRASearch] = useState(false);

  // Load DF localities from government service
  useEffect(() => {
    const loadDfLocalities = async () => {
      try {
        const response = await fetch(
          'https://www.geoservicos.ide.df.gov.br/arcgis/rest/services/Publico/LOCALIDADES/MapServer/0/query?where=1%3D1&outFields=objectid,nome,tipo&outSR=4326&f=geojson&returnGeometry=true'
        );
        const data = await response.json();
        
        if (data.features) {
          const localities = data.features.map(feature => ({
            id: `df-locality-${feature.properties.objectid}`,
            name: feature.properties.nome,
            description: feature.properties.tipo === 1 ? 'Região Administrativa do DF' : 
                        feature.properties.tipo === 2 ? 'Localidade do DF' : 'Localidade não classificada',
            coordinates: {
              lng: feature.geometry.coordinates[0],
              lat: feature.geometry.coordinates[1]
            },
            itemCount: 0,
            items: [],
            slug: `df-locality-${feature.properties.objectid}`,
            reference_code: `DF-LOC-${feature.properties.objectid}`,
            place_access_points: [feature.properties.nome],
            has_real_coordinates: true,
            isRandomPoint: false,
            coordinateType: 'government_source',
            sourceType: 'df_locality',
            locality_type: feature.properties.tipo,
            locality_type_name: feature.properties.tipo === 1 ? 'Região Administrativa' : 
                               feature.properties.tipo === 2 ? 'Localidade' : 'Não Informado'
          }));
          
          setDfLocalities(localities);
        }
      } catch (error) {
        console.error('Erro ao carregar localidades do DF:', error);
      }
    };

    loadDfLocalities();
  }, []);

  // Load Administrative Regions from government service
  useEffect(() => {
    const loadAdministrativeRegions = async () => {
      try {
        const response = await fetch(
          'https://www.geoservicos.ide.df.gov.br/arcgis/rest/services/Publico/LIMITES/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&returnGeometry=true'
        );
        const data = await response.json();
        
        if (data.features) {
          setAdministrativeRegions(data.features);
        }
      } catch (error) {
        console.error('Erro ao carregar regiões administrativas:', error);
      }
    };

    loadAdministrativeRegions();
  }, []);

  // Debounce search term to avoid instant search while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Function to check if search term matches an Administrative Region
  const checkRASearch = (term) => {
    if (!term || !administrativeRegions.length) return null;
    
    const searchLower = term.toLowerCase().trim();
    
    // List of known RA names for matching
    const raNames = [
      'brasília', 'gama', 'taguatinga', 'brazlândia', 'sobradinho', 'planaltina',
      'paranoá', 'núcleo bandeirante', 'ceilândia', 'guará', 'cruzeiro', 'samambaia',
      'santa maria', 'são sebastião', 'recanto das emas', 'lago sul', 'riacho fundo',
      'lago norte', 'candangolândia', 'águas claras', 'riacho fundo ii', 'sudoeste',
      'octogonal', 'varjão', 'park way', 'scia', 'sobradinho ii', 'jardim botânico',
      'itapoã', 'sia', 'vicente pires', 'fercal', 'sol nascente', 'arniqueira'
    ];
    
    // Check if search term matches any RA name
    const matchedRA = raNames.find(ra => 
      ra.includes(searchLower) || searchLower.includes(ra)
    );
    
    if (matchedRA) {
      // Find the corresponding RA feature in the data
      const raFeature = administrativeRegions.find(feature => 
        feature.properties.ra_nome && 
        feature.properties.ra_nome.toLowerCase().includes(matchedRA)
      );
      return raFeature;
    }
    
    return null;
  };

  // Enhanced search function that searches across multiple fields
  const performSearch = (term, locationsData) => {
    if (!term || term.trim() === '') {
      setSelectedRA(null);
      setIsRASearch(false);
      return locationsData;
    }
    
    // Reset previous RA selection for each new search
    setSelectedRA(null);
    setIsRASearch(false);
    
    // Check if this is a search for an Administrative Region
    const raMatch = checkRASearch(term);
    if (raMatch) {
      setSelectedRA(raMatch);
      setIsRASearch(true);
      
      // Filter locations that are related to this RA (textually or geographically)
      const searchLower = term.toLowerCase().trim();
      return locationsData.filter(location => {
        // Text-based matching in various fields
        const textMatch = (
          (location.name && location.name.toLowerCase().includes(searchLower)) ||
          (location.description && location.description.toLowerCase().includes(searchLower)) ||
          (location.place_access_points && Array.isArray(location.place_access_points) && 
           location.place_access_points.some(point => point && point.toLowerCase().includes(searchLower))) ||
          (location.reference_code && location.reference_code.toLowerCase().includes(searchLower)) ||
          (location.items && Array.isArray(location.items) && 
           location.items.some(item => item.title && item.title.toLowerCase().includes(searchLower)))
        );
        
        // TODO: Add geographic filtering based on coordinates within RA boundaries
        // For now, return text matches
        return textMatch;
      });
    } else {
      setSelectedRA(null);
      setIsRASearch(false);
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

  // Combine all searchable locations (Hip Hop + DF localities)
  useEffect(() => {
    const combined = [...locations, ...dfLocalities];
    setAllSearchableLocations(combined);
  }, [locations, dfLocalities]);

  // Update filtered locations when debounced search term changes
  useEffect(() => {
    const filtered = performSearch(debouncedSearchTerm, allSearchableLocations);
    setFilteredLocations(filtered);
    setSearchCurrentPage(1); // Reset search pagination when search term changes
  }, [allSearchableLocations, debouncedSearchTerm]);

  // Update selected RA layer when RA is selected
  useEffect(() => {
    // Only proceed if layers are initialized and we have layers loaded
    if (!mapLayers.isInitialized || mapLayers.layers.length === 0) {
      console.log('[MapPage] Layers not ready yet, skipping RA selection update');
      return;
    }
    
    // Add a small delay to ensure layers are fully rendered on the map
    const timer = setTimeout(() => {
      console.log('[MapPage] RA selection changed. selectedRA:', selectedRA);
      
      if (selectedRA) {
        console.log('[MapPage] Showing specific RA:', selectedRA.properties?.ra_nome);
        // Always clear previous selection first
        mapLayers.updateLayerProperty('ra-selected-highlight', 'visible', false);
        mapLayers.updateLayerProperty('ra-selected-outline', 'visible', false);
        
        // Update data for both highlight and outline layers
        const raData = {
          type: 'FeatureCollection',
          features: [selectedRA]
        };
        
        // Update both layers with the new RA data
        mapLayers.updateLayerData('ra-selected-highlight', raData);
        mapLayers.updateLayerData('ra-selected-outline', raData);
        
        // Show both highlight and outline
        mapLayers.updateLayerProperty('ra-selected-highlight', 'visible', true);
        mapLayers.updateLayerProperty('ra-selected-outline', 'visible', true);
        
        // Hide the general RAs layer to show only the selected one
        mapLayers.updateLayerProperty('regioes-administrativas-df', 'visible', false);
        
        // FLY TO RA: Calcular centro da RA e navegar até ela
        if (selectedRA.geometry && selectedRA.geometry.coordinates) {
          try {
            const calculatePolygonBounds = (coordinates) => {
              let minLng = Infinity, maxLng = -Infinity;
              let minLat = Infinity, maxLat = -Infinity;
              
              coordinates.forEach(coord => {
                minLng = Math.min(minLng, coord[0]);
                maxLng = Math.max(maxLng, coord[0]);
                minLat = Math.min(minLat, coord[1]);
                maxLat = Math.max(maxLat, coord[1]);
              });
              
              return {
                minLng, maxLng, minLat, maxLat,
                centerLng: (minLng + maxLng) / 2,
                centerLat: (minLat + maxLat) / 2,
                width: maxLng - minLng,
                height: maxLat - minLat
              };
            };
            
            let bounds;
            
            // Calcular bounding box baseado no tipo de geometria
            if (selectedRA.geometry.type === 'Polygon') {
              bounds = calculatePolygonBounds(selectedRA.geometry.coordinates[0]);
            } else if (selectedRA.geometry.type === 'MultiPolygon') {
              // Para multi-polígonos, usar o primeiro polígono
              bounds = calculatePolygonBounds(selectedRA.geometry.coordinates[0][0]);
            }
            
            // Fazer fly para o centro da RA com zoom calculado
            if (bounds && bounds.centerLng && bounds.centerLat) {
              // Calcular zoom baseado no tamanho da RA
              const maxDimension = Math.max(bounds.width, bounds.height);
              let zoom = 12; // zoom padrão
              
              if (maxDimension > 0.5) zoom = 9;       // RA muito grande
              else if (maxDimension > 0.2) zoom = 10; // RA grande  
              else if (maxDimension > 0.1) zoom = 11; // RA média
              else if (maxDimension > 0.05) zoom = 12; // RA pequena
              else zoom = 13; // RA muito pequena
              
              console.log('[MapPage] Navegando para RA:', selectedRA.properties?.ra_nome, 
                         'Centro:', bounds.centerLat.toFixed(4), bounds.centerLng.toFixed(4),
                         'Zoom:', zoom, 'Dimensões:', bounds.width.toFixed(4), 'x', bounds.height.toFixed(4));
              
              handleMapFlyTo({
                longitude: bounds.centerLng,
                latitude: bounds.centerLat,
                zoom: zoom,
                speed: 1.5 // Velocidade moderada para permitir acompanhar a navegação
              });
            }
          } catch (error) {
            console.error('[MapPage] Erro ao calcular centro da RA:', error);
          }
        }
        
      } else {
        console.log('[MapPage] No RA selected, ensuring all RAs are visible');
        // Clear selection and show all RAs when no specific RA is selected
        mapLayers.updateLayerProperty('ra-selected-highlight', 'visible', false);
        mapLayers.updateLayerProperty('ra-selected-outline', 'visible', false);
        mapLayers.updateLayerProperty('regioes-administrativas-df', 'visible', true);
      }
    }, 500); // 500ms delay to ensure layers are fully loaded
    
    return () => clearTimeout(timer);
  }, [selectedRA, mapLayers.isInitialized, mapLayers.layers.length]);

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
    setShowHoverPopup(false); // Hide hover popup when clicking
    
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
    if (location.coordinates) {
      setViewState({
        ...viewState,
        longitude: location.coordinates.lng,
        latitude: location.coordinates.lat,
        zoom: 14 // Zoom mais próximo para melhor enquadramento
      });
    }
  };

  const handleMarkerHover = (location, lngLat) => {
    if (location && lngLat) {
      setHoveredLocation(location);
      setHoveredCoordinates({ lng: lngLat.lng, lat: lngLat.lat });
      setShowHoverPopup(true);
    } else {
      setHoveredLocation(null);
      setHoveredCoordinates(null);
      setShowHoverPopup(false);
    }
  };

  // GUI-NOTE: Handler for search component to filter map locations
  const handleLocationFilter = (locations) => {
    setFilteredLocations(locations);
  };

  // GUI-NOTE: Handler for tour selection and management
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

  // GUI-NOTE: Handler for map movement with smooth transitions
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

  // GUI-NOTE: Handler for flyTo using MapLibre GL JS native method
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

  // GUI-NOTE: Handler for chapter changes during tour
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

  const LocationDetailModal = ({ location, onClose }) => {
    console.log("🎯 LocationDetailModal renderizando! Location:", location?.name || location?.title);
    if (!location) {
      console.log("❌ LocationDetailModal - location é null, retornando null");
      return null;
    }
    console.log("✅ LocationDetailModal - location válido, renderizando modal");

    // Função para formatear datas
    const formatDate = (dateString) => {
      if (!dateString) return 'Não informado';
      try {
        return new Date(dateString).toLocaleDateString('pt-BR');
      } catch {
        return dateString;
      }
    };

    // Função para determinar qual URL usar para imagem (prioriza reference_url)
    const getImageUrl = () => {
      let url = location.reference_url || location.thumbnail_url || location.digital_object_url;
      
      if (url) {
        // Aplicar correções de URL
        if (url.includes('acervodistrito') && !url.includes('base.acervodistrito')) {
          url = url.replace('https://acervodistrito', 'https://base.acervodistrito');
          url = url.replace('http://acervodistrito', 'https://base.acervodistrito');
        }
      }
      
      return url;
    };

    // Seções organizadas de dados
    const sections = {
      identification: {
        title: "IDENTIFICAÇÃO",
        fields: {
          "Título": location.title || location.name,
          "Código de Referência": location.reference_code,
          "Nível de Descrição": location.level_of_description,
          "Slug": location.slug
        }
      },
      content: {
        title: "CONTEÚDO",
        fields: {
          "Âmbito e Conteúdo": location.scope_and_content,
          "História Arquivística": location.archival_history,
          "Descrição": location.description,
          "Características Físicas": location.physical_characteristics
        }
      },
      context: {
        title: "CONTEXTO",
        fields: {
          "Data de Criação": Array.isArray(location.creation_dates) ? 
            location.creation_dates.map(date => formatDate(date)).join(', ') : 
            formatDate(location.creation_dates),
          "Pontos de Acesso de Local": Array.isArray(location.place_access_points) ? 
            location.place_access_points.join(', ') : 
            location.place_access_points,
          "Pontos de Acesso de Assunto": Array.isArray(location.subject_access_points) ?
            location.subject_access_points.join(', ') :
            location.subject_access_points,
          "Pontos de Acesso de Nome": Array.isArray(location.name_access_points) ?
            location.name_access_points.join(', ') :
            location.name_access_points
        }
      },
      technical: {
        title: "METADADOS TÉCNICOS",
        fields: {
          "Tipo de Coordenada": location.coordinateType,
          "Fonte da Coordenada": location.coordinate_source,
          "Latitude": location.coordinates?.lat || location.lat,
          "Longitude": location.coordinates?.lng || location.lng,
          "Tipo de Fonte": location.sourceType,
          "Tipo de Localidade": location.locality_type_name,
          "URL do Objeto Digital": location.digital_object_url,
          "URL de Referência": location.reference_url,
          "URL da Miniatura": location.thumbnail_url
        }
      },
      notes: {
        title: "NOTAS E OBSERVAÇÕES",
        fields: {
          "Notas": Array.isArray(location.notes) ? 
            location.notes.join(' | ') : 
            location.notes,
          "Condições de Acesso": location.access_conditions,
          "Condições de Reprodução": location.reproduction_conditions
        }
      }
    };

    
    return (
      <div 
        className="bg-white text-black w-full lg:max-w-6xl h-full lg:h-[90vh] overflow-hidden border-4 border-hip-amarelo flex flex-col" 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          position: 'relative',
          width: '100%',
          height: '100%'
        }}
      >
          {/* Header */}
          <div className="flex justify-between items-center border-b-3 border-black lg:p-6 p-4">
            <div>
              <h2 className="text-2xl font-dirty-stains text-black">{location.title || location.name || 'Detalhes do Item'}</h2>
              {location.reference_code && (
                <p className="font-sometype-mono text-sm text-black/70 mt-1">Ref: {location.reference_code}</p>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="bg-black text-white p-2 hover:bg-gray-800 transition-colors border-2 border-black"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="lg:p-6 p-3 lg:space-y-8 space-y-4">
              {/* Imagem principal */}
              {getImageUrl() && (
                <div className="border-3 border-black p-4">
                  <h3 className="font-dirty-stains text-lg text-black mb-4">IMAGEM</h3>
                  <div className="bg-white border-2 border-black p-2">
                    <img
                      src={getImageUrl()}
                      alt={location.title || location.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', e.target.src);
                        e.target.parentElement.innerHTML = '<div class="w-full h-64 bg-gray-200 flex items-center justify-center border-2 border-gray-300"><span class="text-gray-500 font-sometype-mono">Imagem indisponível</span></div>';
                      }}
                    />
                  </div>
                  {/* Links externos */}
                  <div className="mt-4 flex gap-2">
                    {location.digital_object_url && (
                      <a
                        href={location.digital_object_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-black text-white font-sometype-mono text-xs border-2 border-black hover:bg-gray-800 transition-colors"
                      >
                        Ver Original
                      </a>
                    )}
                    {location.slug && (
                      <a
                        href={`https://base.acervodistritohiphop.com.br/index.php/${location.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white text-black font-sometype-mono text-xs border-2 border-black hover:bg-gray-100 transition-colors"
                      >
                        Ver no AtoM
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Seções de dados */}
              {Object.entries(sections).map(([sectionKey, section]) => {
                const hasData = Object.values(section.fields).some(value => value && value !== 'Não informado');
                if (!hasData) return null;

                return (
                  <div key={sectionKey} className="p-4">
                    <h3 className="font-dirty-stains text-lg text-black mb-4 border-b-2 border-black pb-2">
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(section.fields).map(([key, value]) => {
                        if (!value || value === 'Não informado') return null;
                        
                        return (
                          <div key={key} className="p-3">
                            <h4 className="marca-texto-amarelo font-sometype-mono font-bold text-xs text-black/70 uppercase tracking-wider mb-1">
                              {key}
                            </h4>
                            <p className="font-sometype-mono text-sm text-black leading-relaxed">
                              {value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Seção especial para campos não mapeados */}
              {(() => {
                const mappedFields = new Set();
                Object.values(sections).forEach(section => {
                  Object.values(section.fields).forEach(value => {
                    if (typeof value === 'string') mappedFields.add(value);
                  });
                });

                const unmappedData = {};
                Object.entries(location).forEach(([key, value]) => {
                  if (value && 
                      !['coordinates', 'items', 'lat', 'lng', 'id'].includes(key) &&
                      !mappedFields.has(value) &&
                      typeof value !== 'object') {
                    unmappedData[key] = value;
                  }
                });

                if (Object.keys(unmappedData).length === 0) return null;

                return (
                  <div className="border-3 border-black p-4">
                    <h3 className="font-dirty-stains text-lg text-black mb-4 border-b-2 border-black pb-2">
                      DADOS ADICIONAIS
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(unmappedData).map(([key, value]) => (
                        <div key={key} className="p-3">
                          <h4 className="font-sometype-mono font-bold text-xs text-black/70 uppercase tracking-wider mb-1">
                            {key.replace(/_/g, ' ')}
                          </h4>
                          <p className="font-sometype-mono text-sm text-black leading-relaxed">
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
    );
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
                className=""
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
                    className={`border-b-3 border-theme overflow-hidden bg-gray-200 relative ${isFullscreen ? 'fullscreen-map' : ''
                      }`}
                  >

                    {/* Botão de Fullscreen no centro - visível apenas quando não há popup ativo */}
                    {!isFullscreen && !(hoveredLocation && showHoverPopup) && !selectedLocation && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4">
                        <div className="border-2 border-black bg-white px-4 py-3 font-sometype-mono text-sm shadow-lg">
                          <div className="flex items-center gap-2 text-black">                          
                            <span className="font-semibold">Clique para expandir o mapa</span>
                            {/* Botão de Fullscreen no centro */}
                        <button
                          onClick={toggleFullscreen}
                          className="border-theme border-2 bg-theme-background flex items-center justify-center transition-opacity p-3 cursor-pointer"
                          title="Expandir para tela cheia"
                        >
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        </button>
                          </div>
                        </div>
                        
                        
                      </div>
                    )}


                    {/* Botão de sair do fullscreen */}
                    {isFullscreen && (
                      <button
                        onClick={toggleFullscreen}
                        className="absolute top-4 right-4 z-[10001] flex items-center justify-center text-white bg-black bg-opacity-70 hover:bg-opacity-90 transition-opacity p-2 rounded-lg"
                        title="Sair da tela cheia"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}

                    <div style={{ height: isFullscreen ? '100vh' : '600px', position: isFullscreen ? 'fixed' : 'relative', top: isFullscreen ? 0 : 'auto', left: isFullscreen ? 0 : 'auto', width: isFullscreen ? '100vw' : '100%', zIndex: isFullscreen ? 9999 : 'auto' }}>
                      {isFullscreen ? (
                        /* Layout fullscreen - responsivo: sidebar esquerda em desktop, inferior em mobile */
                        <div className="h-full flex flex-col lg:flex-row">
                          {/* Sidebar - esquerda em desktop, inferior em mobile/tablet */}
                          <div className="lg:w-80 w-full lg:h-full md:h-1/3 h-2/5 min-h-[300px] bg-theme-background lg:border-r-2 border-t-2 lg:border-t-0 border-black flex flex-col overflow-hidden lg:order-1 order-2">
                            
                            {/* Header da Sidebar */}
                            <div className="border-b-2 border-black lg:p-4 p-2">
                              <p className="marca-texto-amarelo font-dirty-stains lg:text-2xl md:text-xl text-lg text-black">EXPLORAR MAPA</p>
                            </div>

                            {/* Busca e Filtros - quando não há tour ativo */}
                            {!selectedTour && (
                              <div className="flex-1 overflow-y-auto lg:p-4 p-2">
                                {/* Seção de Busca */}
                                <div className="lg:mb-6 mb-3">
                                  <h3 className="font-sometype-mono lg:text-lg text-sm font-bold text-black lg:mb-3 mb-2 border-b border-black pb-1">
                                    BUSCAR LOCAIS
                                  </h3>
                                  <div className="lg:space-y-3 space-y-2">
                                    <div className="relative">
                                      <input
                                        type="text"
                                        placeholder="Buscar em locais, descrições, pontos de acesso..."
                                        className="w-full lg:p-3 p-2 pr-10 border-2 border-black font-sometype-mono lg:text-sm text-xs text-black"
                                        value={searchTerm}
                                        onChange={(e) => {
                                          setSearchTerm(e.target.value);
                                        }}
                                      />
                                      {searchTerm && (
                                        <button
                                          onClick={() => setSearchTerm('')}
                                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black hover:text-black p-1"
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
                                      {(searchTerm || debouncedSearchTerm) && (
                                        <div className="text-xs font-sometype-mono">
                                          {isRASearch && selectedRA ? (
                                            <div className="space-y-1">
                                              <p className="text-purple-600 font-bold">
                                                🗺️ Busca por RA: "{selectedRA.properties.ra_nome || debouncedSearchTerm}"
                                              </p>
                                              <p className="text-blue-600">
                                                Mostrando apenas itens relacionados a esta região
                                              </p>
                                            </div>
                                          ) : (
                                            <div className="space-y-1">
                                              {searchTerm && searchTerm !== debouncedSearchTerm && (
                                                <p className="text-gray-500 italic">
                                                  Digitando: "{searchTerm}"
                                                </p>
                                              )}
                                              {debouncedSearchTerm && (
                                                <p className="text-blue-600">
                                                  Buscando: "{debouncedSearchTerm}"
                                                </p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Lista de Locais */}
                                <div className="lg:mb-6 mb-3">
                                  <h3 className="font-sometype-mono lg:text-lg text-sm font-bold text-black lg:mb-3 mb-2 border-b border-black pb-1">
                                    LOCAIS ENCONTRADOS
                                  </h3>
                                  <div className="lg:space-y-2 space-y-1">
                                    {(() => {
                                      // Calcular paginação da busca
                                      const searchTotalPages = Math.ceil(filteredLocations.length / searchItemsPerPage);
                                      const searchStartIndex = (searchCurrentPage - 1) * searchItemsPerPage;
                                      const searchEndIndex = searchStartIndex + searchItemsPerPage;
                                      const currentSearchResults = filteredLocations.slice(searchStartIndex, searchEndIndex);
                                      
                                      return currentSearchResults.map((location) => {
                                        const searchMatches = getSearchMatches(location, searchTerm);
                                        return (
                                        <div
                                          key={location.id}
                                          onClick={() => handleMarkerClick(location)}
                                          className="border border-black lg:p-3 p-2 cursor-pointer hover:bg-hip-amarelo-claro transition-colors"
                                        >
                                          <div className="flex items-start justify-between lg:mb-2 mb-1">
                                            <h4 className="font-dirty-stains lg:text-sm text-xs text-black font-bold">
                                              {location.name}
                                            </h4>
                                            <div className="flex gap-1">
                                              {/* Source type indicators */}
                                              {location.sourceType === 'df_locality' && (
                                                <span className="bg-purple-500 text-white px-1 py-0.5 text-xs font-sometype-mono">
                                                  {location.locality_type === 1 ? 'RA' : 'LOC'}
                                                </span>
                                              )}
                                              
                                              {/* Coordinate type indicators for Hip Hop locations */}
                                              {!location.sourceType && location.coordinateType === 'extracted_from_notes' && (
                                                <span className="text-black px-1 py-0.5 text-xs font-sometype-mono">GPS</span>
                                              )}
                                              {!location.sourceType && location.coordinateType === 'estimated_from_places' && (
                                                <span className="bg-blue-500 text-white px-1 py-0.5 text-xs font-sometype-mono">EST</span>
                                              )}
                                              {!location.sourceType && location.coordinateType === 'default_brasilia' && (
                                                <span className="bg-gray-500 text-white px-1 py-0.5 text-xs font-sometype-mono">DEF</span>
                                              )}
                                              {location.sourceType === 'df_locality' && (
                                                <span className="bg-indigo-500 text-white px-1 py-0.5 text-xs font-sometype-mono">GOV</span>
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
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedLocation(location);
                                                setIsDetailModalOpen(true);
                                              }}
                                              className="font-sometype-mono text-xs text-black underline hover:no-underline"
                                            >
                                              Explorar Local →
                                            </button>
                                          </div>
                                        </div>
                                        );
                                      });
                                    })()}
                                  </div>
                                  
                                  {/* Paginação da busca */}
                                  {(() => {
                                    const searchTotalPages = Math.ceil(filteredLocations.length / searchItemsPerPage);
                                    const searchStartIndex = (searchCurrentPage - 1) * searchItemsPerPage;
                                    const searchEndIndex = Math.min(searchStartIndex + searchItemsPerPage, filteredLocations.length);
                                    
                                    if (filteredLocations.length > 0) {
                                      return (
                                        <div className="mt-4 space-y-3">
                                          {/* Informação sobre resultados */}
                                          <p className="text-center font-sometype-mono text-xs text-black/70">
                                            Mostrando {searchStartIndex + 1}-{searchEndIndex} de {filteredLocations.length} resultados
                                          </p>
                                          
                                          {/* Controles de paginação */}
                                          {searchTotalPages > 1 && (
                                            <div className="flex justify-center items-center gap-2">
                                              <button
                                                onClick={() => searchCurrentPage > 1 && setSearchCurrentPage(searchCurrentPage - 1)}
                                                disabled={searchCurrentPage === 1}
                                                className={`px-2 py-1 text-xs font-sometype-mono border border-black ${
                                                  searchCurrentPage === 1 
                                                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                                                    : 'bg-white hover:bg-gray-100 cursor-pointer'
                                                }`}
                                              >
                                                ← Anterior
                                              </button>
                                              
                                              <span className="px-2 py-1 text-xs font-sometype-mono text-white border border-black">
                                                {searchCurrentPage} de {searchTotalPages}
                                              </span>
                                              
                                              <button
                                                onClick={() => searchCurrentPage < searchTotalPages && setSearchCurrentPage(searchCurrentPage + 1)}
                                                disabled={searchCurrentPage === searchTotalPages}
                                                className={`px-2 py-1 text-xs font-sometype-mono border border-black ${
                                                  searchCurrentPage === searchTotalPages 
                                                    ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                                                    : 'bg-white hover:bg-gray-100 cursor-pointer'
                                                }`}
                                              >
                                                Próximo →
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>

                                {/* Estatísticas */}
                                <div className="border-t border-black pt-4">
                                  <h3 className="font-sometype-mono text-lg font-bold text-black mb-3">
                                    ESTATÍSTICAS
                                  </h3>
                                  <div className="space-y-1 text-xs font-sometype-mono text-black">
                                    <div className="flex justify-between">
                                      <span>Locais Hip Hop:</span>
                                      <span className="font-bold text-yellow-600">{locations.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Localidades DF:</span>
                                      <span className="font-bold text-purple-600">{dfLocalities.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Total geral:</span>
                                      <span className="font-bold">{allSearchableLocations.length}</span>
                                    </div>
                                    <div className="border-t border-gray-300 pt-2 mt-2">
                                      <div className="flex justify-between">
                                        <span>RAs do DF:</span>
                                        <span className="font-bold text-red-600">
                                          {dfLocalities.filter(l => l.locality_type === 1).length}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Localidades DF:</span>
                                        <span className="font-bold text-blue-600">
                                          {dfLocalities.filter(l => l.locality_type === 2).length}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Tour Ativo - quando há tour selecionado */}
                            {selectedTour && (
                              <div className="flex-1 overflow-y-auto lg:p-4 p-2">
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
                            <div className="border-t-2 border-black lg:p-4 p-2">
                              <h3 className="font-sometype-mono lg:text-md text-sm font-bold text-black lg:mb-3 mb-2">
                                TOURS DISPONÍVEIS
                              </h3>
                              <div className="lg:space-y-2 space-y-1">
                                {(storiesMapboxFormat || []).slice(0, 3).map((story, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleTourSelect(story)}
                                    className={`w-full lg:p-2 p-1 border border-black text-left font-sometype-mono lg:text-sm text-xs transition-colors ${
                                      selectedTour?.title === story.title
                                        ? 'bg-black text-white'
                                        : 'bg-white hover:bg-gray-100'
                                    }`}
                                  >
                                    {story.title}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Mapa ocupando o restante da tela - superior em mobile, direita em desktop */}
                          <div className="flex-1 relative lg:order-2 order-1 lg:h-full md:h-2/3 h-3/5">
                          <div id="map-overlay" className={`${isDetailModalOpen && isFullscreen ? 'active' : ''}`}>
                            {isDetailModalOpen && isFullscreen && (
                              <div 
                                className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center lg:p-4 p-2 z-[10001]" 
                                onClick={() => setIsDetailModalOpen(false)}
                                style={{ 
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 10001,
                                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <LocationDetailModal
                                  location={selectedLocation}
                                  onClose={() => setIsDetailModalOpen(false)}
                                />
                              </div>
                            )}
                          </div>
                          <MapRenderer
                            ref={mapRef}
                            {...viewState}
                            onMarkerClick={handleMarkerClick}
                            onHover={handleMarkerHover}
                            dragPan={true}
                            interactive={true}
                            onLoad={(evt) => {
                              console.log('Mapa carregado em modo fullscreen.');
                            }}
                            onMove={evt => {
                              // Atualizar viewState no modo fullscreen para permitir interação
                              setViewState(evt.viewState);
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              cursor: 'grab'
                            }}
                            mapStyle="https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
                            attributionControl={false}
                            dragRotate={false} // Desabilitar rotação por drag para evitar rotação acidental
                            scrollZoom={true}
                          >

                            {/* Popup para hover no modo fullscreen */}
                            {hoveredLocation && showHoverPopup && !selectedLocation && !selectedTour && hoveredCoordinates && (
                              <Popup
                                longitude={hoveredCoordinates.lng}
                                latitude={hoveredCoordinates.lat}
                                anchor="bottom"
                                closeButton={false}
                                className="hover-popup"
                                closeOnClick={false}
                                closeOnMove={false}
                              >
                                <div className="popup-folha-pauta px-6 py-3">
                                  <p className="font-scratchy text-3xl mb-1 text-black">{hoveredLocation.name}</p>
                                  <p className="font-sometype-mono text-xs mb-2 line-clamp-2 text-black">{hoveredLocation.description}</p>
                                  <div className="flex items-center gap-1">
                                    {hoveredLocation.sourceType === 'df_locality' ? (
                                      <>
                                        <span className="bg-purple-500 text-white px-2 py-1 text-xl font-scratchy border border-black">
                                          {hoveredLocation.locality_type_name}
                                        </span>
                                        <span className="bg-indigo-500 text-white px-2 py-1 text-xl font-scratchy border border-black">GOV</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="text-black px-2 py-1 text-xl font-scratchy border border-black">
                                          {hoveredLocation.itemCount} item{hoveredLocation.itemCount !== 1 ? 's' : ''}
                                        </span>
                                        {hoveredLocation.coordinateType === 'extracted_from_notes' && (
                                          <span className="bg-green-500 text-black px-1 py-1 text-xl font-scratchy border border-black">GPS</span>
                                        )}
                                        {hoveredLocation.coordinateType === 'estimated_from_places' && (
                                          <span className="bg-blue-500 text-white px-1 py-1 text-xl font-scratchy border border-black">EST</span>
                                        )}
                                        {hoveredLocation.coordinateType === 'default_brasilia' && (
                                          <span className="bg-gray-500 text-white px-1 py-1 text-xl font-scratchy border border-black">DEF</span>
                                        )}
                                        {hoveredLocation.coordinateType === 'government_source' && (
                                          <span className="bg-indigo-500 text-white px-1 py-1 text-xl font-scratchy border border-black">GOV</span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </Popup>
                            )}

                            {/* Popup para click (ativo/persistente) no modo fullscreen */}
                            {selectedLocation && !selectedTour && selectedLocation.coordinates && (
                              <Popup
                                longitude={selectedLocation.coordinates.lng}
                                latitude={selectedLocation.coordinates.lat}
                                anchor="bottom"
                                closeButton={true}
                                className="active-popup"
                                closeOnClick={false}
                                closeOnMove={false}
                                onClose={() => {
                                  setSelectedLocation(null);
                                  setShowHoverPopup(false);
                                }}
                              >
                                <div className="popup-folha-pauta px-6 py-4">
                                  <h3 className="font-scratchy text-2xl mb-2 text-black font-bold">{selectedLocation.name || selectedLocation.title || 'Local'}</h3>
                                  <p className="font-sometype-mono text-sm mb-3 text-black leading-relaxed">{selectedLocation.description || selectedLocation.scope_and_content || 'Sem descrição disponível'}</p>
                                  
                                  {/* Informações específicas para localidades DF */}
                                  {selectedLocation.sourceType === 'df_locality' ? (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-purple-500 text-white px-2 py-1 text-lg font-scratchy border border-black">
                                          {selectedLocation.locality_type_name}
                                        </span>
                                        <span className="bg-indigo-500 text-white px-2 py-1 text-lg font-scratchy border border-black">
                                          Governo DF
                                        </span>
                                      </div>
                                      <p className="font-sometype-mono text-xs text-black/80">
                                        Fonte: IDE - Infraestrutura de Dados Espaciais do DF
                                      </p>
                                    </div>
                                  ) : (
                                    /* Informações para locais Hip Hop */
                                    <div className="mb-3">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-yellow-500 text-black px-2 py-1 text-lg font-scratchy border border-black">
                                          {selectedLocation.itemCount || 1} item{(selectedLocation.itemCount || 1) !== 1 ? 's' : ''}
                                        </span>
                                        {selectedLocation.coordinateType === 'extracted_from_notes' && (
                                          <span className="bg-green-500 text-black px-2 py-1 text-lg font-scratchy border border-black">GPS</span>
                                        )}
                                        {selectedLocation.coordinateType === 'estimated_from_places' && (
                                          <span className="bg-blue-500 text-white px-2 py-1 text-lg font-scratchy border border-black">Estimado</span>
                                        )}
                                        {selectedLocation.coordinateType === 'default_brasilia' && (
                                          <span className="bg-gray-500 text-white px-2 py-1 text-lg font-scratchy border border-black">Padrão</span>
                                        )}
                                      </div>
                                      
                                      {/* Pontos de acesso, se existirem */}
                                      {selectedLocation.place_access_points && Array.isArray(selectedLocation.place_access_points) && selectedLocation.place_access_points.length > 0 && (
                                        <div className="mb-2">
                                          <p className="font-sometype-mono text-xs text-black/80 mb-1">Pontos de acesso:</p>
                                          <p className="font-sometype-mono text-xs text-blue-700">
                                            {selectedLocation.place_access_points.join(', ')}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Botão para explorar (apenas para locais Hip Hop) */}
                                  {!selectedLocation.sourceType && (
                                    <button 
                                      className="w-full bg-black text-white px-4 py-2 font-scratchy text-lg border-2 border-black hover:bg-gray-800 transition-colors"
                                      onClick={() => {
                                        setIsDetailModalOpen(true);
                                      }}
                                    >
                                      Explorar Local →
                                    </button>
                                  )}
                                </div>
                              </Popup>
                            )}
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

                          {/* GUI-NOTE: Layer control component */}
                          <LayerControl isVisible={isFullscreen && !selectedTour} />

                          {/* GUI-NOTE: Mapbox Storytelling Overlay */}
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
                            onMarkerClick={handleMarkerClick}
                            onHover={handleMarkerHover}
                            onLoad={(evt) => {
                              console.log('Mapa carregado em modo normal.');
                            }}
                            onMove={evt => {
                              // Não atualizar viewState no modo normal para manter o mapa estático
                              // setViewState(evt.viewState);
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              cursor: 'default'
                            }}
                            mapStyle="https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
                            attributionControl={false}
                            // Mapa completamente não-interativo na página principal
                            dragPan={false}
                            dragRotate={false}
                            scrollZoom={false}
                            boxZoom={false}
                            doubleClickZoom={false}
                            touchZoom={false}
                            touchRotate={false}
                            keyboard={false}
                            cooperativeGestures={false}
                            pitchWithRotate={false}
                            interactive={false}
                          >

                            {/* Popup para hover */}
                            {hoveredLocation && showHoverPopup && !selectedLocation && !selectedTour && hoveredCoordinates && (
                              <Popup
                                longitude={hoveredCoordinates.lng}
                                latitude={hoveredCoordinates.lat}
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
                                      <span className="text-black px-1 py-1 text-xl font-scratchy border border-black">GPS</span>
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
                            {selectedLocation && !selectedTour && selectedLocation.coordinates && (
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
                                      <span className="bg-green-500 text-black px-2 py-1 border border-black text-xl font-scratchy">
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
                className={`pb-8 ${currentTheme === 'light' ? 'fundo-base' : 'fundo-base-preto'}`}
                id="regions-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                
                  <div className="pb-6 w-full">
                    <h3 className="px-6 py-6 text-2xl sm:text-3xl md:text-4xl font-sometype-mono text-black mb-4 text-left bg-hip-amarelo-escuro">REGIÕES MAPEADAS</h3>
                    <p className="px-6 font-sometype-mono text-lg text-black text-left">
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                      {currentLocations.map((location, index) => (
                        <motion.div
                          key={location.id}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          onClick={() => handleMarkerClick(location)}
                          className={`border-2 border-theme p-6 bg-theme-background cursor-pointer transition-all duration-300`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-6 h-6 bg-[#fae523] border-2 border-theme rounded-full flex items-center justify-center">
                              {location.isRandomPoint ? (
                                // GUI-NOTE: Show custom icon for random points in location list
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
                                <span className="bg-green-100 text-black px-2 py-1 rounded-full text-xs font-sometype-mono border border-green-300">
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

                          {(() => {
                            // Calcular quais páginas mostrar (máximo 5)
                            const maxVisiblePages = 5;
                            const startPage = Math.max(1, Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1));
                            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                            const items = [];
                            
                            // Mostrar primeira página + ... se necessário
                            if (startPage > 1) {
                              items.push(
                                <PaginationItem key={1}>
                                  <PaginationLink
                                    onClick={() => goToPage(1)}
                                    className="cursor-pointer border-2 border-theme font-dirty-stains bg-white hover:bg-gray-100 transition-colors"
                                  >
                                    1
                                  </PaginationLink>
                                </PaginationItem>
                              );
                              
                              if (startPage > 2) {
                                items.push(
                                  <PaginationItem key="ellipsis-start">
                                    <span className="px-3 py-2 font-dirty-stains text-theme">...</span>
                                  </PaginationItem>
                                );
                              }
                            }
                            
                            // Mostrar páginas do range calculado
                            for (let i = startPage; i <= endPage; i++) {
                              items.push(
                                <PaginationItem key={i}>
                                  <PaginationLink
                                    onClick={() => goToPage(i)}
                                    isActive={i === currentPage}
                                    className={`cursor-pointer border-2 border-theme font-dirty-stains ${i === currentPage
                                        ? 'bg-blue-500 text-theme hover:bg-blue-600'
                                        : 'bg-white hover:bg-gray-100 transition-colors'
                                      }`}
                                  >
                                    {i}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            
                            // Mostrar ... + última página se necessário
                            if (endPage < totalPages) {
                              if (endPage < totalPages - 1) {
                                items.push(
                                  <PaginationItem key="ellipsis-end">
                                    <span className="px-3 py-2 font-dirty-stains text-theme">...</span>
                                  </PaginationItem>
                                );
                              }
                              
                              items.push(
                                <PaginationItem key={totalPages}>
                                  <PaginationLink
                                    onClick={() => goToPage(totalPages)}
                                    className="cursor-pointer border-2 border-theme font-dirty-stains bg-white hover:bg-gray-100 transition-colors"
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            }
                            
                            return items;
                          })()}

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
               
              </motion.section>

              <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden border-t-3 border-theme p-8">


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
                <div className="relative z-20 text-center mx-auto px-6">
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
                        {selectedLocation.place_access_points && Array.isArray(selectedLocation.place_access_points) && selectedLocation.place_access_points.length > 0 && (
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

// GUI-NOTE: Main component wrapped with MapProvider
const Mapa = () => {
  return (
    <MapProvider>
      <MapaContent />
    </MapProvider>
  );
};

export default Mapa;
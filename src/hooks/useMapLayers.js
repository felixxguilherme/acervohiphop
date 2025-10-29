'use client';

import { useCallback } from 'react';
import { useMap } from '@/contexts/MapContext';

// GUI-NOTE: Custom hook for advanced layer management operations
export const useMapLayers = () => {
  const mapContext = useMap();

  // GUI-NOTE: Initialize layers with default Hip Hop map layers
  const initializeDefaultLayers = () => {
    // Only initialize if not already initialized to prevent duplicate calls
    if (mapContext.isInitialized) {
      console.log('[MapLayers] Already initialized, skipping initialization');
      return;
    }
    
    // Clear any existing layers first to prevent duplicates
    if (mapContext.layers.length > 0) {
      console.log('[MapLayers] Clearing existing layers before initialization');
      mapContext.layers.forEach(layer => {
        mapContext.removeLayer(layer.id);
      });
    }
    
    console.log('[MapLayers] Starting layer initialization...');
    
    const defaultLayers = [
      {
        id: 'regioes-administrativas-df',
        name: 'Regiões Administrativas',
        type: 'line',
        visible: true,
        source: {
          type: 'geojson',
          data: 'https://www.geoservicos.ide.df.gov.br/arcgis/rest/services/Publico/LIMITES/MapServer/1/query?where=1%3D1&outFields=*&outSR=4326&f=geojson&returnGeometry=true'
        },
        layout: {
          'visibility': 'visible'  // Explicitamente definir como visível
        },
        paint: {
          'line-color': '#e74c3c',  // Vermelho forte para limites das RAs
          'line-width': 4,          // Linha grossa
          'line-opacity': 1.0       // Opacidade máxima para maior visibilidade
        }
      },
      {
        id: 'ra-selected-highlight',
        name: 'RA Selecionada',
        type: 'fill',
        visible: false,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'fill-color': '#fae523',
          'fill-opacity': 0.2
        },
        layout: {}
      },
      {
        id: 'ra-selected-outline',
        name: 'Contorno RA Selecionada',
        type: 'line',
        visible: false,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'line-color': '#000000',
          'line-width': 3,
          'line-opacity': 1
        },
        layout: {}
      },
      {
        id: 'localidades-df',
        name: 'Localidades do DF',
        type: 'circle',
        visible: true,
        source: {
          type: 'geojson',
          data: 'https://www.geoservicos.ide.df.gov.br/arcgis/rest/services/Publico/LOCALIDADES/MapServer/0/query?where=1%3D1&outFields=objectid,nome,tipo&outSR=4326&f=geojson&returnGeometry=true'
        },
        paint: {
          'circle-radius': [
            'case',
            ['==', ['get', 'tipo'], 1], 8,  // RAs maiores
            ['==', ['get', 'tipo'], 2], 5,  // Localidades menores
            4  // Default para NÃO INFORMADO
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'tipo'], 1], '#e74c3c',  // RAs em vermelho
            ['==', ['get', 'tipo'], 2], '#3498db',  // Localidades em azul
            '#95a5a6'  // Default cinza para NÃO INFORMADO
          ],
          'circle-stroke-color': '#2c3e50',
          'circle-stroke-width': 1,
          'circle-opacity': 0.8,
          'circle-stroke-opacity': 0.9
        }
      },
      {
        id: 'hip-hop-locations',
        name: 'Locais do Hip Hop',
        type: 'circle',
        visible: true,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#fae523',
          'circle-stroke-color': '#000',
          'circle-stroke-width': 2
        }
      },
      {
        id: 'hip-hop-routes',
        name: 'Rotas do Hip Hop',
        type: 'line',
        visible: false,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'line-color': '#f8e71c',
          'line-width': 3,
          'line-opacity': 0.8
        }
      },
      {
        id: 'hip-hop-areas',
        name: 'Áreas de Influência',
        type: 'fill',
        visible: false,
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        },
        paint: {
          'fill-color': '#fae523',
          'fill-opacity': 0.3,
          'fill-outline-color': '#000'
        }
      }
    ];

    mapContext.loadLayers(defaultLayers);
    console.log('[MapLayers] Default layers loaded:', defaultLayers.length);
    console.log('[MapLayers] RA layer configuration:', defaultLayers.find(l => l.id === 'regioes-administrativas-df'));
    
    // Force RA layer to be visible after a short delay to ensure it's rendered
    setTimeout(() => {
      console.log('[MapLayers] Ensuring RA layer is visible...');
      const raLayer = mapContext.getLayerById('regioes-administrativas-df');
      if (raLayer && raLayer.visible !== true) {
        mapContext.updateLayerProperty('regioes-administrativas-df', 'visible', true);
        console.log('[MapLayers] RA layer visibility forced to true');
      }
    }, 1500);
  };

  // AIDEV-NOTE: Update layer data from API or external source
  const updateLayerData = useCallback(async (layerId, newData) => {
    const layer = mapContext.getLayerById(layerId);
    if (!layer) return;

    // Update the source data
    const updatedSource = {
      ...layer.source,
      data: newData
    };

    mapContext.updateLayerProperty(layerId, 'source', updatedSource);
  }, [mapContext]);

  // AIDEV-NOTE: Toggle multiple layers at once
  const toggleMultipleLayers = useCallback((layerIds, visible) => {
    layerIds.forEach(layerId => {
      if (visible !== undefined) {
        mapContext.updateLayerProperty(layerId, 'visible', visible);
      } else {
        mapContext.toggleLayerVisibility(layerId);
      }
    });
  }, [mapContext]);

  // AIDEV-NOTE: Update layer style properties (paint or layout)
  const updateLayerStyle = useCallback((layerId, styleType, properties) => {
    const layer = mapContext.getLayerById(layerId);
    if (!layer) return;

    const currentStyle = layer[styleType] || {};
    const updatedStyle = { ...currentStyle, ...properties };
    
    mapContext.updateLayerProperty(layerId, styleType, updatedStyle);
  }, [mapContext]);

  // AIDEV-NOTE: Create a new layer with Hip Hop styling defaults
  const createHipHopLayer = useCallback((config) => {
    const defaultConfig = {
      visible: true,
      paint: {
        // Default Hip Hop theme colors
        ...(config.type === 'circle' && {
          'circle-radius': 8,
          'circle-color': '#fae523',
          'circle-stroke-color': '#000',
          'circle-stroke-width': 2
        }),
        ...(config.type === 'line' && {
          'line-color': '#f8e71c',
          'line-width': 3,
          'line-opacity': 0.8
        }),
        ...(config.type === 'fill' && {
          'fill-color': '#fae523',
          'fill-opacity': 0.3,
          'fill-outline-color': '#000'
        })
      }
    };

    const layer = {
      ...defaultConfig,
      ...config,
      paint: {
        ...defaultConfig.paint,
        ...config.paint
      }
    };

    mapContext.addLayer(layer);
    return layer;
  }, [mapContext]);

  // AIDEV-NOTE: Filter layers by type or visibility
  const filterLayers = useCallback((filterFn) => {
    return mapContext.layers.filter(filterFn);
  }, [mapContext.layers]);

  // AIDEV-NOTE: Get layers by type
  const getLayersByType = useCallback((type) => {
    return filterLayers(layer => layer.type === type);
  }, [filterLayers]);

  // AIDEV-NOTE: Bulk update multiple layers
  const bulkUpdateLayers = useCallback((updates) => {
    updates.forEach(({ layerId, property, value }) => {
      mapContext.updateLayerProperty(layerId, property, value);
    });
  }, [mapContext]);

  // AIDEV-NOTE: Reset all layers to default state
  const resetAllLayers = useCallback(() => {
    initializeDefaultLayers();
  }, [initializeDefaultLayers]);

  return {
    // Original context methods
    ...mapContext,
    
    // Extended functionality
    initializeDefaultLayers,
    updateLayerData,
    toggleMultipleLayers,
    updateLayerStyle,
    createHipHopLayer,
    filterLayers,
    getLayersByType,
    bulkUpdateLayers,
    resetAllLayers
  };
};

export default useMapLayers;
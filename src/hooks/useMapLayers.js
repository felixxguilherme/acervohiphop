'use client';

import { useCallback } from 'react';
import { useMap } from '@/contexts/MapContext';

// AIDEV-NOTE: Custom hook for advanced layer management operations
export const useMapLayers = () => {
  const mapContext = useMap();

  // AIDEV-NOTE: Initialize layers with default Hip Hop map layers
  const initializeDefaultLayers = useCallback(() => {
    const defaultLayers = [
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
  }, [mapContext]);

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
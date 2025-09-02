'use client';

import { useRef, useEffect, forwardRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { useMap } from '@/contexts/MapContext';

// AIDEV-NOTE: Component that automatically renders map layers from context
const MapRenderer = forwardRef(({ 
  children, 
  onMove,
  style,
  mapStyle,
  attributionControl = false,
  transitionDuration = 300,
  ...mapProps 
}, ref) => {
  const { layers, getVisibleLayers } = useMap();
  const internalMapRef = useRef(null);
  const mapRef = ref || internalMapRef;

  // AIDEV-NOTE: Effect to handle layer updates when layers state changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    
    // Wait for map to be loaded before manipulating layers
    if (!map.loaded()) {
      map.on('load', () => {
        updateMapLayers(map);
      });
    } else {
      updateMapLayers(map);
    }
  }, [layers]);

  // AIDEV-NOTE: Function to update map layers based on context state
  const updateMapLayers = (map) => {
    const visibleLayers = getVisibleLayers();
    
    // Remove existing layers and sources that are no longer visible
    const existingLayers = map.getStyle().layers || [];
    existingLayers.forEach(layer => {
      if (layer.id.startsWith('custom-layer-')) {
        const layerId = layer.id.replace('custom-layer-', '');
        const stillVisible = visibleLayers.some(l => l.id === layerId);
        
        if (!stillVisible) {
          map.removeLayer(layer.id);
          if (map.getSource(`custom-source-${layerId}`)) {
            map.removeSource(`custom-source-${layerId}`);
          }
        }
      }
    });

    // Add or update visible layers
    visibleLayers.forEach((layer, index) => {
      const layerId = `custom-layer-${layer.id}`;
      const sourceId = `custom-source-${layer.id}`;

      // Remove existing layer if it exists to update it
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // Add source
      if (layer.source) {
        map.addSource(sourceId, layer.source);
      }

      // Add layer with proper ordering (higher index = on top)
      const layerConfig = {
        id: layerId,
        source: sourceId,
        type: layer.type || 'fill',
        ...layer.layout && { layout: layer.layout },
        ...layer.paint && { paint: layer.paint }
      };

      // Find the correct position to insert the layer
      const beforeLayer = findBeforeLayer(map, index, visibleLayers);
      if (beforeLayer) {
        map.addLayer(layerConfig, beforeLayer);
      } else {
        map.addLayer(layerConfig);
      }
    });
  };

  // AIDEV-NOTE: Helper to find the correct layer to insert before
  const findBeforeLayer = (map, currentIndex, visibleLayers) => {
    // Look for the next layer in the list that already exists on the map
    for (let i = currentIndex + 1; i < visibleLayers.length; i++) {
      const nextLayerId = `custom-layer-${visibleLayers[i].id}`;
      if (map.getLayer(nextLayerId)) {
        return nextLayerId;
      }
    }
    return null;
  };

  return (
    <Map
      ref={mapRef}
      onMove={onMove}
      style={style}
      mapStyle={mapStyle}
      attributionControl={attributionControl}
      transitionDuration={transitionDuration}
      {...mapProps}
    >
      {/* AIDEV-NOTE: Render any additional children (markers, popups, etc.) */}
      {children}
    </Map>
  );
});

MapRenderer.displayName = 'MapRenderer';

export default MapRenderer;
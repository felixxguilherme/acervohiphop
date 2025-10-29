'use client';

import { useRef, useEffect, forwardRef, useMemo } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { useMap } from '@/contexts/MapContext';

// GUI-NOTE: Component that automatically renders map layers from context
const MapRenderer = forwardRef(({ 
  children, 
  onMove,
  style,
  mapStyle = "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z",
  attributionControl = false,
  transitionDuration = 300,
  ...mapProps 
}, ref) => {
  const { layers, getVisibleLayers } = useMap();
  const internalMapRef = useRef(null);
  const mapRef = ref || internalMapRef;
  const lastLayersStateRef = useRef(null);

  // Memoize visible layers to avoid unnecessary recalculations
  const visibleLayers = useMemo(() => {
    return layers.filter(layer => layer.visible !== false);
  }, [layers]);

  // Create a stable hash of layer state to avoid unnecessary re-renders
  const layersHash = useMemo(() => {
    return JSON.stringify(visibleLayers.map(layer => ({
      id: layer.id,
      visible: layer.visible,
      type: layer.type,
      source: typeof layer.source === 'object' ? JSON.stringify(layer.source) : layer.source,
      paint: layer.paint,
      layout: layer.layout
    })));
  }, [visibleLayers]);

  // GUI-NOTE: Effect to handle layer updates when layers state changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Only update if layers hash actually changed
    if (lastLayersStateRef.current === layersHash) {
      return;
    }

    const map = mapRef.current.getMap();
    
    // Function to handle layer updates with delay for external sources
    const handleLayerUpdate = () => {
      console.log('[MapRenderer] Map loaded, updating layers...');
      updateMapLayers(map);
      lastLayersStateRef.current = layersHash;
      
      // Listen for source data events to refresh layers when external data loads
      const handleSourceData = (e) => {
        if (e.sourceId && e.sourceId.includes('regioes-administrativas-df') && e.isSourceLoaded) {
          console.log('[MapRenderer] RA source data loaded, refreshing layer...');
          // Force layer visibility refresh
          const raLayerId = 'custom-layer-regioes-administrativas-df';
          if (map.getLayer(raLayerId)) {
            map.setLayoutProperty(raLayerId, 'visibility', 'visible');
          }
          // Remove the listener after first use to prevent multiple calls
          map.off('sourcedata', handleSourceData);
        }
      };
      map.on('sourcedata', handleSourceData);
      
      // Force a refresh after a short delay to ensure external sources are loaded
      setTimeout(() => {
        console.log('[MapRenderer] Force refresh after delay...');
        // Only refresh visibility properties, don't recreate layers
        visibleLayers.forEach(layer => {
          const layerId = `custom-layer-${layer.id}`;
          if (map.getLayer(layerId)) {
            const shouldBeVisible = layer.visible !== false ? 'visible' : 'none';
            map.setLayoutProperty(layerId, 'visibility', shouldBeVisible);
          }
        });
      }, 1000);
    };
    
    // Wait for map to be loaded before manipulating layers
    if (!map.loaded()) {
      console.log('[MapRenderer] Map not loaded yet, waiting...');
      map.on('load', handleLayerUpdate);
    } else {
      console.log('[MapRenderer] Map already loaded, updating immediately...');
      handleLayerUpdate();
    }
  }, [layersHash]);

  // GUI-NOTE: Function to update map layers based on context state
  const updateMapLayers = (map) => {
    console.log('[MapRenderer] Updating map layers. Layers count:', layers.length);

    // Add or update visible layers
    visibleLayers.forEach((layer, index) => {
      const layerId = `custom-layer-${layer.id}`;
      const sourceId = `custom-source-${layer.id}`;

      console.log(`[MapRenderer] Processing layer: ${layer.id}, visible: ${layer.visible}`);
      
      // Special logging for RA layer
      if (layer.id === 'regioes-administrativas-df') {
        console.log('[MapRenderer] *** RA LAYER PROCESSING ***', {
          id: layer.id,
          visible: layer.visible,
          type: layer.type,
          hasSource: !!layer.source
        });
      }

      // Remove existing layer if it exists to update it
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // Add source with error handling
      if (layer.source) {
        try {
          console.log(`[MapRenderer] Adding source for ${layer.id}:`, layer.source);
          map.addSource(sourceId, layer.source);
        } catch (error) {
          console.error(`[MapRenderer] Error adding source for ${layer.id}:`, error);
          return;
        }
      }

      // Add layer with proper ordering (higher index = on top)
      const layerConfig = {
        id: layerId,
        source: sourceId,
        type: layer.type || 'fill',
        ...layer.layout && { layout: layer.layout },
        ...layer.paint && { paint: layer.paint }
      };

      // Set initial visibility based on layer.visible property
      if (!layerConfig.layout) {
        layerConfig.layout = {};
      }
      layerConfig.layout.visibility = layer.visible !== false ? 'visible' : 'none';
      
      console.log(`[MapRenderer] Setting layer ${layer.id} visibility to:`, layerConfig.layout.visibility);

      try {
        // Find the correct position to insert the layer
        const beforeLayer = findBeforeLayer(map, index, visibleLayers);
        if (beforeLayer) {
          map.addLayer(layerConfig, beforeLayer);
        } else {
          map.addLayer(layerConfig);
        }
        console.log(`[MapRenderer] Successfully added layer: ${layer.id}`);
      } catch (error) {
        console.error(`[MapRenderer] Error adding layer ${layer.id}:`, error);
      }
    });
  };

  // GUI-NOTE: Helper to find the correct layer to insert before
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

  // Garantir que temos todas as props necessárias
  const safeMapProps = {
    ...mapProps,
    mapStyle: mapStyle || "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
  };

  return (
    <Map
      ref={mapRef}
      onMove={onMove}
      style={style}
      mapStyle={safeMapProps.mapStyle}
      attributionControl={attributionControl}
      transitionDuration={transitionDuration}
      {...safeMapProps}
    >
      {/* GUI-NOTE: Render any additional children (markers, popups, etc.) */}
      {children}
    </Map>
  );
});

MapRenderer.displayName = 'MapRenderer';

export default MapRenderer;
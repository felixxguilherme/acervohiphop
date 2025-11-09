'use client';

import { useRef, useEffect, forwardRef, useMemo, useCallback } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import { useMap } from '@/contexts/MapContext';
import { useMapLayers } from '@/hooks/useMapLayers';

// GUI-NOTE: Component that automatically renders map layers from context
const MapRenderer = forwardRef(({ 
  children, 
  onMove,
  onMarkerClick,
  onHover,
  style,
  mapStyle = "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z",
  attributionControl = false,
  transitionDuration = 300,
  ...mapProps 
}, ref) => {
  const { layers, isInitialized, initializeLayers } = useMap();
  const internalMapRef = useRef(null);
  const mapRef = ref || internalMapRef;
  const lastLayersStateRef = useRef(null);
  const mapLoadedRef = useRef(false);

  // Memoize visible layers to avoid unnecessary recalculations
  const visibleLayers = useMemo(() => {
    const visible = layers.filter(layer => layer.visible !== false);
    console.log('[MapRenderer] 📊 Layers no contexto:', layers.length, '| Visíveis:', visible.length);
    visible.forEach(layer => {
      console.log(`[MapRenderer] 👁️ Layer visível: ${layer.id} (${layer.name})`);
    });
    return visible;
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

  // GUI-NOTE: Function to automatically load images for layers
  const loadLayerImages = useCallback(async (map, layers) => {
    const imagesToLoad = new Set();
    
    // Extract all icon-image references from layers
    layers.forEach(layer => {
      if (layer.layout && layer.layout['icon-image']) {
        imagesToLoad.add(layer.layout['icon-image']);
      }
    });
    
    // Load each image
    for (const imageName of imagesToLoad) {
      if (!map.hasImage(imageName)) {
        try {
          console.log(`[MapRenderer] 🖼️ Loading image: ${imageName}`);
          const response = await fetch(`/mapa/${imageName}.png`);
          if (response.ok) {
            const imageBlob = await response.blob();
            const imageBitmap = await createImageBitmap(imageBlob);
            map.addImage(imageName, imageBitmap);
            console.log(`[MapRenderer] ✅ Image loaded: ${imageName}`);
          } else {
            console.warn(`[MapRenderer] ⚠️ Image not found: /mapa/${imageName}.png`);
          }
        } catch (error) {
          console.warn(`[MapRenderer] ❌ Error loading image ${imageName}:`, error);
        }
      }
    }
  }, []);

  // GUI-NOTE: Function to create fallback circle icon
  const createFallbackIcon = useCallback(() => {
    const canvas = document.createElement('canvas');
    const size = 32;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Círculo preto com borda branca
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Centro branco
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 6, 0, 2 * Math.PI);
    ctx.fill();

    return canvas;
  }, []);

  // GUI-NOTE: Effect to initialize map and then load default layers
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current.getMap();
    
    const handleMapLoad = async () => {
      console.log('[MapRenderer] 🗺️ Map loaded, setting mapLoadedRef = true');
      mapLoadedRef.current = true;
      
      // Load custom images before initializing layers
      await loadLayerImages(map, layers);
      
      // Add fallback circle icon
      if (!map.hasImage('circle-fallback')) {
        const fallbackCanvas = createFallbackIcon();
        map.addImage('circle-fallback', fallbackCanvas);
        console.log('[MapRenderer] ✅ Fallback circle icon created');
      }
      
      console.log('[MapRenderer] 🔍 Status after load:', {
        mapLoadedRef: mapLoadedRef.current,
        isInitialized,
        layersInContext: layers.length
      });
      
      // Initialize default layers from context if not already initialized
      if (!isInitialized) {
        console.log('[MapRenderer] 🎯 Calling initializeLayers...');
        initializeLayers();
      } else {
        console.log('[MapRenderer] ✅ Layers already initialized, syncing with map...');
        // Sync existing layers with map
        syncLayersWithMap(map);
      }
    };

    if (!map.loaded()) {
      console.log('[MapRenderer] ⏳ Waiting for map to load...');
      map.once('load', handleMapLoad);
    } else {
      console.log('[MapRenderer] ⚡ Map already loaded, proceeding...');
      handleMapLoad();
    }
  }, [isInitialized, initializeLayers, layers, loadLayerImages]);

  // GUI-NOTE: Effect to handle layer updates when layers state changes (only after initialization)
  useEffect(() => {
    if (!mapRef.current || !mapLoadedRef.current || !isInitialized) {
      console.log('[MapRenderer] ⏸️ Skipping layer update - Reasons:', {
        hasMapRef: !!mapRef.current,
        mapLoaded: mapLoadedRef.current,
        isInitialized: isInitialized,
        layersCount: layers.length
      });
      return;
    }

    // Only update if layers hash actually changed
    if (lastLayersStateRef.current === layersHash) {
      console.log('[MapRenderer] ⏸️ Skipping layer update - no changes detected');
      return;
    }

    const map = mapRef.current.getMap();
    console.log('[MapRenderer] 🔄 Processing layer changes...');
    
    // Process each layer in context for INSTANT toggle behavior
    layers.forEach(layer => {
      const layerId = `custom-layer-${layer.id}`;
      const sourceId = `custom-source-${layer.id}`;
      const layerExists = map.getLayer(layerId);
      const shouldBeVisible = layer.visible !== false;
      
      if (shouldBeVisible && !layerExists) {
        // Layer should be visible but doesn't exist - ADD IT
        console.log(`[MapRenderer] 🟢 INSTANTLY adding layer: ${layer.id}`);
        addNewLayer(map, layer, layerId, sourceId);
      } else if (!shouldBeVisible && layerExists) {
        // Layer should be hidden and exists - REMOVE IT
        console.log(`[MapRenderer] 🔴 INSTANTLY removing layer: ${layer.id}`);
        map.removeLayer(layerId);
        // Keep source for quick re-adding later
      } else if (shouldBeVisible && layerExists) {
        // Layer should be visible and exists - ENSURE IT'S VISIBLE
        console.log(`[MapRenderer] ✅ Ensuring layer visibility: ${layer.id}`);
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }
    });
    
    lastLayersStateRef.current = layersHash;
  }, [layersHash, isInitialized, mapLoadedRef.current]);

  // GUI-NOTE: Efficient function to add a new layer to the map
  const addNewLayer = (map, layer, layerId, sourceId) => {
    console.log(`[MapRenderer] ⚡ INSTANTLY adding layer: ${layer.id}`);
    
    // Add source if it doesn't exist
    if (!map.getSource(sourceId) && layer.source) {
      try {
        map.addSource(sourceId, layer.source);
      } catch (error) {
        console.error(`[MapRenderer] Error adding source for ${layer.id}:`, error);
        return;
      }
    }

    // Create layer configuration
    const layerConfig = {
      id: layerId,
      source: sourceId,
      type: layer.type || 'fill',
      layout: {
        visibility: 'visible',
        ...layer.layout
      },
      ...layer.paint && { paint: layer.paint }
    };

    try {
      map.addLayer(layerConfig);
      console.log(`[MapRenderer] ✅ INSTANTLY added layer: ${layer.id}`);
    } catch (error) {
      console.error(`[MapRenderer] ❌ Error adding layer ${layer.id}:`, error);
    }
  };

  // GUI-NOTE: Function to sync existing layers from context with map
  const syncLayersWithMap = (map) => {
    console.log('[MapRenderer] 🔄 Syncing existing layers with map...');
    
    layers.forEach(layer => {
      const layerId = `custom-layer-${layer.id}`;
      const sourceId = `custom-source-${layer.id}`;
      const layerExists = map.getLayer(layerId);
      const shouldBeVisible = layer.visible !== false;
      
      if (shouldBeVisible && !layerExists) {
        // Layer should be visible but doesn't exist on map - ADD IT
        console.log(`[MapRenderer] 🟢 Syncing: Adding layer ${layer.id}`);
        addNewLayer(map, layer, layerId, sourceId);
      } else if (!shouldBeVisible && layerExists) {
        // Layer should be hidden but exists on map - REMOVE IT
        console.log(`[MapRenderer] 🔴 Syncing: Removing layer ${layer.id}`);
        map.removeLayer(layerId);
      } else if (shouldBeVisible && layerExists) {
        // Layer should be visible and exists - ENSURE VISIBILITY
        console.log(`[MapRenderer] ✅ Syncing: Ensuring visibility for ${layer.id}`);
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      }
    });
  };

  // GUI-NOTE: Efficient function to update layer visibility instantly
  const updateLayerVisibility = (map, layerId, visible) => {
    const layer = map.getLayer(layerId);
    if (!layer) return;
    
    const shouldBeVisible = visible !== false;
    const currentVisibility = map.getLayoutProperty(layerId, 'visibility');
    const targetVisibility = shouldBeVisible ? 'visible' : 'none';
    
    // Only update if visibility actually changed
    if (currentVisibility !== targetVisibility) {
      console.log(`[MapRenderer] Updating visibility for ${layerId}: ${targetVisibility}`);
      map.setLayoutProperty(layerId, 'visibility', targetVisibility);
    }
  };


  // Garantir que temos todas as props necessárias
  const safeMapProps = {
    ...mapProps,
    mapStyle: mapStyle || "https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
  };

  const handleMapClick = useCallback((event) => {
    if (!onMarkerClick) return;
    
    const { features } = event;
    if (features && features.length > 0) {
      const feature = features[0];
      
      // Check if clicked feature is from hip-hop-locations layers
      if (feature.layer && (feature.layer.id === 'layer-hip-hop-locations' || feature.layer.id === 'layer-hip-hop-locations-center' || feature.layer.id === 'custom-layer-hip-hop-locations' || feature.layer.id === 'custom-layer-hip-hop-locations-center')) {
        
        // Map feature properties to expected format and add coordinates
        const location = {
          id: feature.properties.id,
          name: feature.properties.title || feature.properties.name,
          description: feature.properties.archival_history || feature.properties.description || 'Sem descrição disponível',
          itemCount: 1,
          coordinateType: feature.properties.coordinate_source,
          sourceType: feature.properties.sourceType,
          locality_type_name: feature.properties.locality_type_name,
          slug: feature.properties.id,
          coordinates: {
            lng: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1]
          },
          // Preserve all original properties
          ...feature.properties
        };
        
        onMarkerClick(location);
      }
    }
  }, [onMarkerClick]);

  const handleMapMouseMove = useCallback((event) => {
    if (!onHover) return;
    
    const { features } = event;
    if (features && features.length > 0) {
      const feature = features[0];
      
      // Check if hovered feature is from hip-hop-locations layers
      if (feature.layer && (feature.layer.id === 'layer-hip-hop-locations' || feature.layer.id === 'layer-hip-hop-locations-center' || feature.layer.id === 'custom-layer-hip-hop-locations' || feature.layer.id === 'custom-layer-hip-hop-locations-center')) {
        
        // Map feature properties to expected format for popup
        const mappedLocation = {
          id: feature.properties.id,
          name: feature.properties.title || feature.properties.name,
          description: feature.properties.archival_history || feature.properties.description || 'Sem descrição disponível',
          itemCount: 1,
          coordinateType: feature.properties.coordinate_source,
          sourceType: feature.properties.sourceType,
          locality_type_name: feature.properties.locality_type_name,
          // Preserve all original properties
          ...feature.properties
        };
        
        onHover(mappedLocation, event.lngLat);
      }
    } else {
      onHover(null);
    }
  }, [onHover]);

  return (
    <Map
      ref={mapRef}
      onMove={onMove}
      onClick={handleMapClick}
      onMouseMove={handleMapMouseMove}
      style={style}
      mapStyle={safeMapProps.mapStyle}
      attributionControl={attributionControl}
      transitionDuration={transitionDuration}
      {...safeMapProps}
      interactiveLayerIds={['layer-hip-hop-locations', 'layer-hip-hop-locations-center', 'custom-layer-hip-hop-locations', 'custom-layer-hip-hop-locations-center']}
    >
      {/* Render layers from context using Source and Layer components */}
      {visibleLayers.map((layer) => (
        <Source
          key={`source-${layer.id}`}
          id={`source-${layer.id}`}
          type="geojson"
          data={layer.source?.data || { type: 'FeatureCollection', features: [] }}
        >
          <Layer
            id={`layer-${layer.id}`}
            type={layer.type || 'circle'}
            paint={layer.paint || {}}
            layout={layer.layout || {}}
          />
        </Source>
      ))}
      
      {/* GUI-NOTE: Render any additional children (markers, popups, etc.) */}
      {children}
    </Map>
  );
});

MapRenderer.displayName = 'MapRenderer';

export default MapRenderer;
'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// GUI-NOTE: Context for managing map layers state and operations
const MapContext = createContext();

// GUI-NOTE: Action types for layer management
const MAP_ACTIONS = {
  LOAD_LAYERS: 'LOAD_LAYERS',
  TOGGLE_LAYER_VISIBILITY: 'TOGGLE_LAYER_VISIBILITY',
  UPDATE_LAYER_PROPERTY: 'UPDATE_LAYER_PROPERTY',
  REORDER_LAYERS: 'REORDER_LAYERS',
  ADD_LAYER: 'ADD_LAYER',
  REMOVE_LAYER: 'REMOVE_LAYER',
  SET_INITIALIZED: 'SET_INITIALIZED'
};

// GUI-NOTE: Reducer for managing layers state
const mapReducer = (state, action) => {
  switch (action.type) {
    case MAP_ACTIONS.LOAD_LAYERS:
      return {
        ...state,
        layers: action.payload,
        isLoading: false,
        isInitialized: true
      };

    case MAP_ACTIONS.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload
      };

    case MAP_ACTIONS.TOGGLE_LAYER_VISIBILITY:
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.payload.layerId
            ? { ...layer, visible: !layer.visible }
            : layer
        )
      };

    case MAP_ACTIONS.UPDATE_LAYER_PROPERTY:
      return {
        ...state,
        layers: state.layers.map(layer =>
          layer.id === action.payload.layerId
            ? { 
                ...layer, 
                [action.payload.property]: action.payload.value 
              }
            : layer
        )
      };

    case MAP_ACTIONS.REORDER_LAYERS:
      return {
        ...state,
        layers: action.payload
      };

    case MAP_ACTIONS.ADD_LAYER:
      return {
        ...state,
        layers: [...state.layers, action.payload]
      };

    case MAP_ACTIONS.REMOVE_LAYER:
      return {
        ...state,
        layers: state.layers.filter(layer => layer.id !== action.payload)
      };

    default:
      return state;
  }
};

// GUI-NOTE: Initial state for map context
const initialState = {
  layers: [],
  isLoading: true,
  error: null,
  isInitialized: false
};

// GUI-NOTE: Hook to access map context
export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

// GUI-NOTE: Provider component for map context
export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  // GUI-NOTE: Load layers from API or data source
  const loadLayers = useCallback(async (layersData) => {
    try {
      // If layersData is provided, use it directly
      if (layersData) {
        dispatch({ type: MAP_ACTIONS.LOAD_LAYERS, payload: layersData });
        return;
      }

      // Otherwise, fetch from API
      // TODO: Replace with actual API call
      const response = await fetch('/api/map/layers');
      const layers = await response.json();
      
      dispatch({ type: MAP_ACTIONS.LOAD_LAYERS, payload: layers });
    } catch (error) {
      console.error('Error loading layers:', error);
      // For now, load with empty layers if API fails
      dispatch({ type: MAP_ACTIONS.LOAD_LAYERS, payload: [] });
    }
  }, []);

  // GUI-NOTE: Toggle visibility of a specific layer
  const toggleLayerVisibility = useCallback((layerId) => {
    dispatch({
      type: MAP_ACTIONS.TOGGLE_LAYER_VISIBILITY,
      payload: { layerId }
    });
  }, []);

  // GUI-NOTE: Update any property of a specific layer
  const updateLayerProperty = useCallback((layerId, property, value) => {
    dispatch({
      type: MAP_ACTIONS.UPDATE_LAYER_PROPERTY,
      payload: { layerId, property, value }
    });
  }, []);

  // GUI-NOTE: Reorder layers for rendering priority
  const reorderLayers = useCallback((newLayersOrder) => {
    dispatch({
      type: MAP_ACTIONS.REORDER_LAYERS,
      payload: newLayersOrder
    });
  }, []);

  // GUI-NOTE: Add a new layer to the map
  const addLayer = useCallback((layer) => {
    dispatch({
      type: MAP_ACTIONS.ADD_LAYER,
      payload: layer
    });
  }, []);

  // GUI-NOTE: Remove a layer from the map
  const removeLayer = useCallback((layerId) => {
    dispatch({
      type: MAP_ACTIONS.REMOVE_LAYER,
      payload: layerId
    });
  }, []);

  // GUI-NOTE: Get visible layers only (useful for map rendering)
  const getVisibleLayers = () => {
    return state.layers.filter(layer => layer.visible !== false);
  };

  // GUI-NOTE: Get layer by ID
  const getLayerById = (layerId) => {
    return state.layers.find(layer => layer.id === layerId);
  };

  // GUI-NOTE: Move layer up in rendering order
  const moveLayerUp = useCallback((layerId) => {
    const currentIndex = state.layers.findIndex(layer => layer.id === layerId);
    if (currentIndex > 0) {
      const newLayers = [...state.layers];
      [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
      [newLayers[currentIndex - 1], newLayers[currentIndex]];
      reorderLayers(newLayers);
    }
  }, [state.layers, reorderLayers]);

  // GUI-NOTE: Move layer down in rendering order
  const moveLayerDown = useCallback((layerId) => {
    const currentIndex = state.layers.findIndex(layer => layer.id === layerId);
    if (currentIndex < state.layers.length - 1) {
      const newLayers = [...state.layers];
      [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
      [newLayers[currentIndex + 1], newLayers[currentIndex]];
      reorderLayers(newLayers);
    }
  }, [state.layers, reorderLayers]);

  // GUI-NOTE: Function to mark context as initialized
  const setInitialized = useCallback((initialized = true) => {
    dispatch({
      type: MAP_ACTIONS.SET_INITIALIZED,
      payload: initialized
    });
  }, []);

  // GUI-NOTE: Context value object
  const value = {
    // State
    layers: state.layers,
    isLoading: state.isLoading,
    error: state.error,
    isInitialized: state.isInitialized,

    // Core functions
    loadLayers,
    toggleLayerVisibility,
    updateLayerProperty,
    reorderLayers,
    addLayer,
    removeLayer,
    setInitialized,

    // Utility functions
    getVisibleLayers,
    getLayerById,
    moveLayerUp,
    moveLayerDown
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
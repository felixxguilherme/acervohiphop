'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';
import atomService from '@/services/atomService';
import { fetchCompat } from '@/utils/httpClient';

// Tipos de ações
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_ALL_ITEMS: 'SET_ALL_ITEMS',
  SET_ITEM_DETAILS: 'SET_ITEM_DETAILS',
  SET_COLLECTIONS: 'SET_COLLECTIONS',
  SET_TAXONOMIES: 'SET_TAXONOMIES',
  SET_STATISTICS: 'SET_STATISTICS',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  SET_SEARCH_PARAMS: 'SET_SEARCH_PARAMS',
  SET_MAP_DATA: 'SET_MAP_DATA',
  SET_GEOJSON: 'SET_GEOJSON',
  UPDATE_GEOJSON_FEATURE: 'UPDATE_GEOJSON_FEATURE'
};

// Estado inicial
const initialState = {
  // Dados gerais
  allItems: [],
  collections: [],
  taxonomies: null,
  statistics: null,
  
  // Busca
  searchResults: [],
  searchParams: {
    query: '',
    field: 'title',
    operator: 'and',
    filters: {}
  },
  searchTotal: 0,
  
  // Item individual
  currentItem: null,
  itemsCache: new Map(),
  
  // Dados do mapa
  mapData: [],
  geoJson: null,
  mapStatistics: {
    totalItems: 0,
    itemsWithCoordinates: 0,
    itemsWithoutCoordinates: 0,
    extractionSuccessRate: '0%'
  },
  
  // Estados
  loading: {
    search: false,
    items: false,
    item: false,
    collections: false,
    taxonomies: false,
    map: false
  },
  
  errors: {
    search: null,
    items: null,
    item: null,
    collections: null,
    taxonomies: null,
    map: null
  }
};

// Reducer
function acervoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.section]: action.value
        }
      };
      
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.section]: action.error
        }
      };
      
    case ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.results,
        searchTotal: action.total,
        errors: { ...state.errors, search: null }
      };
      
    case ACTIONS.SET_ALL_ITEMS:
      return {
        ...state,
        allItems: action.items,
        errors: { ...state.errors, items: null }
      };
      
    case ACTIONS.SET_ITEM_DETAILS:
      const newCache = new Map(state.itemsCache);
      newCache.set(action.slug, action.item);
      return {
        ...state,
        currentItem: action.item,
        itemsCache: newCache,
        errors: { ...state.errors, item: null }
      };
      
    case ACTIONS.SET_COLLECTIONS:
      return {
        ...state,
        collections: action.collections,
        errors: { ...state.errors, collections: null }
      };
      
    case ACTIONS.SET_TAXONOMIES:
      return {
        ...state,
        taxonomies: action.taxonomies,
        errors: { ...state.errors, taxonomies: null }
      };
      
    case ACTIONS.SET_STATISTICS:
      return {
        ...state,
        statistics: action.statistics
      };
      
    case ACTIONS.CLEAR_SEARCH:
      return {
        ...state,
        searchResults: [],
        searchTotal: 0,
        searchParams: initialState.searchParams
      };
      
    case ACTIONS.SET_SEARCH_PARAMS:
      return {
        ...state,
        searchParams: { ...state.searchParams, ...action.params }
      };
      
    case ACTIONS.SET_MAP_DATA:
      return {
        ...state,
        mapData: action.data,
        mapStatistics: action.statistics || state.mapStatistics,
        errors: { ...state.errors, map: null }
      };
      
    case ACTIONS.SET_GEOJSON:
      return {
        ...state,
        geoJson: action.geoJson,
        errors: { ...state.errors, map: null }
      };
      
    case ACTIONS.UPDATE_GEOJSON_FEATURE:
      if (!state.geoJson) return state;
      
      const updatedFeatures = state.geoJson.features.map(feature => 
        feature.properties.id === action.featureId 
          ? { ...feature, properties: { ...feature.properties, ...action.updates } }
          : feature
      );
      
      return {
        ...state,
        geoJson: {
          ...state.geoJson,
          features: updatedFeatures
        }
      };
      
    default:
      return state;
  }
}

// Contexto
const AcervoContext = createContext();

// Funções utilitárias para GeoJSON
function fixThumbnailUrl(url) {
  if (!url) return null;
  
  // Se a URL começa com https://acervodistrito... adiciona 'base'
  if (url.startsWith('https://acervodistrito')) {
    return url.replace('https://acervodistrito', 'https://base.acervodistrito');
  }
  
  return url;
}

function extractCoordinatesFromNotes(notes) {
  if (!notes || !Array.isArray(notes)) {
    return null;
  }
  
  // Procurar por padrões de coordenadas nas notas
  for (const note of notes) {
    if (!note || typeof note !== 'string') continue;
    
    // Regex para capturar coordenadas decimais
    const coordPatterns = [
      // Padrão: lat, lng (com ou sem labels)
      /(?:lat(?:itude)?:?\s*)?(-?\d+\.?\d*),\s*(?:lng|lon(?:gitude)?:?\s*)?(-?\d+\.?\d*)/i,
      // Padrão: lat|lng
      /(-?\d+\.?\d*)\|(-?\d+\.?\d*)/,
      // Padrão: apenas dois números decimais separados por vírgula
      /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/
    ];
    
    for (const pattern of coordPatterns) {
      const match = note.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        // Validar se as coordenadas estão em faixas válidas
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          return [lng, lat]; // GeoJSON usa [longitude, latitude]
        }
      }
    }
  }
  
  return null;
}

// Provider
export function AcervoProvider({ children }) {
  const [state, dispatch] = useReducer(acervoReducer, initialState);

  // Função para busca simplificada (sq0 + sf0)
  const performSearch = useCallback(async (query, field = 'title', filters = {}) => {
    dispatch({ type: ACTIONS.SET_LOADING, section: 'search', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'search', error: null });
    
    try {
      console.info('[AcervoContext] 🔍 Iniciando busca:', { query, field, filters });
      
      if (!query?.trim()) {
        // Se não há query, carrega itens padrão
        const response = await fetchCompat('/api/acervo?limit=24');
        const data = await response.json();
        
        dispatch({
          type: ACTIONS.SET_SEARCH_RESULTS,
          results: data.results || [],
          total: data.total || 0
        });
      } else {
        // Busca com sq0 e sf0 apenas
        const url = `/api/acervo?sq0=${encodeURIComponent(query.trim())}&sf0=${field}`;
        console.info('[AcervoContext] 📋 URL da busca:', url);
        
        const response = await fetchCompat(url);
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.info('[AcervoContext] ✅ Resposta recebida:', {
          total: data.total,
          count: data.results?.length
        });

        dispatch({
          type: ACTIONS.SET_SEARCH_RESULTS,
          results: data.results || [],
          total: data.total || 0
        });
      }
      
      // Atualiza parâmetros de busca
      dispatch({
        type: ACTIONS.SET_SEARCH_PARAMS,
        params: { query, field, filters }
      });
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro na busca:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'search', error: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'search', value: false });
    }
  }, []);

  // Carregar todos os itens (para home) com cache melhorado
  const loadAllItems = useCallback(async (limit = 24, forceReload = false) => {
    if (state.allItems.length > 0 && !forceReload) return; // Já carregado
    
    dispatch({ type: ACTIONS.SET_LOADING, section: 'items', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'items', error: null });
    
    try {
      console.info('[AcervoContext] 📄 Carregando todos os itens');
      const response = await atomService.getItems({ limit });
      
      dispatch({
        type: ACTIONS.SET_ALL_ITEMS,
        items: response.results || []
      });
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar itens:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'items', error: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'items', value: false });
    }
  }, [state.allItems.length]);

  // Carregar item específico
  const loadItem = useCallback(async (slug) => {
    // Verifica cache primeiro usando a função de acesso direto ao estado
    const cachedItem = state.itemsCache.get(slug);
    if (cachedItem) {
      dispatch({
        type: ACTIONS.SET_ITEM_DETAILS,
        slug,
        item: cachedItem
      });
      return cachedItem;
    }
    
    dispatch({ type: ACTIONS.SET_LOADING, section: 'item', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'item', error: null });
    
    try {
      console.info('[AcervoContext] 🎯 Carregando item:', slug);
      
      // Busca detalhes do item específico
      const response = await fetchCompat(`/api/acervo/${slug}`);
      if (!response.ok) {
        throw new Error(`Item não encontrado: ${response.status}`);
      }
      
      const itemData = await response.json();
      
      dispatch({
        type: ACTIONS.SET_ITEM_DETAILS,
        slug,
        item: itemData
      });
      
      return itemData;
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar item:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'item', error: error.message });
      return null;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'item', value: false });
    }
  }, []);

  // Carregar coleções
  const loadCollections = useCallback(async () => {
    if (state.collections.length > 0) return; // Já carregado
    
    dispatch({ type: ACTIONS.SET_LOADING, section: 'collections', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'collections', error: null });
    
    try {
      console.info('[AcervoContext] 📚 Carregando coleções');
      const response = await atomService.getCollections();
      
      dispatch({
        type: ACTIONS.SET_COLLECTIONS,
        collections: response.results || []
      });
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar coleções:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'collections', error: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'collections', value: false });
    }
  }, [state.collections.length]);

  // Carregar taxonomias
  const loadTaxonomies = useCallback(async () => {
    if (state.taxonomies) return; // Já carregado
    
    dispatch({ type: ACTIONS.SET_LOADING, section: 'taxonomies', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'taxonomies', error: null });
    
    try {
      console.info('[AcervoContext] 🏷️ Carregando taxonomias');
      const taxonomies = await atomService.getTaxonomies();
      
      dispatch({
        type: ACTIONS.SET_TAXONOMIES,
        taxonomies
      });
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar taxonomias:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'taxonomies', error: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'taxonomies', value: false });
    }
  }, [state.taxonomies]);

  // Limpar busca
  const clearSearch = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_SEARCH });
  }, []);

  // Limpar cache (útil para forçar recarregamento)
  const clearCache = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ALL_ITEMS, items: [] });
    dispatch({ type: ACTIONS.SET_COLLECTIONS, collections: [] });
    dispatch({ type: ACTIONS.SET_STATISTICS, statistics: null });
    dispatch({ type: ACTIONS.SET_TAXONOMIES, taxonomies: null });
    dispatch({ type: ACTIONS.SET_MAP_DATA, data: [] });
    dispatch({ type: ACTIONS.SET_GEOJSON, geoJson: null });
  }, []);

  // Carregar itens de um creator específico com detalhes
  const loadCreatorAndDetails = useCallback(async (creatorId, forceReload = false) => {
    console.info('[AcervoContext] 🎭 Carregando itens do creator:', creatorId);
    
    try {
      // Buscar todos os itens com paginação
      let allItems = [];
      let skip = 0;
      const limit = 50;
      
      // Primeira chamada para obter total
      const firstResponse = await fetchCompat(`/api/acervo?creators=${creatorId}&limit=${limit}`);
      if (!firstResponse.ok) {
        throw new Error(`Erro na API: ${firstResponse.status}`);
      }
      
      const firstData = await firstResponse.json();
      const total = firstData.total || 0;
      allItems = firstData.results || [];
      
      console.info(`[AcervoContext] 📊 Creator ${creatorId}: ${allItems.length}/${total} itens`);
      
      // Buscar páginas adicionais se necessário
      if (total > allItems.length) {
        for (skip = limit; skip < total; skip += limit) {
          console.info(`[AcervoContext] 📄 Buscando página skip=${skip}`);
          
          const response = await fetchCompat(`/api/acervo?creators=${creatorId}&limit=${limit}&skip=${skip}`);
          if (response.ok) {
            const pageData = await response.json();
            const newItems = pageData.results || [];
            allItems = [...allItems, ...newItems];
            
            console.info(`[AcervoContext] ➕ Adicionados ${newItems.length} itens (total: ${allItems.length}/${total})`);
          }
        }
      }
      
      console.info(`[AcervoContext] ✅ Creator ${creatorId} completo: ${allItems.length} itens carregados`);
      return allItems;
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar dados do creator:', error);
      throw error;
    }
  }, []);

  // Carregar dados do mapa (creator 3312) com paginação
  const loadMapData = useCallback(async (creatorId = '8337', forceReload = false) => {
    if (state.mapData.length > 0 && !forceReload) return; // Já carregado
    
    dispatch({ type: ACTIONS.SET_LOADING, section: 'map', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'map', error: null });
    
    try {
      console.info('[AcervoContext] 🗺️ Carregando dados do mapa para creator:', creatorId);
      
      // Buscar todos os itens com paginação
      let allItems = [];
      let skip = 0;
      const limit = 50; // Lotes menores para mais controle
      
      // Primeira chamada para obter total
      const firstResponse = await fetchCompat(`/api/acervo?creators=${creatorId}&limit=${limit}`);
      if (!firstResponse.ok) {
        throw new Error(`Erro na API: ${firstResponse.status}`);
      }
      
      const firstData = await firstResponse.json();
      const total = firstData.total || 0;
      allItems = firstData.results || [];
      
      console.info(`[AcervoContext] 📊 Primeira página: ${allItems.length}/${total} itens`);
      
      // Buscar páginas restantes se necessário
      if (total > allItems.length) {
        for (skip = limit; skip < total; skip += limit) {
          console.info(`[AcervoContext] 📄 Buscando página skip=${skip}`);
          
          const response = await fetchCompat(`/api/acervo?creators=${creatorId}&limit=${limit}&skip=${skip}`);
          if (response.ok) {
            const pageData = await response.json();
            const newItems = pageData.results || [];
            
            // Verificar duplicatas
            const existingSlugs = allItems.map(item => item.slug);
            const uniqueItems = newItems.filter(item => !existingSlugs.includes(item.slug));
            
            if (uniqueItems.length > 0) {
              allItems = allItems.concat(uniqueItems);
              console.info(`[AcervoContext] ✅ Adicionados ${uniqueItems.length} itens únicos (total: ${allItems.length})`);
            } else {
              console.warn(`[AcervoContext] ⚠️ Nenhum item novo no skip ${skip}, parando paginação`);
              break;
            }
          } else {
            console.error(`[AcervoContext] ❌ Erro na página skip ${skip}: ${response.status}`);
            break;
          }
          
          // Pausa entre requisições
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.info(`[AcervoContext] 🎉 Total coletado: ${allItems.length} itens`);
      
      // Buscar detalhes completos para cada item
      const itemsWithDetails = [];
      
      for (const item of allItems) {
        if (!item.slug) continue;
        
        try {
          const detailResponse = await fetchCompat(`/api/acervo/${item.slug}`);
          if (detailResponse.ok) {
            const details = await detailResponse.json();
            
            const combinedItem = {
              slug: item.slug,
              thumbnail_url: fixThumbnailUrl(item.thumbnail_url),
              title: details.title,
              archival_history: details.archival_history,
              place_access_points: details.place_access_points,
              notes: details.notes,
              reference_code: details.reference_code,
              creation_dates: details.creation_dates,
              physical_characteristics: details.physical_characteristics,
              level_of_description: details.level_of_description,
              scope_and_content: details.scope_and_content,
              digital_object_url: details.digital_object_url,
              _original_item: item,
              _original_details: details
            };
            
            itemsWithDetails.push(combinedItem);
          }
          
          // Pausa entre requisições de detalhes
          await new Promise(resolve => setTimeout(resolve, 50));
          
        } catch (error) {
          console.warn(`[AcervoContext] ⚠️ Erro ao buscar detalhes de ${item.slug}:`, error);
        }
      }
      
      console.info(`[AcervoContext] 📋 Itens com detalhes: ${itemsWithDetails.length}`);
      
      // Salvar dados do mapa
      dispatch({
        type: ACTIONS.SET_MAP_DATA,
        data: itemsWithDetails
      });
      
      // Gerar GeoJSON automaticamente
      generateGeoJson(itemsWithDetails);
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar dados do mapa:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'map', error: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'map', value: false });
    }
  }, [state.mapData.length]);

  // Gerar GeoJSON a partir dos dados do mapa
  const generateGeoJson = useCallback((items = state.mapData) => {
    console.info('[AcervoContext] 🗺️ Gerando GeoJSON...');
    
    const features = [];
    let itemsWithCoordinates = 0;
    let itemsWithoutCoordinates = 0;
    
    for (const item of items) {
      // Extrair coordenadas do campo 'notes'
      const coordinates = extractCoordinatesFromNotes(item.notes);
      
      // Se não conseguiu extrair coordenadas, usar coordenadas padrão de Brasília
      const finalCoordinates = coordinates || [-47.8825, -15.7942];
      
      if (coordinates) {
        itemsWithCoordinates++;
      } else {
        itemsWithoutCoordinates++;
      }
      
      const feature = {
        type: "Feature",
        properties: {
          id: item.slug,
          title: item.title,
          thumbnail_url: item.thumbnail_url,
          reference_code: item.reference_code,
          physical_characteristics: item.physical_characteristics,
          creation_dates: item.creation_dates,
          archival_history: item.archival_history,
          place_access_points: item.place_access_points,
          scope_and_content: item.scope_and_content,
          digital_object_url: item.digital_object_url,
          notes: item.notes,
          
          // Metadados sobre coordenadas
          has_real_coordinates: !!coordinates,
          coordinate_source: coordinates ? "extracted_from_notes" : "default_brasilia",
          
          // URLs para detalhes completos
          detail_url: `https://base.acervodistritohiphop.com.br/index.php/${item.slug}`,
          api_url: `https://base.acervodistritohiphop.com.br/index.php/api/informationobjects/${item.slug}`,
          
          // Metadados
          source: "AtoM API - Creator 3312",
          last_updated: new Date().toISOString()
        },
        geometry: {
          type: "Point",
          coordinates: finalCoordinates
        }
      };
      
      features.push(feature);
    }
    
    const geoJson = {
      type: "FeatureCollection",
      metadata: {
        title: "Acervo Hip-Hop DF - Creator 3312",
        description: "Itens do acervo com informações geográficas para exibição no mapa",
        total_features: features.length,
        coordinate_statistics: {
          items_with_real_coordinates: itemsWithCoordinates,
          items_with_default_coordinates: itemsWithoutCoordinates,
          extraction_success_rate: `${((itemsWithCoordinates / features.length) * 100).toFixed(1)}%`
        },
        source: "AtoM API",
        creator_id: "3312",
        generated_at: new Date().toISOString()
      },
      features: features
    };
    
    // Atualizar estatísticas
    const statistics = {
      totalItems: features.length,
      itemsWithCoordinates,
      itemsWithoutCoordinates,
      extractionSuccessRate: `${((itemsWithCoordinates / features.length) * 100).toFixed(1)}%`
    };
    
    dispatch({
      type: ACTIONS.SET_MAP_DATA,
      data: items,
      statistics
    });
    
    dispatch({
      type: ACTIONS.SET_GEOJSON,
      geoJson
    });
    
    console.info(`[AcervoContext] ✅ GeoJSON gerado: ${features.length} features, ${itemsWithCoordinates} com coordenadas reais`);
    
    return geoJson;
  }, [state.mapData]);

  // Atualizar feature específica no GeoJSON
  const updateGeoJsonFeature = useCallback((featureId, updates) => {
    dispatch({
      type: ACTIONS.UPDATE_GEOJSON_FEATURE,
      featureId,
      updates
    });
  }, []);

  // Carregar estatísticas
  const loadStatistics = useCallback(async () => {
    if (state.statistics) return; // Já carregado
    
    try {
      const stats = await atomService.getStatistics();
      dispatch({
        type: ACTIONS.SET_STATISTICS,
        statistics: stats
      });
    } catch (error) {
      console.warn('[AcervoContext] ⚠️ Erro ao carregar estatísticas:', error);
    }
  }, [state.statistics]);

  // Valor do contexto
  const contextValue = {
    // Estado
    ...state,
    
    // Ações
    performSearch,
    loadAllItems,
    loadItem,
    loadCollections,
    loadTaxonomies,
    loadStatistics,
    clearSearch,
    clearCache,
    getCreatorItems: loadCreatorAndDetails,
    
    // Ações do mapa
    loadMapData,
    generateGeoJson,
    updateGeoJsonFeature,
    
    // Utilitários
    isLoading: (section) => state.loading[section] || false,
    getError: (section) => state.errors[section],
    hasData: (section) => {
      switch (section) {
        case 'items': return state.allItems.length > 0;
        case 'collections': return state.collections.length > 0;
        case 'taxonomies': return !!state.taxonomies;
        case 'search': return state.searchResults.length > 0;
        default: return false;
      }
    }
  };

  return (
    <AcervoContext.Provider value={contextValue}>
      {children}
    </AcervoContext.Provider>
  );
}

// Hook personalizado
export function useAcervo() {
  const context = useContext(AcervoContext);
  if (!context) {
    throw new Error('useAcervo deve ser usado dentro de AcervoProvider');
  }
  return context;
}

export default AcervoContext;
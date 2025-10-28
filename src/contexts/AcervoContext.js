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

// Mapeamento de locais conhecidos do DF para coordenadas aproximadas
const DF_PLACES_COORDINATES = {
  // Regiões Administrativas principais
  'brasília': [-47.8825, -15.7942],
  'brasilia': [-47.8825, -15.7942],
  'plano piloto': [-47.8825, -15.7942],
  'asa norte': [-47.8814, -15.7626],
  'asa sul': [-47.8814, -15.8267],
  
  // Cidades satélites
  'ceilândia': [-48.1137, -15.8181],
  'ceilandia': [-48.1137, -15.8181],
  'taguatinga': [-48.0739, -15.8316],
  'águas claras': [-48.0264, -15.8344],
  'aguas claras': [-48.0264, -15.8344],
  'samambaia': [-48.1044, -15.8758],
  'santa maria': [-48.0219, -16.0006],
  'gama': [-48.0653, -15.9989],
  'sobradinho': [-47.7867, -15.6533],
  'planaltina': [-47.6511, -15.4522],
  'paranoá': [-47.7792, -15.7669],
  'paranoa': [-47.7792, -15.7669],
  'núcleo bandeirante': [-47.9658, -15.8631],
  'nucleo bandeirante': [-47.9658, -15.8631],
  'candangolândia': [-47.9419, -15.8531],
  'candangolandia': [-47.9419, -15.8531],
  'guará': [-47.9667, -15.8072],
  'guara': [-47.9667, -15.8072],
  'cruzeiro': [-47.9583, -15.7933],
  'riacho fundo': [-48.0167, -15.8833],
  'lago sul': [-47.8333, -15.8167],
  'lago norte': [-47.8167, -15.7333],
  'sudoeste': [-47.9167, -15.7833],
  'octogonal': [-47.9333, -15.7833],
  'jardim botânico': [-47.8333, -15.8667],
  'jardim botanico': [-47.8333, -15.8667],
  'são sebastião': [-47.7833, -15.9],
  'sao sebastiao': [-47.7833, -15.9],
  'recanto das emas': [-48.0667, -15.9],
  'vicente pires': [-48.0333, -15.8],
  'estrutural': [-47.9833, -15.7833],
  'sobradinho ii': [-47.8, -15.65],
  'fercal': [-47.8833, -15.6],
  'varjão': [-47.8, -15.7833],
  'varjao': [-47.8, -15.7833],
  'park way': [-47.9833, -15.8833],
  'brazlândia': [-48.2, -15.6667],
  'brazlandia': [-48.2, -15.6667],
  'itapoã': [-47.7667, -15.75],
  'itapoa': [-47.7667, -15.75],
  
  // Pontos de referência específicos
  'esplanada dos ministérios': [-47.8597, -15.7975],
  'esplanada dos ministerios': [-47.8597, -15.7975],
  'congresso nacional': [-47.8636, -15.7998],
  'palácio do planalto': [-47.8611, -15.7992],
  'palacio do planalto': [-47.8611, -15.7992],
  'supremo tribunal federal': [-47.8619, -15.8008],
  'stf': [-47.8619, -15.8008],
  'catedral de brasília': [-47.8747, -15.7975],
  'catedral de brasilia': [-47.8747, -15.7975],
  'torre de tv': [-47.8922, -15.7903],
  'torre de televisão': [-47.8922, -15.7903],
  'torre de televisao': [-47.8922, -15.7903],
  'memorial jk': [-47.8631, -15.7889],
  'ponte jk': [-47.8308, -15.8372],
  'estádio nacional': [-47.8992, -15.7836],
  'estadio nacional': [-47.8992, -15.7836],
  'mané garrincha': [-47.8992, -15.7836],
  'mane garrincha': [-47.8992, -15.7836],
  'setor comercial sul': [-47.8831, -15.7975],
  'setor comercial norte': [-47.8831, -15.7825],
  'setor bancário sul': [-47.8775, -15.8025],
  'setor bancario sul': [-47.8775, -15.8025],
  'setor bancário norte': [-47.8775, -15.7875],
  'setor bancario norte': [-47.8775, -15.7875],
  'w3 sul': [-47.8992, -15.8197],
  'w3 norte': [-47.8992, -15.7653],
  'l2 sul': [-47.8717, -15.8197],
  'l2 norte': [-47.8717, -15.7653],
  
  // Universidades
  'unb': [-47.8678, -15.7619],
  'universidade de brasília': [-47.8678, -15.7619],
  'universidade de brasilia': [-47.8678, -15.7619],
  'campus darcy ribeiro': [-47.8678, -15.7619],
  'unieuro': [-47.9167, -15.8167],
  'ceub': [-47.9167, -15.8],
  'iesb': [-48.0167, -15.8333],
  
  // Shopping centers e pontos comerciais
  'shopping brasília': [-47.8897, -15.7919],
  'shopping brasilia': [-47.8897, -15.7919],
  'conjunto nacional': [-47.8831, -15.7942],
  'shopping iguatemi': [-47.8897, -15.7919],
  'shopping pátio brasil': [-47.8831, -15.7942],
  'shopping patio brasil': [-47.8831, -15.7942],
  'shopping pier 21': [-48.0739, -15.8316],
  'taguatinga shopping': [-48.0739, -15.8316],
  'águas claras shopping': [-48.0264, -15.8344],
  'aguas claras shopping': [-48.0264, -15.8344],
  
  // Terminais e estações
  'rodoviária': [-47.8831, -15.7942],
  'rodoviaria': [-47.8831, -15.7942],
  'terminal rodoviário': [-47.8831, -15.7942],
  'terminal rodoviario': [-47.8831, -15.7942],
  'aeroporto': [-47.9167, -15.8667],
  'aeroporto de brasília': [-47.9167, -15.8667],
  'aeroporto de brasilia': [-47.9167, -15.8667],
  'aeroporto juscelino kubitschek': [-47.9167, -15.8667],
  
  // Default para DF como um todo
  'distrito federal': [-47.8825, -15.7942],
  'df': [-47.8825, -15.7942]
};

function estimateCoordinatesFromPlaces(place_access_points) {
  if (!place_access_points || !Array.isArray(place_access_points) || place_access_points.length === 0) {
    return null;
  }
  
  // Procurar por correspondências exatas primeiro, depois parciais
  for (const place of place_access_points) {
    if (!place || typeof place !== 'string') continue;
    
    const normalizedPlace = place.toLowerCase()
      .trim()
      .replace(/[àáâãä]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/ñ/g, 'n');
    
    // Correspondência exata
    if (DF_PLACES_COORDINATES[normalizedPlace]) {
      console.info(`[Coordinates] 📍 Correspondência exata encontrada: "${place}" -> ${DF_PLACES_COORDINATES[normalizedPlace]}`);
      return DF_PLACES_COORDINATES[normalizedPlace];
    }
    
    // Correspondência parcial - procurar por palavras-chave
    for (const [key, coords] of Object.entries(DF_PLACES_COORDINATES)) {
      if (normalizedPlace.includes(key) || key.includes(normalizedPlace)) {
        console.info(`[Coordinates] 📍 Correspondência parcial encontrada: "${place}" contém "${key}" -> ${coords}`);
        return coords;
      }
    }
  }
  
  // Se chegou aqui, não encontrou correspondência
  console.warn(`[Coordinates] ⚠️ Nenhuma correspondência encontrada para: ${place_access_points.join(', ')}`);
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
    
    // Limpar também o localStorage
    if (typeof window !== 'undefined') {
      try {
        // Remover cache do mapa
        ['8337', '3312'].forEach(creatorId => {
          localStorage.removeItem(`mapData_${creatorId}`);
          localStorage.removeItem(`geoJson_${creatorId}`);
          localStorage.removeItem(`mapCache_timestamp_${creatorId}`);
        });
        console.info('[AcervoContext] 🧹 Cache do localStorage limpo');
      } catch (error) {
        console.warn('[AcervoContext] ⚠️ Erro ao limpar cache do localStorage:', error);
      }
    }
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

  // Carregar dados do mapa com carregamento progressivo otimizado e cache persistente
  const loadMapData = useCallback(async (creatorId = '8337', forceReload = false, fastMode = true) => {
    // Verificar cache em memória primeiro
    if (state.mapData.length > 0 && state.geoJson && !forceReload) {
      console.info('[AcervoContext] 🎯 Dados do mapa já carregados em memória');
      return;
    }

    // Verificar cache no localStorage
    if (!forceReload && typeof window !== 'undefined') {
      try {
        const cachedMapData = localStorage.getItem(`mapData_${creatorId}`);
        const cachedGeoJson = localStorage.getItem(`geoJson_${creatorId}`);
        const cacheTimestamp = localStorage.getItem(`mapCache_timestamp_${creatorId}`);
        
        // Cache válido por 24 horas
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas
        const now = Date.now();
        
        if (cachedMapData && cachedGeoJson && cacheTimestamp) {
          const timestamp = parseInt(cacheTimestamp);
          if (now - timestamp < CACHE_DURATION) {
            console.info('[AcervoContext] 🎯 Carregando dados do mapa do localStorage (cache válido)');
            
            const mapData = JSON.parse(cachedMapData);
            const geoJson = JSON.parse(cachedGeoJson);
            
            // Calcular estatísticas
            const itemsWithCoordinates = geoJson.features?.filter(f => f.properties.has_real_coordinates).length || 0;
            const statistics = {
              totalItems: geoJson.features?.length || 0,
              itemsWithCoordinates,
              itemsWithoutCoordinates: (geoJson.features?.length || 0) - itemsWithCoordinates,
              extractionSuccessRate: geoJson.metadata?.coordinate_statistics?.extraction_success_rate || '0%'
            };
            
            dispatch({
              type: ACTIONS.SET_MAP_DATA,
              data: mapData,
              statistics
            });
            
            dispatch({
              type: ACTIONS.SET_GEOJSON,
              geoJson
            });
            
            return;
          } else {
            console.info('[AcervoContext] ⏰ Cache expirado, removendo do localStorage');
            localStorage.removeItem(`mapData_${creatorId}`);
            localStorage.removeItem(`geoJson_${creatorId}`);
            localStorage.removeItem(`mapCache_timestamp_${creatorId}`);
          }
        }
      } catch (error) {
        console.warn('[AcervoContext] ⚠️ Erro ao ler cache do localStorage:', error);
      }
    }
    
    dispatch({ type: ACTIONS.SET_LOADING, section: 'map', value: true });
    dispatch({ type: ACTIONS.SET_ERROR, section: 'map', error: null });
    
    try {
      console.info('[AcervoContext] 🗺️ Carregando dados do mapa para creator:', creatorId);
      
      // No modo rápido, carrega apenas uma amostra inicial
      let allItems = [];
      let skip = 0;
      const limit = fastMode ? 20 : 50; // Menos itens no modo rápido
      
      // Primeira chamada para obter total
      const firstResponse = await fetchCompat(`/api/acervo?creators=${creatorId}&limit=${limit}`);
      if (!firstResponse.ok) {
        throw new Error(`Erro na API: ${firstResponse.status}`);
      }
      
      const firstData = await firstResponse.json();
      const total = firstData.total || 0;
      allItems = firstData.results || [];
      
      console.info(`[AcervoContext] 📊 Primeira página: ${allItems.length}/${total} itens`);
      
      // No modo rápido, carrega apenas o suficiente para mostrar algo
      // No modo completo, carrega tudo
      const maxItemsToLoad = fastMode ? Math.min(total, 60) : total;
      
      // Buscar páginas restantes se necessário
      if (total > allItems.length && allItems.length < maxItemsToLoad) {
        for (skip = limit; skip < maxItemsToLoad; skip += limit) {
          console.info(`[AcervoContext] 📄 Buscando página skip=${skip} (modo: ${fastMode ? 'rápido' : 'completo'})`);
          
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
          
          // Pausa menor entre requisições no modo rápido
          await new Promise(resolve => setTimeout(resolve, fastMode ? 50 : 100));
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
      const geoJson = generateGeoJson(itemsWithDetails);
      
      // Salvar no localStorage para cache persistente
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`mapData_${creatorId}`, JSON.stringify(itemsWithDetails));
          localStorage.setItem(`geoJson_${creatorId}`, JSON.stringify(geoJson));
          localStorage.setItem(`mapCache_timestamp_${creatorId}`, Date.now().toString());
          console.info('[AcervoContext] 💾 Dados do mapa salvos no localStorage');
        } catch (error) {
          console.warn('[AcervoContext] ⚠️ Erro ao salvar cache no localStorage:', error);
        }
      }
      
    } catch (error) {
      console.error('[AcervoContext] ❌ Erro ao carregar dados do mapa:', error);
      dispatch({ type: ACTIONS.SET_ERROR, section: 'map', error: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, section: 'map', value: false });
    }
  }, []);

  // Gerar GeoJSON a partir dos dados do mapa
  const generateGeoJson = useCallback((items = state.mapData) => {
    console.info('[AcervoContext] 🗺️ Gerando GeoJSON...');
    
    const features = [];
    let itemsWithCoordinates = 0;
    let itemsWithoutCoordinates = 0;
    
    for (const item of items) {
      // 1. Tentar extrair coordenadas exatas do campo 'notes'
      let coordinates = extractCoordinatesFromNotes(item.notes);
      let coordinateSource = 'default_brasilia';
      let hasRealCoordinates = false;
      
      if (coordinates) {
        coordinateSource = 'extracted_from_notes';
        hasRealCoordinates = true;
        itemsWithCoordinates++;
      } else {
        // 2. Se não tem coordenadas em notes, tentar estimar baseado em place_access_points
        coordinates = estimateCoordinatesFromPlaces(item.place_access_points);
        
        if (coordinates) {
          coordinateSource = 'estimated_from_places';
          hasRealCoordinates = false; // Estimada, não real
          itemsWithCoordinates++; // Conta como "tem coordenadas" mas não "real"
        } else {
          // 3. Último recurso: coordenadas padrão de Brasília
          coordinates = [-47.8825, -15.7942];
          coordinateSource = 'default_brasilia';
          hasRealCoordinates = false;
          itemsWithoutCoordinates++;
        }
      }
      
      const finalCoordinates = coordinates;
      
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
          has_real_coordinates: hasRealCoordinates,
          coordinate_source: coordinateSource,
          
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
    
    // Contar tipos de coordenadas para estatísticas mais detalhadas
    const realCoords = features.filter(f => f.properties.coordinate_source === 'extracted_from_notes').length;
    const estimatedCoords = features.filter(f => f.properties.coordinate_source === 'estimated_from_places').length;
    const defaultCoords = features.filter(f => f.properties.coordinate_source === 'default_brasilia').length;

    const geoJson = {
      type: "FeatureCollection",
      metadata: {
        title: "Acervo Hip-Hop DF - Creator 8337",
        description: "Itens do acervo com informações geográficas para exibição no mapa",
        total_features: features.length,
        coordinate_statistics: {
          items_with_real_coordinates: realCoords,
          items_with_estimated_coordinates: estimatedCoords,
          items_with_default_coordinates: defaultCoords,
          real_coordinates_rate: `${((realCoords / features.length) * 100).toFixed(1)}%`,
          estimated_coordinates_rate: `${((estimatedCoords / features.length) * 100).toFixed(1)}%`,
          extraction_success_rate: `${(((realCoords + estimatedCoords) / features.length) * 100).toFixed(1)}%`
        },
        source: "AtoM API",
        creator_id: "8337",
        generated_at: new Date().toISOString()
      },
      features: features
    };
    
    // Atualizar estatísticas
    const statistics = {
      totalItems: features.length,
      itemsWithRealCoordinates: realCoords,
      itemsWithEstimatedCoordinates: estimatedCoords,
      itemsWithDefaultCoordinates: defaultCoords,
      realCoordinatesRate: `${((realCoords / features.length) * 100).toFixed(1)}%`,
      estimatedCoordinatesRate: `${((estimatedCoords / features.length) * 100).toFixed(1)}%`,
      extractionSuccessRate: `${(((realCoords + estimatedCoords) / features.length) * 100).toFixed(1)}%`
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
    
    console.info(`[AcervoContext] ✅ GeoJSON gerado: ${features.length} features`);
    console.info(`[AcervoContext] 📍 ${realCoords} com coordenadas reais (notes)`);
    console.info(`[AcervoContext] 📍 ${estimatedCoords} com coordenadas estimadas (places)`);
    console.info(`[AcervoContext] 📍 ${defaultCoords} com coordenadas padrão (Brasília)`);
    
    return geoJson;
  }, []);

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
        case 'map': return state.mapData.length > 0;
        default: return false;
      }
    },
    
    // Utilitário para verificar cache
    getCacheStatus: () => {
      if (typeof window === 'undefined') return null;
      
      const cacheInfo = {};
      ['8337', '3312'].forEach(creatorId => {
        const timestamp = localStorage.getItem(`mapCache_timestamp_${creatorId}`);
        const mapData = localStorage.getItem(`mapData_${creatorId}`);
        const geoJson = localStorage.getItem(`geoJson_${creatorId}`);
        
        if (timestamp && mapData && geoJson) {
          const age = Date.now() - parseInt(timestamp);
          const ageHours = Math.floor(age / (1000 * 60 * 60));
          const mapDataSize = Math.round(mapData.length / 1024);
          const geoJsonSize = Math.round(geoJson.length / 1024);
          
          cacheInfo[creatorId] = {
            cached: true,
            ageHours,
            mapDataSizeKB: mapDataSize,
            geoJsonSizeKB: geoJsonSize,
            totalSizeKB: mapDataSize + geoJsonSize
          };
        } else {
          cacheInfo[creatorId] = { cached: false };
        }
      });
      
      return cacheInfo;
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
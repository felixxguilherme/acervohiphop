/**
 * Hooks personalizados para consumir dados do AtoM
 * Fornece uma interface React para acessar os dados do acervo
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import atomService from '../services/atomService.js';

/**
 * Hook para buscar itens do acervo
 * @param {Object} params - Parâmetros de busca
 * @returns {Object} Estado da busca e funções
 */
export function useAtomItems(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await atomService.getItems(params);
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items: data?.results || [],
    total: data?.total || 0,
    loading,
    error,
    refetch: fetchItems,
    links: data?._links
  };
}

/**
 * Hook para buscar um item específico
 * @param {string} id - ID do item
 * @returns {Object} Estado do item
 */
export function useAtomItem(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getItem(id);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  return { item: data, loading, error };
}

/**
 * Hook para buscar coleções
 * @param {Object} params - Parâmetros de busca
 * @returns {Object} Estado das coleções
 */
export function useAtomCollections(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getCollections(params);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [JSON.stringify(params)]);

  return {
    collections: data?.results || [],
    total: data?.total || 0,
    loading,
    error
  };
}

/**
 * Hook para buscar atores/criadores
 * @param {Object} params - Parâmetros de busca
 * @returns {Object} Estado dos atores
 */
export function useAtomActors(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getActors(params);
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActors();
  }, [JSON.stringify(params)]);

  return {
    actors: data?.results || [],
    total: data?.total || 0,
    loading,
    error
  };
}

/**
 * Hook para busca textual
 * @param {string} query - Termo de busca
 * @param {Object} filters - Filtros adicionais
 * @returns {Object} Estado da busca
 */
export function useAtomSearch(query, filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (searchQuery, searchFilters = {}) => {
    if (!searchQuery || searchQuery.length < 2) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await atomService.search({
        q: searchQuery,
        ...searchFilters
      });
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(query, filters);
  }, [query, JSON.stringify(filters), search]);

  return {
    results: data?.results || [],
    total: data?.total || 0,
    facets: data?.facets || {},
    loading,
    error,
    search
  };
}

/**
 * Hook para dados do mapa
 * @returns {Object} Estado dos dados do mapa
 */
export function useAtomMap() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getMapData();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  return {
    locations: data?.locations || [],
    bounds: data?.bounds,
    center: data?.center,
    loading,
    error
  };
}

/**
 * Hook para estatísticas
 * @returns {Object} Estado das estatísticas
 */
export function useAtomStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getStatistics();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return {
    statistics: data,
    loading,
    error
  };
}

/**
 * Hook para taxonomias
 * @returns {Object} Estado das taxonomias
 */
export function useAtomTaxonomies() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getTaxonomies();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxonomies();
  }, []);

  return {
    subjects: data?.subjects?.terms || [],
    places: data?.places?.terms || [],
    creators: data?.creators?.terms || [],
    mediaTypes: data?.mediaTypes?.terms || [],
    loading,
    error
  };
}

/**
 * Hook para timeline
 * @returns {Object} Estado da timeline
 */
export function useAtomTimeline() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await atomService.getTimeline();
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  return {
    events: data?.events || [],
    dateRange: data?.dateRange,
    loading,
    error
  };
}

/**
 * Hook para sugestões de busca
 * @param {string} query - Termo parcial
 * @param {string} type - Tipo de sugestão
 * @returns {Object} Estado das sugestões
 */
export function useAtomSuggestions(query, type = 'all') {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const response = await atomService.getSuggestions(debouncedQuery, type);
        setSuggestions(response);
      } catch (err) {
        console.error('Erro ao buscar sugestões:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, type]);

  return { suggestions, loading };
}

/**
 * Hook para paginação
 * @param {number} total - Total de itens
 * @param {number} limit - Limite por página
 * @returns {Object} Estado da paginação
 */
export function useAtomPagination(total, limit = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(total / limit);
  const offset = (currentPage - 1) * limit;

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    offset,
    limit,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
}

/**
 * Hook para debounce
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em ms
 * @returns {any} Valor debounced
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para formatação de dados
 * @returns {Object} Funções de formatação
 */
export function useAtomFormatters() {
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  }, []);

  const formatDateRange = useCallback((startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    
    if (!end || start === end) return start;
    return `${start} - ${end}`;
  }, [formatDate]);

  const formatFileSize = useCallback((bytes) => {
    if (!bytes) return '';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }, []);

  const formatSubjects = useCallback((subjects) => {
    if (!subjects || !Array.isArray(subjects)) return [];
    
    return subjects.map(subject => 
      typeof subject === 'string' ? subject : subject.term
    );
  }, []);

  return {
    formatDate,
    formatDateRange,
    formatFileSize,
    formatSubjects
  };
}
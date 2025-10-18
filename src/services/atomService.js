/**
 * AtoM Service - Interface para a API real do AtoM
 * Este serviço fornece uma interface unificada para acessar os dados
 * do acervo Hip Hop DF usando a API REST real do AtoM através do proxy Next.js
 */

// AIDEV-NOTE: Removed all static mock data imports - using only real API

class AtomService {
  constructor() {
    // Usar API route local para evitar problemas de CORS
    this.baseUrl = '/api/acervo';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Faz requisição para a API através do proxy Next.js
   * @private
   */
  async _fetchFromApi(endpoint = '', params = {}) {
    // Se endpoint for vazio, usa apenas baseUrl
    // Se tiver endpoint, adiciona ao path
    const url = new URL(endpoint ? `${this.baseUrl}/${endpoint}` : this.baseUrl, window.location.origin);
    
    // Adiciona parâmetros de query
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    console.info('[AtomService] ➡️ Requesting', url.pathname + url.search);

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.error('[AtomService] ❌ Request failed', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    console.info('[AtomService] ✅ Response received', {
      total: data?.total ?? 0,
      count: Array.isArray(data?.results) ? data.results.length : 0
    });

    return data;
  }

  /**
   * Busca itens do acervo com filtros e paginação
   * @param {Object} params - Parâmetros de busca
   * @param {string} [params.parent] - ID da coleção pai
   * @param {number} [params.offset=0] - Offset para paginação
   * @param {number} [params.limit=10] - Limite de resultados
   * @param {string} [params.sort] - Campo para ordenação
   * @param {string} [params.order='asc'] - Ordem da classificação
   * @returns {Promise<Object>} Resposta da API com itens
   */
  async getItems(params = {}) {
    const {
      parent,
      offset = 0,
      limit = 10,
      sort,
      order
    } = params;

    // AIDEV-NOTE: Using real ATOM API via proxy for informationobjects endpoint
    try {
      const apiParams = { offset, limit };
      
      // Adiciona parent se fornecido (para filtrar por coleção)
      if (parent) {
        apiParams.parent = parent;
      }

      const response = await this._fetchFromApi('', apiParams);
      
      return {
        results: response.results || [],
        total: response.total || 0,
        offset,
        limit,
        _links: this._generateLinks('informationobjects', params, response.total || 0)
      };
    } catch (error) {
      console.error('❌ API falhou para getItems:', error.message);
      throw new Error(`Falha ao carregar itens: ${error.message}`);
    }
  }

  /**
   * Busca um item específico pelo ID/slug
   * @param {string} id - ID ou slug do item
   * @returns {Promise<Object>} Dados detalhados do item
   */
  async getItem(id) {
    // AIDEV-NOTE: Using real ATOM API for individual item details
    try {
      const response = await this._fetchFromApi(`informationobjects/${id}`);
      return response;
    } catch (error) {
      console.error(`❌ API falhou para item ${id}:`, error.message);
      throw new Error(`Falha ao carregar item ${id}: ${error.message}`);
    }
  }

  /**
   * Busca coleções (itens de nível superior)
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<Object>} Resposta com coleções
   */
  async getCollections(params = {}) {
    // AIDEV-NOTE: Using topLod=1 to get only top-level descriptions (collections)
    try {
      const apiParams = { 
        topLod: 1,
        limit: params.limit || 50,
        offset: params.offset || 0,
        sort: params.sort || 'alphabetic'
      };

      const response = await this._fetchFromApi('', apiParams);
      
      return {
        results: response.results || [],
        total: response.total || 0,
        offset: apiParams.offset,
        limit: apiParams.limit,
        _links: this._generateLinks('informationobjects', params, response.total || 0)
      };
    } catch (error) {
      console.error('❌ API falhou para coleções:', error.message);
      throw new Error(`Falha ao carregar coleções: ${error.message}`);
    }
  }

  /**
   * Busca itens com objetos digitais (imagens/mídia)
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<Object>} Resposta com itens de mídia
   */
  async getMediaItems(params = {}) {
    // AIDEV-NOTE: Using onlyMedia=1 to get only items with digital objects
    try {
      const apiParams = { 
        onlyMedia: 1,
        limit: params.limit || 20,
        offset: params.offset || 0,
        sort: params.sort || 'alphabetic'
      };

      const response = await this._fetchFromApi('', apiParams);
      
      return {
        results: response.results || [],
        total: response.total || 0,
        offset: apiParams.offset,
        limit: apiParams.limit,
        _links: this._generateLinks('informationobjects', params, response.total || 0)
      };
    } catch (error) {
      console.error('❌ API falhou para mídia:', error.message);
      throw new Error(`Falha ao carregar itens de mídia: ${error.message}`);
    }
  }

  /**
   * Busca atores/criadores - Not implemented in real API
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<Object>} Resposta com atores
   */
  async getActors(params = {}) {
    // AIDEV-NOTE: Actors endpoint not available in real API
    throw new Error('Endpoint de atores não disponível na API');
  }

  /**
   * Busca ator específico pelo ID - Not implemented in real API
   * @param {string} id - ID do ator
   * @returns {Promise<Object>} Dados do ator
   */
  async getActor(id) {
    // AIDEV-NOTE: Individual actor endpoint not available in real API
    throw new Error('Endpoint de ator individual não disponível na API');
  }

  /**
   * Busca avançada com suporte server-side
   * @param {Object} params - Parâmetros de busca
   * @param {string} [params.q] - Termo de busca
   * @param {string} [params.field='title'] - Campo de busca (title, identifier, scopeAndContent)
   * @param {string} [params.operator='and'] - Operador lógico (and, or, not)
   * @param {number} [params.offset=0] - Offset para paginação
   * @param {number} [params.limit=10] - Limite de resultados
   * @param {string} [params.startDate] - Data inicial (YYYY-MM-DD)
   * @param {string} [params.endDate] - Data final (YYYY-MM-DD)
   * @param {string} [params.sort] - Ordenação (alphabetic, date, identifier, lastUpdated)
   * @param {boolean} [params.onlyMedia] - Apenas itens com mídia
   * @param {boolean} [params.topLod] - Apenas descrições de nível superior
   * @returns {Promise<Object>} Resultados da busca
   */
  async search(params = {}) {
    const { 
      q, 
      field = 'title',
      operator = 'and',
      offset = 0, 
      limit = 10, 
      startDate, 
      endDate,
      sort = 'alphabetic',
      onlyMedia = false,
      topLod = false,
      subjects = [],
      places = [],
      dateRange = null
    } = params;
    
    // AIDEV-NOTE: Using real server-side search with sq0/sf0 parameters
    try {
      const apiParams = {
        offset,
        limit,
        sort
      };

      // Adiciona busca textual server-side
      if (q && q.trim() && q.trim() !== '*') {
        apiParams.sq0 = q.trim();
        apiParams.sf0 = field;
        apiParams.so0 = operator;
      }

      // Adiciona filtros de data
      if (startDate) apiParams.startDate = startDate;
      if (endDate) apiParams.endDate = endDate;

      // Adiciona filtros especiais
      if (onlyMedia) apiParams.onlyMedia = 1;
      if (topLod) apiParams.topLod = 1;

      console.info('[AtomService] 🔍 Search params:', {
        query: q,
        field,
        operator,
        apiParams
      });

      const response = await this._fetchFromApi('', apiParams);
      let results = response.results || [];

      console.info('[AtomService] 📨 Raw API response:', {
        total: response.total,
        resultsCount: results.length,
        hasSearchParams: !!apiParams.sq0
      });

      // Se usou busca server-side, retorna os resultados direto
      // Apenas aplica filtro client-side se não tiver usado sq0
      if (q && q.trim() && q.trim() !== '*' && !apiParams.sq0) {
        const searchTerm = q.toLowerCase().trim();
        results = results.filter(item => {
          const searchFields = [
            item.title,
            item.physical_characteristics,
            item.reference_code,
            ...(item.place_access_points || []),
            ...(item.subjects || [])
          ].filter(Boolean);
          
          const searchText = searchFields.join(' ').toLowerCase();
          return searchText.includes(searchTerm);
        });
      }

      // Aplica filtros por assunto
      if (subjects && subjects.length > 0) {
        results = results.filter(item => 
          item.subjects && item.subjects.some(subject => 
            subjects.includes(subject) || subjects.includes(subject.term)
          )
        );
      }

      // Aplica filtros por lugar
      if (places && places.length > 0) {
        results = results.filter(item =>
          item.place_access_points && item.place_access_points.some(place =>
            places.includes(place) || places.includes(place.name)
          )
        );
      }

      // Aplica filtro por data
      if (dateRange) {
        results = results.filter(item => {
          if (!item.creation_dates || item.creation_dates.length === 0) return false;
          const itemDate = new Date(item.creation_dates[0]);
          return this._isDateInRange(itemDate, dateRange);
        });
      }

      // Se usou busca server-side, retorna dados direto da API
      if (apiParams.sq0) {
        return {
          query: q,
          results: results,
          total: response.total || results.length,
          offset,
          limit,
          facets: this._generateFacetsFromApiData(results),
          _links: this._generateLinks('search', params, response.total || results.length)
        };
      }

      // Paginação client-side apenas para casos sem busca server-side
      const paginatedResults = results.slice(offset, offset + limit);

      return {
        query: q,
        results: paginatedResults,
        total: results.length,
        offset,
        limit,
        facets: this._generateFacetsFromApiData(results),
        _links: this._generateLinks('search', params, results.length)
      };

    } catch (error) {
      console.error('❌ API falhou na busca:', error.message);
      throw new Error(`Falha na busca: ${error.message}`);
    }
  }

  /**
   * Obtém dados para o mapa - Not implemented in real API
   * @returns {Promise<Object>} Dados de localização
   */
  async getMapData() {
    // AIDEV-NOTE: Map data endpoint not available in real API
    throw new Error('Endpoint de dados do mapa não disponível na API');
  }

  /**
   * Obtém dados estatísticos do acervo - Computed from real data
   * @returns {Promise<Object>} Estatísticas
   */
  async getStatistics() {
    // AIDEV-NOTE: Computing statistics from real API data
    const [allItems, collections, media] = await Promise.all([
      this.getItems({ limit: 1000 }),
      this.getCollections({ limit: 100 }),
      this.getMediaItems({ limit: 100 })
    ]);
    
    return {
      totalItems: allItems.total,
      totalCollections: collections.total,
      totalMedia: media.total,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Obtém taxonomias e vocabulários controlados
   * @returns {Promise<Object>} Dados de taxonomias combinadas
   */
  async getTaxonomies() {
    // AIDEV-NOTE: Using real taxonomy endpoints with discovered IDs
    try {
      const [subjects, places, genres, levels, actorTypes] = await Promise.all([
        this._fetchFromApi('taxonomies/35'), // Subjects
        this._fetchFromApi('taxonomies/42'), // Places  
        this._fetchFromApi('taxonomies/78'), // Genres
        this._fetchFromApi('taxonomies/34'), // Level of Description
        this._fetchFromApi('taxonomies/32')  // Actor Entity Type
      ]);

      return {
        subjects: {
          id: 35,
          name: 'Subjects',
          terms: subjects.map(item => ({ name: item.name, count: 0 }))
        },
        places: {
          id: 42,
          name: 'Places', 
          terms: places.map(item => ({ name: item.name, count: 0 }))
        },
        genres: {
          id: 78,
          name: 'Genres',
          terms: genres.map(item => ({ name: item.name, count: 0 }))
        },
        levels: {
          id: 34,
          name: 'Level of Description',
          terms: levels.map(item => ({ name: item.name, count: 0 }))
        },
        creators: {
          id: 32,
          name: 'Actor Types',
          terms: actorTypes.map(item => ({ name: item.name, count: 0 }))
        }
      };
    } catch (error) {
      console.error('❌ API falhou para taxonomias:', error.message);
      throw new Error(`Falha ao carregar taxonomias: ${error.message}`);
    }
  }

  /**
   * Obtém uma taxonomia específica
   * @param {number} id - ID da taxonomia
   * @returns {Promise<Array>} Termos da taxonomia
   */
  async getTaxonomy(id) {
    // AIDEV-NOTE: Direct access to individual taxonomy endpoints
    try {
      return await this._fetchFromApi(`taxonomies/${id}`);
    } catch (error) {
      console.warn(`API real falhou para taxonomia ${id}:`, error.message);
      return [];
    }
  }

  /**
   * Obtém dados da linha do tempo - Not implemented in real API
   * @returns {Promise<Object>} Eventos da timeline
   */
  async getTimeline() {
    // AIDEV-NOTE: Timeline endpoint not available in real API
    throw new Error('Endpoint de timeline não disponível na API');
  }

  /**
   * Obtém sugestões para autocomplete baseado em taxonomias reais
   * @param {string} query - Termo parcial
   * @param {string} [type='all'] - Tipo de sugestão (subjects, places, creators, all)
   * @returns {Promise<Array>} Lista de sugestões
   */
  async getSuggestions(query, type = 'all') {
    try {
      const suggestions = [];
      const lowerQuery = query.toLowerCase();

      // Get suggestions from real taxonomies
      const taxonomies = await this.getTaxonomies();
      
      if (type === 'all' || type === 'subjects') {
        taxonomies.subjects.terms
          .filter(term => term.name.toLowerCase().includes(lowerQuery))
          .forEach(term => suggestions.push({
            type: 'subject',
            value: term.name,
            count: term.count
          }));
      }

      if (type === 'all' || type === 'places') {
        taxonomies.places.terms
          .filter(term => term.name.toLowerCase().includes(lowerQuery))
          .forEach(term => suggestions.push({
            type: 'place',
            value: term.name,
            count: term.count
          }));
      }

      return suggestions.slice(0, 10);
    } catch (error) {
      console.error('❌ Erro ao buscar sugestões:', error.message);
      return [];
    }
  }

  // Métodos utilitários privados

  /**
   * Simula delay de rede
   * @private
   */
  async _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtém valor aninhado de um objeto
   * @private
   */
  _getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Gera links de paginação
   * @private
   */
  _generateLinks(endpoint, params, total) {
    const { offset = 0, limit = 10 } = params;
    const links = {
      self: { href: `${this.baseUrl}/${endpoint}?${new URLSearchParams(params)}` }
    };

    if (offset + limit < total) {
      links.next = {
        href: `${this.baseUrl}/${endpoint}?${new URLSearchParams({
          ...params,
          offset: offset + limit
        })}`
      };
    }

    if (offset > 0) {
      links.prev = {
        href: `${this.baseUrl}/${endpoint}?${new URLSearchParams({
          ...params,
          offset: Math.max(0, offset - limit)
        })}`
      };
    }

    return links;
  }

  /**
   * Verifica se uma data está dentro do intervalo especificado
   * @private
   */
  _isDateInRange(date, dateRange) {
    // Implementação simples - pode ser expandida conforme necessário
    const year = date.getFullYear();
    if (dateRange.includes('-')) {
      const [start, end] = dateRange.split('-').map(y => parseInt(y.trim()));
      return year >= start && year <= end;
    }
    return year.toString() === dateRange;
  }

  /**
   * Gera facetas para dados da API real
   * @private
   */
  _generateFacetsFromApiData(results) {
    const facets = {
      subjects: {},
      places: {},
      dates: {}
    };

    results.forEach(item => {
      // Facetas de assuntos (se existirem)
      if (item.subjects) {
        item.subjects.forEach(subject => {
          const term = typeof subject === 'string' ? subject : subject.term || subject;
          if (term) {
            facets.subjects[term] = (facets.subjects[term] || 0) + 1;
          }
        });
      }

      // Facetas de lugares
      if (item.place_access_points) {
        item.place_access_points.forEach(place => {
          const placeName = typeof place === 'string' ? place : place.name || place;
          if (placeName) {
            facets.places[placeName] = (facets.places[placeName] || 0) + 1;
          }
        });
      }

      // Facetas de datas (por década)
      if (item.creation_dates && item.creation_dates.length > 0) {
        const year = new Date(item.creation_dates[0]).getFullYear();
        const decade = `${Math.floor(year / 10) * 10}s`;
        facets.dates[decade] = (facets.dates[decade] || 0) + 1;
      }
    });

    // Converte para formato esperado
    return {
      subjects: Object.entries(facets.subjects)
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count),
      places: Object.entries(facets.places)
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count),
      dates: Object.entries(facets.dates)
        .map(([term, count]) => ({ term, count }))
        .sort((a, b) => b.count - a.count)
    };
  }

  // AIDEV-NOTE: Removed _generateFacets method that used static mock data

  /**
   * Busca itens de um artista específico usando múltiplas estratégias
   * @param {Object} artist - Configuração do artista
   * @param {number} [limit=100] - Limite de resultados
   * @returns {Promise<Object>} Resultados da busca
   */
  async getArtistItems(artist, limit = 100) {
    console.info(`[AtomService] 🎯 Buscando itens do artista: ${artist.name}`);

    // Estratégia 1: Busca por creator (mais específica)
    try {
      console.info(`[AtomService] Tentativa 1: Busca por creator "${artist.name}"`);
      const creatorResults = await this.getItems({
        creators: artist.name,
        limit
      });
      
      if (creatorResults.results.length > 0) {
        console.info(`[AtomService] ✅ Estratégia 1 funcionou: ${creatorResults.results.length} itens`);
        return {
          ...creatorResults,
          strategy: 'creator',
          artistKey: artist.key
        };
      }
    } catch (error) {
      console.warn(`[AtomService] ⚠️ Estratégia 1 falhou:`, error.message);
    }

    // Estratégia 2: Busca textual por título
    for (const searchTerm of artist.searchTerms) {
      try {
        console.info(`[AtomService] Tentativa 2: Busca textual "${searchTerm}"`);
        const titleResults = await this.search({
          sq0: searchTerm,
          sf0: 'title',
          so0: 'and',
          limit
        });
        
        if (titleResults.results.length > 0) {
          console.info(`[AtomService] ✅ Estratégia 2 funcionou: ${titleResults.results.length} itens`);
          return {
            ...titleResults,
            strategy: 'title_search',
            searchTerm,
            artistKey: artist.key
          };
        }
      } catch (error) {
        console.warn(`[AtomService] ⚠️ Busca por "${searchTerm}" falhou:`, error.message);
      }
    }

    // Estratégia 3: Busca por taxonomia de subjects
    try {
      console.info(`[AtomService] Tentativa 3: Busca por subjects "${artist.name}"`);
      const subjectResults = await this.getItems({
        subjects: artist.name,
        limit
      });
      
      if (subjectResults.results.length > 0) {
        console.info(`[AtomService] ✅ Estratégia 3 funcionou: ${subjectResults.results.length} itens`);
        return {
          ...subjectResults,
          strategy: 'subjects',
          artistKey: artist.key
        };
      }
    } catch (error) {
      console.warn(`[AtomService] ⚠️ Estratégia 3 falhou:`, error.message);
    }

    // Todas as estratégias falharam
    console.warn(`[AtomService] ❌ Nenhuma estratégia funcionou para ${artist.name}`);
    return {
      results: [],
      total: 0,
      strategy: 'none',
      artistKey: artist.key,
      error: 'Nenhuma estratégia de busca retornou resultados'
    };
  }

  /**
   * Busca itens de múltiplos artistas em paralelo
   * @param {Array} artists - Lista de configurações de artistas
   * @param {number} [limit=50] - Limite por artista
   * @returns {Promise<Array>} Array de resultados por artista
   */
  async getMultipleArtistsItems(artists, limit = 50) {
    console.info(`[AtomService] 🎭 Buscando itens de ${artists.length} artistas`);
    
    const promises = artists.map(artist => 
      this.getArtistItems(artist, limit).catch(error => ({
        results: [],
        total: 0,
        strategy: 'error',
        artistKey: artist.key,
        error: error.message
      }))
    );

    const results = await Promise.all(promises);
    
    // Log do resultado geral
    const summary = results.map(r => ({
      artist: r.artistKey,
      count: r.total,
      strategy: r.strategy
    }));
    
    console.info(`[AtomService] 📊 Resumo da busca por artistas:`, summary);
    
    return results;
  }
}

// Instância singleton
const atomService = new AtomService();

export default atomService;
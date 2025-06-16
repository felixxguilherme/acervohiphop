/**
 * AtoM Service - Simula a API do AtoM usando dados estáticos
 * Este serviço fornece uma interface unificada para acessar os dados
 * do acervo Hip Hop DF de forma similar à API REST do AtoM
 */

import atomActorsResponse from '../data/authors.js';
import atomCollectionsResponse from '../data/collections.js';
import atomItemsResponse from '../data/docItems.js';
import atomItemDetailResponse from '../data/item.js';
import atomMapResponse from '../data/mapa.js';
import atomSearchResponse from '../data/searchResp.js';
import atomStatisticsResponse from '../data/statistics.js';
import atomTaxonomiesResponse from '../data/taxonomies.js';
import atomTimelineResponse from '../data/timeline.js';

class AtomService {
  constructor() {
    this.baseUrl = '/api'; // Para futura integração com API real
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
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
      sort = 'createdAt',
      order = 'desc'
    } = params;

    // Simula delay da API
    await this._delay(100);

    let items = [...atomItemsResponse.results];

    // Filtro por coleção pai
    if (parent) {
      items = items.filter(item => item.parentId === parent);
    }

    // Ordenação
    items.sort((a, b) => {
      const aValue = this._getNestedValue(a, sort);
      const bValue = this._getNestedValue(b, sort);
      
      if (order === 'desc') {
        return bValue > aValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    // Paginação
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      results: paginatedItems,
      total: items.length,
      offset,
      limit,
      _links: this._generateLinks('informationobjects', params, items.length)
    };
  }

  /**
   * Busca um item específico pelo ID
   * @param {string} id - ID do item
   * @returns {Promise<Object>} Dados detalhados do item
   */
  async getItem(id) {
    await this._delay(80);

    // Para o exemplo, retorna sempre o item detalhado
    // Em uma implementação real, buscaria pelo ID específico
    if (id === 'ahhdf-001') {
      return atomItemDetailResponse;
    }

    // Busca nos dados básicos
    const item = atomItemsResponse.results.find(item => item.id === id);
    if (!item) {
      throw new Error(`Item ${id} não encontrado`);
    }

    return item;
  }

  /**
   * Busca coleções
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<Object>} Resposta com coleções
   */
  async getCollections(params = {}) {
    await this._delay(90);
    
    return {
      ...atomCollectionsResponse,
      _links: this._generateLinks('informationobjects', params, atomCollectionsResponse.total)
    };
  }

  /**
   * Busca atores/criadores
   * @param {Object} params - Parâmetros de busca
   * @returns {Promise<Object>} Resposta com atores
   */
  async getActors(params = {}) {
    await this._delay(100);
    
    return {
      ...atomActorsResponse,
      _links: this._generateLinks('actors', params, atomActorsResponse.total)
    };
  }

  /**
   * Busca ator específico pelo ID
   * @param {string} id - ID do ator
   * @returns {Promise<Object>} Dados do ator
   */
  async getActor(id) {
    await this._delay(80);
    
    const actor = atomActorsResponse.results.find(actor => actor.id === id);
    if (!actor) {
      throw new Error(`Ator ${id} não encontrado`);
    }
    
    return actor;
  }

  /**
   * Realiza busca textual no acervo
   * @param {Object} params - Parâmetros de busca
   * @param {string} params.q - Termo de busca
   * @param {number} [params.offset=0] - Offset para paginação
   * @param {number} [params.limit=10] - Limite de resultados
   * @param {string[]} [params.subjects] - Filtros por assunto
   * @param {string[]} [params.places] - Filtros por lugar
   * @param {string} [params.dateRange] - Filtro por período
   * @returns {Promise<Object>} Resultados da busca
   */
  async search(params = {}) {
    const { q, offset = 0, limit = 10, subjects, places, dateRange } = params;
    
    await this._delay(150);

    // Para demonstração, retorna dados pré-configurados
    // Em implementação real, faria busca nos dados
    if (q?.toLowerCase().includes('breaking')) {
      return {
        ...atomSearchResponse,
        query: q,
        offset,
        limit,
        _links: this._generateLinks('search', params, atomSearchResponse.total)
      };
    }

    // Busca genérica nos itens
    const results = atomItemsResponse.results.filter(item => {
      const searchText = `${item.title} ${item.scopeAndContent} ${item.subjects.join(' ')}`.toLowerCase();
      return searchText.includes(q?.toLowerCase() || '');
    });

    return {
      query: q,
      results: results.slice(offset, offset + limit),
      total: results.length,
      offset,
      limit,
      facets: this._generateFacets(results),
      _links: this._generateLinks('search', params, results.length)
    };
  }

  /**
   * Obtém dados para o mapa
   * @returns {Promise<Object>} Dados de localização
   */
  async getMapData() {
    await this._delay(120);
    return atomMapResponse;
  }

  /**
   * Obtém dados estatísticos do acervo
   * @returns {Promise<Object>} Estatísticas
   */
  async getStatistics() {
    await this._delay(100);
    return atomStatisticsResponse;
  }

  /**
   * Obtém taxonomias e vocabulários controlados
   * @returns {Promise<Object>} Dados de taxonomias
   */
  async getTaxonomies() {
    await this._delay(90);
    return atomTaxonomiesResponse;
  }

  /**
   * Obtém dados da linha do tempo
   * @returns {Promise<Object>} Eventos da timeline
   */
  async getTimeline() {
    await this._delay(110);
    return atomTimelineResponse;
  }

  /**
   * Obtém sugestões para autocomplete
   * @param {string} query - Termo parcial
   * @param {string} [type='all'] - Tipo de sugestão (subjects, places, creators, all)
   * @returns {Promise<Array>} Lista de sugestões
   */
  async getSuggestions(query, type = 'all') {
    await this._delay(50);
    
    const suggestions = [];
    const lowerQuery = query.toLowerCase();

    if (type === 'all' || type === 'subjects') {
      atomTaxonomiesResponse.subjects.terms
        .filter(term => term.name.toLowerCase().includes(lowerQuery))
        .forEach(term => suggestions.push({
          type: 'subject',
          value: term.name,
          count: term.count
        }));
    }

    if (type === 'all' || type === 'places') {
      atomTaxonomiesResponse.places.terms
        .filter(term => term.name.toLowerCase().includes(lowerQuery))
        .forEach(term => suggestions.push({
          type: 'place',
          value: term.name,
          count: term.count
        }));
    }

    if (type === 'all' || type === 'creators') {
      atomTaxonomiesResponse.creators.terms
        .filter(term => term.name.toLowerCase().includes(lowerQuery))
        .forEach(term => suggestions.push({
          type: 'creator',
          value: term.name,
          count: term.count
        }));
    }

    return suggestions.slice(0, 10);
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
   * Gera facetas para busca
   * @private
   */
  _generateFacets(results) {
    const facets = {
      subjects: {},
      places: {},
      dates: {}
    };

    results.forEach(item => {
      // Facetas de assuntos
      item.subjects.forEach(subject => {
        const term = typeof subject === 'string' ? subject : subject.term;
        facets.subjects[term] = (facets.subjects[term] || 0) + 1;
      });

      // Facetas de lugares
      item.places.forEach(place => {
        facets.places[place.name] = (facets.places[place.name] || 0) + 1;
      });

      // Facetas de datas (por década)
      if (item.dates.length > 0) {
        const year = new Date(item.dates[0].startDate).getFullYear();
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
}

// Instância singleton
const atomService = new AtomService();

export default atomService;
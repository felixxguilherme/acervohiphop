"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInformationObjects } from '../../services/atomApi.js';

const AdvancedSearch = ({ onSearch, onReset, initialFilters = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    q: '',
    field: 'title',
    operator: 'and',
    startDate: '',
    endDate: '',
    sort: 'alphabetic',
    onlyMedia: false,
    topLod: false,
    // AtoM 2.9 new filters
    languages: 'pt',
    levels: '',
    creators: '',
    subjects: '',
    genres: '',
    places: '',
    ...initialFilters
  });

  const [taxonomies, setTaxonomies] = useState({
    subjects: { terms: [] },
    places: { terms: [] },
    genres: { terms: [] },
    levels: { terms: [] }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Carregar taxonomias na inicialização - por enquanto desabilitado
    // TODO: Implementar endpoint de taxonomias na API local
    const loadTaxonomies = async () => {
      try {
        // const data = await getTaxonomies();
        // setTaxonomies(data);
      } catch (error) {
        console.error('Erro ao carregar taxonomias:', error);
      }
    };

    loadTaxonomies();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Mapear filtros do frontend para parâmetros da API AtoM 2.9
      const apiFilters = {
        sq0: filters.q,
        sf0: filters.field,
        so0: filters.operator,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sort: filters.sort,
        onlyMedia: filters.onlyMedia,
        topLod: filters.topLod,
        // AtoM 2.9 parameters
        languages: filters.languages,
        levels: filters.levels || undefined,
        creators: filters.creators || undefined,
        subjects: filters.subjects || undefined,
        genres: filters.genres || undefined,
        places: filters.places || undefined
      };
      await onSearch(apiFilters);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      q: '',
      field: 'title',
      operator: 'and',
      startDate: '',
      endDate: '',
      sort: 'alphabetic',
      onlyMedia: false,
      topLod: false,
      // AtoM 2.9 new filters
      languages: 'pt',
      levels: '',
      creators: '',
      subjects: '',
      genres: '',
      places: ''
    };
    setFilters(resetFilters);
    onReset?.();
  };

  const searchFields = [
    { value: 'title', label: 'Título' },
    { value: 'identifier', label: 'Identificador' },
    { value: 'scopeAndContent', label: 'Escopo e Conteúdo' }
  ];

  const sortOptions = [
    { value: 'alphabetic', label: 'Alfabética' },
    { value: 'date', label: 'Data' },
    { value: 'identifier', label: 'Identificador' },
    { value: 'lastUpdated', label: 'Última Atualização' }
  ];

  const searchOperators = [
    { value: 'and', label: 'E (AND)' },
    { value: 'or', label: 'OU (OR)' },
    { value: 'not', label: 'NÃO (NOT)' }
  ];

  const languageOptions = [
    { value: 'pt', label: 'Português' },
    { value: 'en', label: 'Inglês' },
    { value: 'es', label: 'Espanhol' }
  ];

  return (
    <div className="bg-white border-[3px] border-theme p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold font-sometype-mono text-theme uppercase">
          Busca Avançada
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-theme hover:bg-gray-100 p-2 border-[3px] border-theme transition-colors font-bold"
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Busca básica sempre visível */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="DIGITE SUA BUSCA..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="w-full px-4 py-3 bg-white border-[3px] border-theme text-theme placeholder-gray-500 focus:outline-none font-sometype-mono uppercase"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div>
          <select
            value={filters.field}
            onChange={(e) => handleFilterChange('field', e.target.value)}
            className="w-full px-4 py-3 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
          >
            {searchFields.map(field => (
              <option key={field.value} value={field.value} className="bg-white text-theme">
                {field.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filters.operator}
            onChange={(e) => handleFilterChange('operator', e.target.value)}
            className="w-full px-4 py-3 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
          >
            {searchOperators.map(operator => (
              <option key={operator.value} value={operator.value} className="bg-white text-theme">
                {operator.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full px-4 py-3 bg-black text-theme font-bold border-[3px] border-theme hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sometype-mono uppercase"
          >
            {loading ? 'BUSCANDO...' : 'BUSCAR'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="pt-6 border-t-[3px] border-theme">
              
              {/* Filtros Básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Ordenação</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-white text-theme">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Data Inicial</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
                  />
                </div>

                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Data Final</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
                  />
                </div>

                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Idioma</label>
                  <select
                    value={filters.languages}
                    onChange={(e) => handleFilterChange('languages', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
                  >
                    {languageOptions.map(lang => (
                      <option key={lang.value} value={lang.value} className="bg-white text-theme">
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filtros de Taxonomia AtoM 2.9 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Criador</label>
                  <input
                    type="text"
                    placeholder="Ex: Dino Black"
                    value={filters.creators}
                    onChange={(e) => handleFilterChange('creators', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme placeholder-gray-500 focus:outline-none font-sometype-mono"
                  />
                </div>

                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Assunto</label>
                  <input
                    type="text"
                    placeholder="Ex: Rap, Hip Hop"
                    value={filters.subjects}
                    onChange={(e) => handleFilterChange('subjects', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme placeholder-gray-500 focus:outline-none font-sometype-mono"
                  />
                </div>

                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Local</label>
                  <input
                    type="text"
                    placeholder="Ex: Candangolândia/DF"
                    value={filters.places}
                    onChange={(e) => handleFilterChange('places', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme placeholder-gray-500 focus:outline-none font-sometype-mono"
                  />
                </div>

                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Gênero (ID)</label>
                  <input
                    type="text"
                    placeholder="Ex: 78"
                    value={filters.genres}
                    onChange={(e) => handleFilterChange('genres', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme placeholder-gray-500 focus:outline-none font-sometype-mono"
                  />
                </div>
              </div>

              {/* Filtros Especiais */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">Nível (ID)</label>
                  <input
                    type="text"
                    placeholder="Ex: 34"
                    value={filters.levels}
                    onChange={(e) => handleFilterChange('levels', e.target.value)}
                    className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme placeholder-gray-500 focus:outline-none font-sometype-mono"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-theme text-xs font-bold font-sometype-mono uppercase">Filtros Rápidos</label>
                  <div className="space-y-2">
                    <label className="flex items-center text-theme text-xs font-sometype-mono">
                      <input
                        type="checkbox"
                        checked={filters.onlyMedia}
                        onChange={(e) => handleFilterChange('onlyMedia', e.target.checked)}
                        className="mr-3 scale-125"
                      />
                      APENAS COM IMAGENS
                    </label>
                    <label className="flex items-center text-theme text-xs font-sometype-mono">
                      <input
                        type="checkbox"
                        checked={filters.topLod}
                        onChange={(e) => handleFilterChange('topLod', e.target.checked)}
                        className="mr-3 scale-125"
                      />
                      APENAS COLEÇÕES
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-theme text-xs font-bold font-sometype-mono uppercase">Filtros Rápidos (Criador)</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFilterChange('creators', 'Dino Black')}
                      className="w-full px-3 py-2 bg-gray-100 border-[3px] border-theme text-theme hover:bg-gray-200 transition-colors font-sometype-mono text-xs"
                    >
                      DINO BLACK
                    </button>
                    <button
                      onClick={() => handleFilterChange('places', 'Candangolândia/DF')}
                      className="w-full px-3 py-2 bg-gray-100 border-[3px] border-theme text-theme hover:bg-gray-200 transition-colors font-sometype-mono text-xs"
                    >
                      CANDANGOLÂNDIA/DF
                    </button>
                  </div>
                </div>
              </div>

              {/* Taxonomias - Removido temporariamente pois não estão funcionando */}
              {/* 
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {taxonomies.subjects?.terms?.length > 0 && (
                  <div>
                    <label className="block text-theme text-xs font-bold mb-2 font-sometype-mono uppercase">
                      Assuntos ({taxonomies.subjects.terms.length})
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-white border-[3px] border-theme text-theme focus:outline-none font-sometype-mono"
                      onChange={(e) => handleFilterChange('subject', e.target.value)}
                    >
                      <option value="">SELECIONAR ASSUNTO...</option>
                      {taxonomies.subjects.terms.slice(0, 20).map((term, index) => (
                        <option key={index} value={term.name} className="bg-white text-theme">
                          {term.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div> */}

              {/* Botões de ação */}
              <div className="flex justify-between items-center pt-6">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white text-theme font-bold border-[3px] border-theme hover:bg-gray-100 transition-colors font-sometype-mono uppercase"
                >
                  LIMPAR FILTROS
                </button>
                
                <div className="text-theme text-xs font-sometype-mono uppercase">
                  ✨ Novos filtros AtoM 2.9: Criador, Assunto, Local, Idioma
                </div>
              </div>
            </div>
        )
      }
    </div>
  );
};

export default AdvancedSearch;
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInformationObjects } from '../../services/atomApi.js';

// Importar nossos novos componentes
import AdvancedSearch from './AdvancedSearch';
import CollectionBrowser from './CollectionBrowser';
import MediaGallery from './MediaGallery';
import TaxonomyFilter from './TaxonomyFilter';
import DateRangePicker from './DateRangePicker';

const AdvancedAcervoInterface = () => {
  const [activeMode, setActiveMode] = useState('search'); // 'search' | 'collections' | 'gallery' | 'filters'
  const [searchResults, setSearchResults] = useState([]);
  const [searchFilters, setSearchFilters] = useState({});
  const [taxonomyFilters, setTaxonomyFilters] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    collections: 0,
    mediaItems: 0,
    timeRange: ''
  });

  useEffect(() => {
    loadInitialStats();
  }, []);

  const loadInitialStats = async () => {
    try {
      const [allItems, collections, mediaItems] = await Promise.all([
        getInformationObjects({ limit: 39 }),
        getInformationObjects({ limit: 50, topLod: true }),
        getInformationObjects({ limit: 50, onlyMedia: true })
      ]);

      setStats({
        total: allItems.total || 0,
        collections: collections.total || 0,
        mediaItems: mediaItems.total || 0,
        timeRange: '1994-2025'
      });
      setApiError(null);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      if (error.message.includes('503') || error.message.includes('API')) {
        // Try to parse error details from API response
        let errorInfo = {
          title: 'Sistema do acervo temporariamente indisponível',
          message: 'Não foi possível conectar ao sistema de arquivo.',
          details: 'O servidor está temporariamente fora do ar.',
          troubleshooting: 'Tente novamente em alguns minutos.'
        };

        // If we have detailed error info from the API, use it
        try {
          const errorMatch = error.message.match(/503 API Error: (.+)/);
          if (errorMatch) {
            errorInfo.message = errorMatch[1];
          }
        } catch (parseError) {
          console.warn('Could not parse detailed error info');
        }

        setApiError(errorInfo);
      }
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const searchParams = {
        limit: 1000,
        offset: 0,
        ...taxonomyFilters
      };
      
      // Converter parâmetros para o formato da API
      if (filters.q) {
        searchParams.sq0 = filters.q;
        searchParams.sf0 = filters.field || 'title';
      }
      
      // Adicionar outros filtros (exceto q e field que já foram convertidos)
      const { q, field, ...otherFilters } = filters;
      Object.assign(searchParams, otherFilters);
      
      const results = await getInformationObjects(searchParams);
      
      if (results.results && results.results.length > 0) {
        results.results.forEach((item, index) => {
          console.log(`${index + 1}. ${item.title} (${item.reference_code || item.slug})`);
        });
      }
      
      setSearchResults(results.results || []);
      setSearchFilters(filters);
      setApiError(null);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      if (error.message.includes('503') || error.message.includes('API')) {
        setApiError({
          title: 'Busca temporariamente indisponível',
          message: 'Não foi possível realizar a busca no momento.',
          details: 'O sistema de arquivo está temporariamente fora do ar.',
          troubleshooting: 'Tente novamente em alguns minutos ou verifique sua conexão.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchReset = () => {
    setSearchResults([]);
    setSearchFilters({});
    setTaxonomyFilters({});
    setSelectedCollection(null);
    setApiError(null);
  };


  const handleTaxonomyFilter = (taxonomyKey, value) => {
    const newFilters = { ...taxonomyFilters };
    if (value) {
      newFilters[taxonomyKey] = value;
    } else {
      delete newFilters[taxonomyKey];
    }
    setTaxonomyFilters(newFilters);

    // Re-aplicar busca se houver filtros ativos
    if (Object.keys(searchFilters).length > 0 || Object.keys(newFilters).length > 0) {
      handleSearch({ ...searchFilters, ...newFilters });
    }
  };

  const handleDateRangeChange = (startDate, endDate) => {
    const newFilters = { ...searchFilters };
    if (startDate) newFilters.startDate = startDate;
    else delete newFilters.startDate;
    if (endDate) newFilters.endDate = endDate;
    else delete newFilters.endDate;
    
    setSearchFilters(newFilters);
    handleSearch(newFilters);
  };

  const modes = [
    { 
      key: 'search', 
      label: 'BUSCA AVANÇADA',
      description: 'Busque no acervo com filtros avançados'
    },
    { 
      key: 'collections', 
      label: 'COLEÇÕES',
      description: `Explore ${stats.collections} coleções organizadas`
    },
    { 
      key: 'gallery', 
      label: 'GALERIA',
      description: `${stats.mediaItems} imagens e documentos digitais`
    },
    { 
      key: 'filters', 
      label: 'FILTROS',
      description: 'Filtros por categorias e taxonomias'
    }
  ];

  const ModeSelector = () => (
    <div className="bg-white border-[3px] border-black p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => setActiveMode(mode.key)}
            className={`
              p-6 border-[3px] border-black transition-all text-center font-sometype-mono
              ${activeMode === mode.key
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
              }
            `}
          >
            <div className="font-bold text-sm mb-2 uppercase">{mode.label}</div>
            <div className="text-xs">{mode.description}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const StatsBar = () => (
    <div className="bg-white border-[3px] border-black p-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="border-[3px] border-black p-4 bg-white">
          <div className="text-3xl font-black font-sometype-mono text-black">{stats.total}</div>
          <div className="text-black text-xs font-bold uppercase tracking-wider mt-2">Total de Itens</div>
        </div>
        <div className="border-[3px] border-black p-4 bg-black">
          <div className="text-3xl font-black font-sometype-mono text-white">{stats.collections}</div>
          <div className="text-white text-xs font-bold uppercase tracking-wider mt-2">Coleções</div>
        </div>
        <div className="border-[3px] border-black p-4 bg-white">
          <div className="text-3xl font-black font-sometype-mono text-black">{stats.mediaItems}</div>
          <div className="text-black text-xs font-bold uppercase tracking-wider mt-2">Imagens</div>
        </div>
        <div className="border-[3px] border-black p-4 bg-black">
          <div className="text-3xl font-black font-sometype-mono text-white">{stats.timeRange}</div>
          <div className="text-white text-xs font-bold uppercase tracking-wider mt-2">Período</div>
        </div>
      </div>
    </div>
  );

  const ResultsSection = () => {
    if (searchResults.length === 0 && Object.keys(searchFilters).length === 0) {
      return null;
    }

    return (
      <div className="mt-8">
        <div className="bg-white border-[3px] border-black p-6">
          <h3 className="text-xl font-bold font-sometype-mono text-black mb-6 uppercase">
            Resultados da Busca ({searchResults.length})
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-black font-sometype-mono">
                Buscando...
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-black">
              <div className="text-lg font-bold mb-2">Nenhum resultado encontrado</div>
              <div className="text-sm">Tente ajustar os filtros de busca</div>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((item, index) => (
                <div
                  key={item.slug || index}
                  className="bg-white border-[3px] border-black p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-black font-sometype-mono text-sm uppercase">
                        {item.title || 'Sem título'}
                      </div>
                      <div className="text-xs text-black font-sometype-mono mt-1">
                        ID: {item.reference_code || item.slug || 'N/A'}
                      </div>
                    </div>
                    <div className="text-xs text-black font-sometype-mono opacity-50">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="bg-black border-[3px] border-black p-8 mb-6">
          <h1 className="text-4xl font-black font-sometype-mono text-white uppercase tracking-wider">
            ACERVO HIP HOP DF
          </h1>
        </div>
        <p className="text-black font-sometype-mono text-sm max-w-2xl mx-auto uppercase">
          Sistema de busca e navegação do acervo
        </p>
        
        {/* API Error indicator */}
        {apiError && (
          <div className="bg-white border-[3px] border-black p-6 mt-6 mx-auto max-w-4xl">
            <div className="text-center">
              <h3 className="text-lg font-bold font-sometype-mono text-black uppercase mb-3">
                {apiError.title}
              </h3>
              <p className="text-black font-sometype-mono text-sm mb-3">
                {apiError.message}
              </p>
              <p className="text-black font-sometype-mono text-xs opacity-70 mb-2">
                {apiError.details}
              </p>
              {apiError.troubleshooting && (
                <p className="text-black font-sometype-mono text-xs opacity-50">
                  💡 {apiError.troubleshooting}
                </p>
              )}
              <div className="mt-4">
                <button
                  onClick={loadInitialStats}
                  className="px-6 py-2 bg-black text-white font-bold font-sometype-mono border-[3px] border-black hover:bg-gray-800 transition-colors uppercase text-xs"
                >
                  Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <StatsBar />

      {/* Mode Selector */}
      <ModeSelector />

      {/* Content based on active mode */}
      <div className="space-y-8">
          {activeMode === 'search' && (
            <div className="space-y-6">
              <AdvancedSearch 
                onSearch={handleSearch}
                onReset={handleSearchReset}
                initialFilters={searchFilters}
              />
              
              {/* Date Range */}
              <DateRangePicker
                onDateRangeChange={handleDateRangeChange}
                startDate={searchFilters.startDate}
                endDate={searchFilters.endDate}
              />
              
              <ResultsSection />
            </div>
          )}

          {activeMode === 'collections' && (
            <CollectionBrowser 
              onSelectCollection={setSelectedCollection}
              selectedCollection={selectedCollection}
            />
          )}

          {activeMode === 'gallery' && (
            <MediaGallery 
              filters={searchFilters}
              onItemSelect={(item) => console.log('Item selecionado:', item)}
            />
          )}

          {activeMode === 'filters' && (
            <div className="space-y-8">
              <TaxonomyFilter 
                onFilterChange={handleTaxonomyFilter}
                selectedFilters={taxonomyFilters}
              />
              
              {Object.keys(taxonomyFilters).length > 0 && (
                <div className="bg-white border-[3px] border-black p-6">
                  <div className="text-black font-bold font-sometype-mono mb-4 uppercase">Aplicar Filtros:</div>
                  <button
                    onClick={() => handleSearch(taxonomyFilters)}
                    className="px-6 py-3 bg-black text-white font-bold font-sometype-mono border-[3px] border-black hover:bg-gray-800 transition-colors uppercase"
                  >
                    Buscar com Filtros Selecionados
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Footer */}
      <div className="text-center py-8 border-t-[3px] border-black mt-12">
        <div className="text-black text-xs font-sometype-mono uppercase">
          Interface de busca do acervo • Sistema AtoM 2.7
        </div>
      </div>
    </div>
  );
};

export default AdvancedAcervoInterface;
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchByCreator, searchBySubject, searchByPlace, searchByGenre } from '../../services/atomApi.js';

const TaxonomyFilter = ({ onFilterChange, selectedFilters = {} }) => {
  const [taxonomies, setTaxonomies] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    subjects: false,
    places: false,
    genres: false,
    levels: false
  });
  const [searchTerms, setSearchTerms] = useState({
    subjects: '',
    places: '',
    genres: '',
    levels: ''
  });

  useEffect(() => {
    loadTaxonomies();
  }, []);

  const loadTaxonomies = async () => {
    setLoading(true);
    try {
      // AtoM 2.9: Criar taxonomias mock baseadas nos dados reais do acervo
      const data = {
        creators: {
          terms: [
            { name: 'Dino Black', count: 39 },
            { name: 'GOG', count: 1 }
          ]
        },
        subjects: {
          terms: [
            { name: 'Rap', count: 25 },
            { name: 'Hip Hop', count: 20 },
            { name: 'Batalha', count: 5 },
            { name: 'Dino Black', count: 39 }
          ]
        },
        places: {
          terms: [
            { name: 'Candangolândia/DF', count: 38 },
            { name: 'Rio de Janeiro/RJ', count: 1 }
          ]
        },
        genres: {
          terms: [
            { name: 'Photographs', count: 3 },
            { name: 'Music', count: 6 },
            { name: 'Correspondence', count: 2 }
          ]
        }
      };
      
      setTaxonomies(data);
      
      // Auto-expandir seções com filtros ativos
      const newExpanded = { ...expandedSections };
      Object.keys(selectedFilters).forEach(key => {
        if (selectedFilters[key] && data[key]) {
          newExpanded[key] = true;
        }
      });
      setExpandedSections(newExpanded);
      
    } catch (error) {
      console.error('Erro ao carregar taxonomias:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterSelect = (taxonomyKey, termName) => {
    onFilterChange?.(taxonomyKey, termName);
  };

  const clearFilter = (taxonomyKey) => {
    onFilterChange?.(taxonomyKey, null);
  };

  const clearAllFilters = () => {
    Object.keys(taxonomies).forEach(key => {
      onFilterChange?.(key, null);
    });
  };

  const filterTerms = (terms, searchTerm) => {
    if (!searchTerm.trim()) return terms.slice(0, 20); // Mostrar apenas 20 por padrão
    return terms.filter(term => 
      term.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 50); // Mais resultados ao buscar
  };

  const getSelectedCount = () => {
    return Object.values(selectedFilters).filter(Boolean).length;
  };

  const getTaxonomyIcon = (key) => {
    const icons = {
      subjects: '🏷️',
      places: '📍',
      genres: '🎭',
      levels: '📊',
      creators: '👥'
    };
    return icons[key] || '📋';
  };

  const getTaxonomyLabel = (key) => {
    const labels = {
      subjects: 'Assuntos',
      places: 'Lugares',
      genres: 'Gêneros',
      levels: 'Níveis',
      creators: 'Criadores'
    };
    return labels[key] || key;
  };

  const TaxonomySection = ({ taxonomyKey, taxonomy }) => {
    const isExpanded = expandedSections[taxonomyKey];
    const searchTerm = searchTerms[taxonomyKey];
    const selectedValue = selectedFilters[taxonomyKey];
    const filteredTerms = filterTerms(taxonomy.terms, searchTerm);

    return (
      <div className="border border-yellow-400/30 rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => toggleSection(taxonomyKey)}
          className="w-full flex items-center justify-between p-4 bg-black/30 hover:bg-black/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{getTaxonomyIcon(taxonomyKey)}</span>
            <div className="text-left">
              <div className="text-yellow-400 font-medium">
                {getTaxonomyLabel(taxonomyKey)}
              </div>
              <div className="text-yellow-100/60 text-sm">
                {taxonomy.terms.length} termos
                {selectedValue && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-400/20 text-yellow-400 rounded text-xs">
                    Filtrado
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedValue && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter(taxonomyKey);
                }}
                className="text-red-400 hover:text-red-300 transition-colors"
                title="Limpar filtro"
              >
                ⊗
              </button>
            )}
            <span className={`text-yellow-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
              ▶
            </span>
          </div>
        </button>

        {/* Conteúdo Expandível */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-black/20">
                {/* Campo de Busca */}
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder={`Buscar em ${getTaxonomyLabel(taxonomyKey).toLowerCase()}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerms(prev => ({
                      ...prev,
                      [taxonomyKey]: e.target.value
                    }))}
                    className="w-full px-3 py-2 bg-black/50 border border-yellow-400/30 rounded text-yellow-100 placeholder-yellow-400/50 focus:border-yellow-400 focus:outline-none text-sm"
                  />
                </div>

                {/* Lista de Termos */}
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredTerms.length === 0 ? (
                    <div className="text-yellow-100/50 text-sm text-center py-4">
                      {searchTerm ? 'Nenhum termo encontrado' : 'Nenhum termo disponível'}
                    </div>
                  ) : (
                    filteredTerms.map((term, index) => {
                      const isSelected = selectedValue === term.name;
                      return (
                        <motion.button
                          key={`${term.name}-${index}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          onClick={() => handleFilterSelect(taxonomyKey, term.name)}
                          className={`
                            w-full text-left px-3 py-2 rounded text-sm transition-colors
                            ${isSelected 
                              ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' 
                              : 'hover:bg-yellow-400/10 text-yellow-100 hover:text-yellow-300'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate flex-1">{term.name}</span>
                            {term.count > 0 && (
                              <span className="text-yellow-400/70 text-xs ml-2">
                                {term.count}
                              </span>
                            )}
                            {isSelected && (
                              <span className="text-yellow-400 ml-2">✓</span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </div>

                {/* Mostrar mais */}
                {!searchTerm && taxonomy.terms.length > 20 && (
                  <div className="mt-3 text-center">
                    <div className="text-yellow-100/50 text-xs">
                      Mostrando 20 de {taxonomy.terms.length} termos. Use a busca para encontrar mais.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-yellow-400">
            <span className="animate-spin mr-2">⏳</span>
            Carregando filtros...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-scratchy text-yellow-400 flex items-center">
          <span className="mr-2">🏛️</span>
          Filtros por Categoria
        </h3>
        
        {getSelectedCount() > 0 && (
          <div className="flex items-center space-x-3">
            <span className="text-yellow-400/70 text-sm">
              {getSelectedCount()} filtro{getSelectedCount() > 1 ? 's' : ''} ativo{getSelectedCount() > 1 ? 's' : ''}
            </span>
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-red-600/80 text-theme text-sm rounded hover:bg-red-600 transition-colors"
            >
              Limpar Todos
            </button>
          </div>
        )}
      </div>

      {/* Filtros Ativos */}
      {getSelectedCount() > 0 && (
        <div className="mb-6 p-3 bg-yellow-400/10 border border-yellow-400/30 rounded">
          <div className="text-yellow-400 font-medium text-sm mb-2">Filtros Ativos:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (!value) return null;
              return (
                <span
                  key={key}
                  className="flex items-center px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded text-sm"
                >
                  <span className="mr-1">{getTaxonomyIcon(key)}</span>
                  {value}
                  <button
                    onClick={() => clearFilter(key)}
                    className="ml-2 text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista de Taxonomias */}
      <div className="space-y-4">
        {Object.entries(taxonomies).map(([key, taxonomy]) => {
          if (!taxonomy.terms || taxonomy.terms.length === 0) return null;
          
          return (
            <TaxonomySection
              key={key}
              taxonomyKey={key}
              taxonomy={taxonomy}
            />
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-yellow-400/20 text-center text-sm text-yellow-100/70">
        💡 Use os filtros para refinar sua busca no acervo
      </div>
    </div>
  );
};

export default TaxonomyFilter;
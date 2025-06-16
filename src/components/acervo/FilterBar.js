/**
 * Barra de Filtros Visual para o Acervo
 * Interface inspirada no Hip Hop com filtros temáticos
 */

'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useAtomTaxonomies, useAtomStatistics } from '../../hooks/useAtom.js';

const FILTER_THEMES = [
  {
    id: 'breaking',
    name: 'Breaking',
    icon: '🕺',
    gradient: 'from-orange-500 to-[#df8d6d]',
    description: 'B-boys, B-girls e battles'
  },
  {
    id: 'grafite',
    name: 'Grafite',
    icon: '🎨',
    gradient: 'from-green-500 to-blue-500',
    description: 'Arte urbana e murais'
  },
  {
    id: 'rap',
    name: 'Rap',
    icon: '🎤',
    gradient: 'from-purple-500 to-pink-500',
    description: 'MCs, letras e flows'
  },
  {
    id: 'dj',
    name: 'DJ',
    icon: '🎧',
    gradient: 'from-blue-500 to-indigo-500',
    description: 'Discos, mixagens e beats'
  }
];

export default function FilterBar({ onFilterChange, activeFilters = [], searchTerm, onSearchChange }) {
  const { subjects, places, loading } = useAtomTaxonomies();
  const { statistics } = useAtomStatistics();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleThemeFilter = (themeId) => {
    const isActive = activeFilters.includes(themeId);
    if (isActive) {
      onFilterChange(activeFilters.filter(f => f !== themeId));
    } else {
      onFilterChange([...activeFilters, themeId]);
    }
  };

  const getThemeCount = (themeId) => {
    const subject = subjects.find(s => 
      s.name.toLowerCase().includes(themeId.toLowerCase())
    );
    return subject?.count || 0;
  };

  return (
    <div className="bg-black/80 backdrop-blur-md border-b border-white/30 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar no acervo... (artista, local, ano, tema)"
              className="w-full bg-white/10 border border-white/30 rounded-full px-6 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#df8d6d] focus:border-transparent backdrop-blur-sm"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Theme Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {FILTER_THEMES.map((theme) => {
            const isActive = activeFilters.includes(theme.id);
            const count = getThemeCount(theme.id);
            
            return (
              <motion.button
                key={theme.id}
                onClick={() => handleThemeFilter(theme.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl p-4 transition-all duration-300 ${
                  isActive 
                    ? 'ring-2 ring-[#df8d6d] transform scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                }`} />
                
                <div className="relative z-10 text-center">
                  <div className="text-3xl mb-2">{theme.icon}</div>
                  <div className="font-bold text-white text-lg">{theme.name}</div>
                  <div className="text-white/80 text-sm">{theme.description}</div>
                  {count > 0 && (
                    <div className="mt-2 inline-block bg-black/30 rounded-full px-2 py-1 text-xs text-white">
                      {count} itens
                    </div>
                  )}
                </div>

                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-[#df8d6d] rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Advanced Filters Toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-white/80 hover:text-white text-sm flex items-center gap-2 mx-auto transition-colors"
          >
            <span>Filtros avançados</span>
            <motion.svg
              animate={{ rotate: showAdvanced ? 180 : 0 }}
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </div>

        {/* Advanced Filters */}
        <motion.div
          initial={false}
          animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pt-6 grid md:grid-cols-2 gap-6">
            {/* Places Filter */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                📍 Regiões Administrativas
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {places.slice(0, 10).map((place) => (
                  <button
                    key={place.id}
                    onClick={() => onSearchChange(place.name)}
                    className="text-left text-sm bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-white transition-colors"
                  >
                    <span className="font-medium">{place.name}</span>
                    <span className="text-white/60 ml-2">({place.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Years Filter */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                📅 Períodos
              </h3>
              {statistics?.byYear && (
                <div className="grid grid-cols-2 gap-2">
                  {statistics.byYear.map((period) => (
                    <button
                      key={period.year}
                      onClick={() => onSearchChange(period.year)}
                      className="text-left text-sm bg-white/10 hover:bg-white/20 rounded px-3 py-2 text-white transition-colors"
                    >
                      <span className="font-medium">{period.year}</span>
                      <span className="text-white/60 ml-2">({period.count})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <span className="text-white/80 text-sm">Filtros ativos:</span>
            {activeFilters.map((filter) => {
              const theme = FILTER_THEMES.find(t => t.id === filter);
              return (
                <motion.div
                  key={filter}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 bg-[#df8d6d]/20 border border-[#df8d6d]/50 rounded-full px-3 py-1 text-sm text-[#df8d6d]"
                >
                  <span>{theme?.icon}</span>
                  <span>{theme?.name}</span>
                  <button
                    onClick={() => handleThemeFilter(filter)}
                    className="ml-1 hover:text-[#df8d6d]"
                  >
                    ×
                  </button>
                </motion.div>
              );
            })}
            <button
              onClick={() => onFilterChange([])}
              className="text-white/60 hover:text-white text-sm underline"
            >
              Limpar todos
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
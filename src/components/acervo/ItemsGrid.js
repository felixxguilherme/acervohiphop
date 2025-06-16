/**
 * Grid de Itens do Acervo com Paginação
 * Layout responsivo estilo galeria com lazy loading
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomItems, useAtomSearch, useAtomPagination } from '../../hooks/useAtom.js';
import ItemCard from './ItemCard.js';

const ITEMS_PER_PAGE = 12;

const LAYOUT_OPTIONS = [
  { id: 'grid', icon: '⊞', name: 'Grade' },
  { id: 'masonry', icon: '⊟', name: 'Mosaico' },
  { id: 'list', icon: '☰', name: 'Lista' }
];

const SORT_OPTIONS = [
  { id: 'createdAt', name: 'Mais recentes', order: 'desc' },
  { id: 'title', name: 'Título A-Z', order: 'asc' },
  { id: 'dates', name: 'Mais antigos', order: 'asc' },
  { id: 'relevance', name: 'Relevância', order: 'desc' }
];

export default function ItemsGrid({ searchTerm, activeFilters }) {
  const [layout, setLayout] = useState('grid');
  const [sortOption, setSortOption] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  const { 
    currentPage, 
    totalPages, 
    offset, 
    goToPage, 
    nextPage, 
    prevPage, 
    hasNext, 
    hasPrev,
    resetPage 
  } = useAtomPagination(0, ITEMS_PER_PAGE);

  // Use search if there's a search term, otherwise use regular items
  const useSearchMode = searchTerm && searchTerm.length > 2;
  
  const { 
    results: searchResults, 
    total: searchTotal, 
    loading: searchLoading 
  } = useAtomSearch(useSearchMode ? searchTerm : '', {
    offset,
    limit: ITEMS_PER_PAGE,
    sort: sortOption,
    order: sortOrder
  });

  const { 
    items, 
    total: itemsTotal, 
    loading: itemsLoading 
  } = useAtomItems({
    offset: useSearchMode ? 0 : offset,
    limit: useSearchMode ? 0 : ITEMS_PER_PAGE,
    sort: sortOption,
    order: sortOrder
  });

  // Determine which data to use
  const displayItems = useSearchMode ? searchResults : items;
  const totalItems = useSearchMode ? searchTotal : itemsTotal;
  const loading = useSearchMode ? searchLoading : itemsLoading;

  // Update pagination when total changes
  useEffect(() => {
    // Reset to first page when search term changes
    resetPage();
  }, [searchTerm, resetPage]);

  // Filter items by active filters
  const filteredItems = displayItems.filter(item => {
    if (activeFilters.length === 0) return true;
    
    const itemSubjects = item.subjects.map(s => 
      typeof s === 'string' ? s.toLowerCase() : s.term.toLowerCase()
    );
    
    return activeFilters.some(filter => 
      itemSubjects.some(subject => subject.includes(filter))
    );
  });

  const handleSortChange = (option) => {
    const sortConfig = SORT_OPTIONS.find(s => s.id === option);
    setSortOption(option);
    setSortOrder(sortConfig.order);
    resetPage();
  };

  if (loading && displayItems.length === 0) {
    return <LoadingGrid />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {/* Header com controles - Brutalista */}
      <div className="bg-white/30 backdrop-blur-sm border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-400 border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl font-black text-black">
                {filteredItems.length.toLocaleString()}
              </span>
              <span className="text-black font-bold ml-2 uppercase">
                {useSearchMode ? 'RESULTADOS' : 'ITENS'}
                {searchTerm && (
                  <span className="ml-1">PARA "{searchTerm.toUpperCase()}"</span>
                )}
              </span>
            </div>

            {activeFilters.length > 0 && (
              <div className="bg-black text-white px-3 py-2 border-2 border-white font-black text-sm">
                • {activeFilters.length} FILTRO{activeFilters.length > 1 ? 'S' : ''} ATIVO{activeFilters.length > 1 ? 'S' : ''}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort dropdown - Brutalista */}
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-white border-4 border-black px-4 py-3 text-black font-bold focus:outline-none focus:bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id} className="bg-white font-bold">
                  {option.name.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Layout switcher - Brutalista */}
            <div className="flex border-4 border-black bg-white">
              {LAYOUT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setLayout(option.id)}
                  className={`px-4 py-3 text-lg transition-all font-black ${
                    layout === option.id
                      ? 'bg-yellow-400 text-black shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'text-black hover:bg-yellow-200'
                  }`}
                  title={option.name}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de itens */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${layout}-${searchTerm}-${activeFilters.join(',')}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={getGridClass(layout)}
        >
          {filteredItems.map((item, index) => (
            <ItemCard
              key={item.id}
              item={item}
              index={index}
              layout={layout}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state - Brutalista */}
      {!loading && filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="bg-white/30 backdrop-blur-sm border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-4xl font-black text-black mb-4 bg-yellow-400 inline-block px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              NENHUM ITEM ENCONTRADO
            </h3>
            <p className="text-black font-bold text-lg mb-8 bg-white/50 p-4 border-2 border-black">
              {searchTerm 
                ? `NÃO ENCONTRAMOS ITENS PARA "${searchTerm.toUpperCase()}"`
                : 'TENTE AJUSTAR OS FILTROS OU BUSCAR POR OUTROS TERMOS'
              }
            </p>
            <div className="bg-black text-white p-6 border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <p className="font-black text-yellow-400 mb-4">💡 DICAS DE BUSCA:</p>
              <div className="space-y-2 text-white font-bold">
                <p>• TENTE TERMOS COMO "BREAKING", "GRAFITE", "CEILÂNDIA"</p>
                <p>• USE NOMES DE ARTISTAS, LOCAIS OU ANOS</p>
                <p>• REMOVA ALGUNS FILTROS PARA EXPANDIR OS RESULTADOS</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && filteredItems.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onNext={nextPage}
          onPrev={prevPage}
        />
      )}

      {/* Loading overlay for page changes */}
      {loading && displayItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-3 text-white">
              <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
              <span>Carregando itens...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Helper function to get grid classes based on layout
function getGridClass(layout) {
  switch (layout) {
    case 'masonry':
      return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6';
    case 'list':
      return 'space-y-4';
    default: // grid
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
  }
}

// Loading grid component
function LoadingGrid() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/10 rounded-lg h-80 mb-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pagination component - Brutalista
function Pagination({ currentPage, totalPages, onPageChange, hasNext, hasPrev, onNext, onPrev }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center gap-4 mt-12"
    >
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        className="px-6 py-3 bg-white border-4 border-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        ← ANTERIOR
      </button>

      <div className="flex gap-2 border-4 border-black bg-white">
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-12 h-12 transition-colors font-black ${
              page === currentPage
                ? 'bg-yellow-400 text-black shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black hover:bg-yellow-200'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!hasNext}
        className="px-6 py-3 bg-white border-4 border-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        PRÓXIMA →
      </button>
    </motion.div>
  );
}
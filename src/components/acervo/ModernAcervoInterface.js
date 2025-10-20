"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getInformationObjects, searchByCreator, searchBySubject, searchByPlace } from '../../services/atomApi.js';

// Componente principal da nova interface AtoM 2.9
const ModernAcervoInterface = () => {
  // Estados principais
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  // Estados de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [searchOperator, setSearchOperator] = useState('and');

  // Estados de filtros
  const [filters, setFilters] = useState({
    creators: '',
    subjects: '',
    places: '',
    genres: '',
    languages: 'pt',
    startDate: '',
    endDate: '',
    onlyMedia: false,
    topLod: false
  });

  // Estados de paginação e ordenação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('alphabetic');

  // Estados de interface
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Carregar dados iniciais
  useEffect(() => {
    loadItems();
  }, [currentPage, sortBy]);

  // Carregar todos os itens na inicialização
  useEffect(() => {
    loadAllItems();
  }, []);

  // Função para carregar todos os itens (inicial)
  const loadAllItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getInformationObjects({
        limit: itemsPerPage,
        sort: 'alphabetic',
        languages: 'pt'
      });
      
      setItems(response.results || []);
      setTotalItems(response.total || 0);
      
    } catch (err) {
      console.error('❌ Erro ao carregar itens iniciais:', err);
      setError('Erro ao carregar itens do acervo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      
      const params = {
        limit: itemsPerPage,
        skip: offset,
        sort: sortBy,
        languages: 'pt'
      };

      // Adicionar filtros se existirem
      if (searchTerm && searchTerm.trim()) {
        params.sq0 = searchTerm.trim();
        params.sf0 = searchField;
        params.so0 = searchOperator;
      }
      
      if (filters.creators && filters.creators.trim()) params.creators = filters.creators.trim();
      if (filters.subjects && filters.subjects.trim()) params.subjects = filters.subjects.trim();
      if (filters.places && filters.places.trim()) params.places = filters.places.trim();
      if (filters.genres && filters.genres.trim()) params.genres = filters.genres.trim();
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.onlyMedia) params.onlyMedia = true;
      if (filters.topLod) params.topLod = true;

      const response = await getInformationObjects(params);
      
      setItems(response.results || []);
      setTotalItems(response.total || 0);
      
    } catch (err) {
      console.error('❌ Erro ao carregar itens:', err);
      setError('Erro ao carregar itens do acervo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadItems();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    loadItems();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      creators: '',
      subjects: '',
      places: '',
      genres: '',
      languages: 'pt',
      startDate: '',
      endDate: '',
      onlyMedia: false,
      topLod: false
    });
    setCurrentPage(1);
    loadItems();
  };

  const quickFilter = async (type, value) => {
    setLoading(true);
    try {
      let response;
      switch (type) {
        case 'creator':
          response = await searchByCreator(value, 20);
          break;
        case 'subject':
          response = await searchBySubject(value, 20);
          break;
        case 'place':
          response = await searchByPlace(value, 20);
          break;
        default:
          return;
      }
      
      setItems(response.results || []);
      setTotalItems(response.total || 0);
      setCurrentPage(1);
      
      // Atualizar filtro visual
      setFilters(prev => ({ ...prev, [type + 's']: value }));
      
    } catch (err) {
      console.error('Erro no filtro rápido:', err);
      setError('Erro ao aplicar filtro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const ItemCard = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border-[3px] border-black p-4 hover:transform hover:rotate-1 transition-all duration-200"
    >
      {/* Thumbnail */}
      {item.thumbnail_url && (
        <div className="mb-3 border-[3px] border-black overflow-hidden">
          <img 
            src={item.thumbnail_url} 
            alt={item.title}
            className="w-full h-32 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h3 className="font-bold text-black font-sometype-mono text-sm uppercase line-clamp-2">
          {item.title}
        </h3>
        
        {item.reference_code && (
          <div className="text-xs font-sometype-mono text-black">
            <span className="font-bold">CÓDIGO:</span> {item.reference_code}
          </div>
        )}
        
        {item.creation_dates && item.creation_dates.length > 0 && (
          <div className="text-xs font-sometype-mono text-black">
            <span className="font-bold">DATA:</span> {formatDate(item.creation_dates[0])}
          </div>
        )}
        
        {item.place_access_points && item.place_access_points.length > 0 && (
          <div className="text-xs font-sometype-mono text-black">
            <span className="font-bold">LOCAL:</span> {item.place_access_points[0]}
          </div>
        )}
        
        <div className="text-xs font-sometype-mono text-black">
          <span className="font-bold">TIPO:</span> {item.level_of_description || 'Documento'}
        </div>

        {item.physical_characteristics && (
          <div className="text-xs font-sometype-mono text-black/70 line-clamp-2">
            {item.physical_characteristics}
          </div>
        )}
      </div>
    </motion.div>
  );

  const ItemListRow = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border-[3px] border-black p-3 flex items-center space-x-4 hover:bg-gray-50"
    >
      {item.thumbnail_url && (
        <div className="flex-shrink-0 border-[2px] border-black">
          <img 
            src={item.thumbnail_url} 
            alt={item.title}
            className="w-16 h-16 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-black font-sometype-mono text-sm uppercase truncate">
          {item.title}
        </h3>
        <div className="flex items-center space-x-4 mt-1 text-xs font-sometype-mono text-black">
          {item.reference_code && <span>{item.reference_code}</span>}
          {item.creation_dates?.[0] && <span>{formatDate(item.creation_dates[0])}</span>}
          {item.place_access_points?.[0] && <span>{item.place_access_points[0]}</span>}
        </div>
      </div>
      
      <div className="text-xs font-sometype-mono text-black font-bold">
        {item.level_of_description || 'DOC'}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Busca Principal */}
      <div className="bg-white border-[3px] border-black p-6">
        <h2 className="text-2xl font-bold font-sometype-mono text-black uppercase mb-4">
          🔍 BUSCA NO ACERVO
        </h2>
        
        {/* Campo de Busca */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="DIGITE SUA BUSCA..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black text-black placeholder-gray-500 focus:outline-none font-sometype-mono uppercase"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div>
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black text-black focus:outline-none font-sometype-mono"
            >
              <option value="title">TÍTULO</option>
              <option value="identifier">IDENTIFICADOR</option>
              <option value="scopeAndContent">ESCOPO</option>
            </select>
          </div>
          <div>
            <select
              value={searchOperator}
              onChange={(e) => setSearchOperator(e.target.value)}
              className="w-full px-4 py-3 bg-white border-[3px] border-black text-black focus:outline-none font-sometype-mono"
            >
              <option value="and">E (AND)</option>
              <option value="or">OU (OR)</option>
              <option value="not">NÃO (NOT)</option>
            </select>
          </div>
          <div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full px-4 py-3 bg-black text-white font-bold border-[3px] border-black hover:bg-gray-800 disabled:opacity-50 transition-colors font-sometype-mono uppercase"
            >
              {loading ? 'BUSCANDO...' : 'BUSCAR'}
            </button>
          </div>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => quickFilter('creator', 'Dino Black')}
            className="px-3 py-2 bg-gray-100 border-[3px] border-black text-black hover:bg-gray-200 transition-colors font-sometype-mono text-xs font-bold"
          >
            👤 DINO BLACK
          </button>
          <button
            onClick={() => quickFilter('place', 'Candangolândia/DF')}
            className="px-3 py-2 bg-gray-100 border-[3px] border-black text-black hover:bg-gray-200 transition-colors font-sometype-mono text-xs font-bold"
          >
            📍 CANDANGOLÂNDIA/DF
          </button>
          <button
            onClick={() => quickFilter('subject', 'Rap')}
            className="px-3 py-2 bg-gray-100 border-[3px] border-black text-black hover:bg-gray-200 transition-colors font-sometype-mono text-xs font-bold"
          >
            🎵 RAP
          </button>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, onlyMedia: !prev.onlyMedia }));
              setTimeout(applyFilters, 100);
            }}
            className={`px-3 py-2 border-[3px] border-black transition-colors font-sometype-mono text-xs font-bold ${
              filters.onlyMedia ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            📸 APENAS IMAGENS
          </button>
          
        </div>

        {/* Toggle de Filtros Avançados */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 border-[3px] border-black text-black hover:bg-gray-200 transition-colors font-sometype-mono text-sm font-bold"
          >
            {showFilters ? '▼ OCULTAR FILTROS' : '▶ FILTROS AVANÇADOS'}
          </button>
          
          {(searchTerm || Object.values(filters).some(v => v && v !== 'pt')) && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-black text-white border-[3px] border-black hover:bg-gray-800 transition-colors font-sometype-mono text-sm font-bold"
            >
              LIMPAR FILTROS
            </button>
          )}
        </div>
      </div>

      {/* Filtros Avançados */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white border-[3px] border-black p-6"
        >
          <h3 className="text-xl font-bold font-sometype-mono text-black uppercase mb-4">
            🎯 FILTROS AVANÇADOS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-black text-xs font-bold mb-2 font-sometype-mono uppercase">Criador</label>
              <input
                type="text"
                placeholder="Ex: Dino Black"
                value={filters.creators}
                onChange={(e) => handleFilterChange('creators', e.target.value)}
                className="w-full px-3 py-2 bg-white border-[3px] border-black text-black placeholder-gray-500 focus:outline-none font-sometype-mono"
              />
            </div>
            
            <div>
              <label className="block text-black text-xs font-bold mb-2 font-sometype-mono uppercase">Assunto</label>
              <input
                type="text"
                placeholder="Ex: Rap, Hip Hop"
                value={filters.subjects}
                onChange={(e) => handleFilterChange('subjects', e.target.value)}
                className="w-full px-3 py-2 bg-white border-[3px] border-black text-black placeholder-gray-500 focus:outline-none font-sometype-mono"
              />
            </div>
            
            <div>
              <label className="block text-black text-xs font-bold mb-2 font-sometype-mono uppercase">Local</label>
              <input
                type="text"
                placeholder="Ex: Candangolândia/DF"
                value={filters.places}
                onChange={(e) => handleFilterChange('places', e.target.value)}
                className="w-full px-3 py-2 bg-white border-[3px] border-black text-black placeholder-gray-500 focus:outline-none font-sometype-mono"
              />
            </div>
            
            <div>
              <label className="block text-black text-xs font-bold mb-2 font-sometype-mono uppercase">Data Inicial</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 bg-white border-[3px] border-black text-black focus:outline-none font-sometype-mono"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={applyFilters}
              className="px-6 py-3 bg-black text-white font-bold border-[3px] border-black hover:bg-gray-800 transition-colors font-sometype-mono uppercase"
            >
              APLICAR FILTROS
            </button>
          </div>
        </motion.div>
      )}

      {/* Barra de Controles */}
      <div className="bg-white border-[3px] border-black p-4">
        <div className="flex items-center justify-between">
          <div className="font-sometype-mono text-black text-sm">
            <span className="font-bold">RESULTADOS:</span> {totalItems} itens
            {loading && <span className="ml-2">⏳ Carregando...</span>}
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border-[3px] border-black text-black focus:outline-none font-sometype-mono text-sm"
            >
              <option value="alphabetic">A-Z</option>
              <option value="date">DATA</option>
              <option value="identifier">CÓDIGO</option>
              <option value="lastUpdated">ATUALIZAÇÃO</option>
            </select>
            
            <div className="flex bg-white border-[3px] border-black overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-sometype-mono transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-black text-white' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-sometype-mono transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-black text-white' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Área de Resultados */}
      {error && (
        <div className="bg-white border-[3px] border-black p-6 text-center">
          <div className="text-black font-sometype-mono">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="font-bold">{error}</div>
            <button
              onClick={loadItems}
              className="mt-4 px-4 py-2 bg-black text-white border-[3px] border-black hover:bg-gray-800 transition-colors font-sometype-mono text-sm font-bold"
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="bg-white border-[3px] border-black p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-black font-sometype-mono">
            <div className="text-xl font-bold mb-2 uppercase">NENHUM ITEM ENCONTRADO</div>
            <div className="text-sm">Tente ajustar os filtros ou termos de busca</div>
          </div>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item, index) => (
                <ItemCard key={item.slug} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item, index) => (
                <ItemListRow key={item.slug} item={item} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Paginação */}
      {totalItems > itemsPerPage && (
        <div className="bg-white border-[3px] border-black p-4">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border-[3px] border-black text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sometype-mono font-bold"
            >
              ◀ ANTERIOR
            </button>
            
            <div className="font-sometype-mono text-black font-bold">
              PÁGINA {currentPage} DE {Math.ceil(totalItems / itemsPerPage)}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
              className="px-4 py-2 bg-white border-[3px] border-black text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sometype-mono font-bold"
            >
              PRÓXIMA ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernAcervoInterface;
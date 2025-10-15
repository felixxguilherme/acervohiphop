"use client";

import { useState, useEffect } from 'react';
import HeaderApp from '@/components/html/HeaderApp';
import atomService from '@/services/atomService';
import { motion } from 'motion/react';

const Acervo = () => {
  // Estados para filtros
  const [filters, setFilters] = useState({
    mediaType: '',
    decade: '',
    region: '',
    element: '',
    artist: '',
    crew: ''
  });
  
  // Estados para busca e resultados
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  // Opções para os filtros
  const filterOptions = {
    mediaType: [
      { value: '', label: 'Todas as Mídias' },
      { value: 'foto', label: '📸 Fotografias' },
      { value: 'video', label: '🎥 Vídeos' },
      { value: 'audio', label: '🎵 Áudios' },
      { value: 'documento', label: '📄 Documentos' },
      { value: 'flyer', label: '📋 Flyers/Cartazes' }
    ],
    decade: [
      { value: '', label: 'Todas as Décadas' },
      { value: '1980', label: '🎶 Anos 80' },
      { value: '1990', label: '🎤 Anos 90' },
      { value: '2000', label: '🎧 Anos 2000' },
      { value: '2010', label: '📱 Anos 2010' },
      { value: '2020', label: '🌐 Anos 2020' }
    ],
    region: [
      { value: '', label: 'Todas as Regiões' },
      { value: 'ceilandia', label: '🏘️ Ceilândia' },
      { value: 'samambaia', label: '🌳 Samambaia' },
      { value: 'planaltina', label: '🌾 Planaltina' },
      { value: 'sobradinho', label: '🏔️ Sobradinho' },
      { value: 'plano-piloto', label: '🏛️ Plano Piloto' },
      { value: 'taguatinga', label: '🏙️ Taguatinga' }
    ],
    element: [
      { value: '', label: 'Todos os Elementos' },
      { value: 'rap', label: '🎤 RAP/MC' },
      { value: 'dj', label: '🎧 DJ' },
      { value: 'breaking', label: '🕺 Breaking/B-boy' },
      { value: 'grafite', label: '🎨 Grafite' },
      { value: 'beatbox', label: '🔊 Beatbox' }
    ],
    artist: [
      { value: '', label: 'Todos os Artistas' },
      { value: 'dino-black', label: '🎤 Dino Black' },
      { value: 'gog', label: '👑 GOG' },
      { value: 'dj-jamaika', label: '🎧 DJ Jamaika' },
      { value: 'x', label: '🔥 X' },
      { value: 'funkero', label: '🎵 Funkero' }
    ],
    crew: [
      { value: '', label: 'Todas as Crews' },
      { value: 'posse-mente-zulu', label: '🧠 Posse Mente Zulu' },
      { value: 'familia-de-rua', label: '🏠 Família de Rua' },
      { value: 'cambio-negro', label: '💰 Câmbio Negro' },
      { value: 'viela-17', label: '🛤️ Viela 17' },
      { value: 'circulo-vicioso', label: '⭕ Círculo Vicioso' }
    ]
  };

  // Função para aplicar filtros
  const applyFilters = async () => {
    setLoading(true);
    try {
      let query = searchQuery;
      const activeFilters = Object.entries(filters).filter(([key, value]) => value !== '');
      
      // Construir query baseada nos filtros ativos
      if (activeFilters.length > 0) {
        const filterQueries = activeFilters.map(([key, value]) => {
          switch(key) {
            case 'artist':
              return value === 'dino-black' ? 'Dino Black' : value;
            case 'element':
              return value;
            case 'decade':
              return value;
            default:
              return value;
          }
        });
        
        if (query) {
          query = `${query} ${filterQueries.join(' ')}`;
        } else {
          query = filterQueries.join(' ');
        }
      }
      
      const response = await atomService.search({
        q: query || '*',
        limit: 24,
        sort: 'alphabetic'
      });

      setItems(response.results || []);
      setTotalResults(response.total || 0);
      
    } catch (error) {
      console.error('[Acervo] Erro ao aplicar filtros:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      mediaType: '',
      decade: '',
      region: '',
      element: '',
      artist: '',
      crew: ''
    });
    setSearchQuery('');
  };

  // Função para lidar com mudança de filtro
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Função para lidar com busca
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Carregar itens iniciais
  useEffect(() => {
    const loadInitialItems = async () => {
      try {
        setLoading(true);
        
        // Verificar parâmetros de URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const artistParam = urlParams.get('artist');
        
        let initialQuery = '';
        if (searchParam) {
          setSearchQuery(searchParam);
          initialQuery = searchParam;
        } else if (artistParam) {
          const artistName = artistParam === 'dino-black' ? 'Dino Black' : artistParam;
          setFilters(prev => ({ ...prev, artist: artistParam }));
          initialQuery = artistName;
        }
        
        const response = await atomService.search({
          q: initialQuery || '*',
          limit: 24,
          sort: 'alphabetic'
        });

        setItems(response.results || []);
        setTotalResults(response.total || 0);
        
      } catch (error) {
        console.error('[Acervo] Erro ao carregar itens:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialItems();
  }, []);

  // Aplicar filtros quando mudarem
  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
  }, [filters, searchQuery]);

  return (
    <div className="relative z-10">
      <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Linha de Filtros */}
        <motion.div 
          className="mb-6 p-4 bg-white/90 border-2 border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {Object.entries(filterOptions).map(([filterType, options]) => (
              <select
                key={filterType}
                value={filters[filterType]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                className="px-3 py-2 bg-theme-background border-2 border-black font-sometype-mono text-sm hover:bg-zinc-100 transition-colors min-w-[140px]"
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
            
            {/* Botão Limpar Filtros */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-theme-background border-2 border-black font-dirty-stains text-sm hover:bg-zinc-100 transition-colors"
            >
              LIMPAR
            </button>
          </div>
        </motion.div>        {/* Linha de Busca */}
        <motion.div 
          className="mb-6 p-4 bg-white/90 border-2 border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar no acervo..."
              className="flex-1 px-3 py-2 bg-theme-background border-2 border-black font-sometype-mono text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSearch('Dino Black')}
                className="px-3 py-2 bg-theme-background border-2 border-black font-dirty-stains text-sm hover:bg-zinc-100 transition-colors"
              >
                Dino Black
              </button>
              <button
                onClick={() => handleSearch('rap')}
                className="px-3 py-2 bg-theme-background border-2 border-black font-dirty-stains text-sm hover:bg-zinc-100 transition-colors"
              >
                RAP
              </button>
            </div>
          </div>
        </motion.div>        {/* Contador de Resultados */}
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-lg font-dirty-stains">
            {totalResults} {totalResults === 1 ? 'item encontrado' : 'itens encontrados'}
            {searchQuery && ` para "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Grade de Itens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-sometype-mono">Carregando acervo...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-theme-background border-2 border-black p-6 bg-white/90">
                <p className="font-dirty-stains text-xl mb-2">Erro ao carregar</p>
                <p className="font-sometype-mono">{error}</p>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-theme-background border-2 border-black p-6">
                <p className="font-dirty-stains text-xl mb-2">Nenhum item encontrado</p>
                <p className="font-sometype-mono">Tente ajustar os filtros ou termo de busca</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item, index) => (
                <motion.div 
                  key={item.slug || index} 
                  className="bg-theme-background border-2 border-black p-4 hover:bg-zinc-100 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <h3 className="text-lg font-dirty-stains mb-3 leading-tight">
                    {item.title || 'Sem título'}
                  </h3>
                  
                  {item.physical_characteristics && (
                    <p className="text-sm font-sometype-mono mb-2">
                      <strong>Tipo:</strong> {item.physical_characteristics}
                    </p>
                  )}
                  
                  {item.reference_code && (
                    <p className="text-sm font-sometype-mono mb-2">
                      <strong>Código:</strong> {item.reference_code}
                    </p>
                  )}
                  
                  {item.creation_dates && item.creation_dates.length > 0 && (
                    <p className="text-sm font-sometype-mono mb-2">
                      <strong>Data:</strong> {item.creation_dates[0]}
                    </p>
                  )}
                  
                  {item.level_of_description && (
                    <p className="text-sm font-sometype-mono mb-2">
                      <strong>Nível:</strong> {item.level_of_description}
                    </p>
                  )}
                  
                  <div className="mt-3 pt-3 border-t-2 border-black">
                    <p className="text-xs font-sometype-mono opacity-60">
                      ID: {item.slug || 'N/A'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Acervo;
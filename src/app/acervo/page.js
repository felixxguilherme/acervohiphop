"use client";

import { useState, useEffect } from 'react';
import HeaderApp from '@/components/html/HeaderApp';
import { useAcervo } from '@/contexts/AcervoContext';
import { motion } from 'motion/react';

// Helper para labels dos campos
const getFieldLabel = (field) => {
  const labels = {
    title: 'título',
    referenceCode: 'código de referência', 
    genre: 'gênero',
    subject: 'assunto',
    name: 'nome'
  };
  return labels[field] || field;
};

const Acervo = () => {
  // Hook do contexto
  const { 
    searchResults, 
    searchTotal, 
    performSearch, 
    loading, 
    errors,
    clearSearch 
  } = useAcervo();

  // Estados para busca básica
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [searchOperator, setSearchOperator] = useState('and');
  
  // Estados para filtros avançados
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [onlyMedia, setOnlyMedia] = useState(false);
  const [topLod, setTopLod] = useState(false);
  const [sortBy, setSortBy] = useState('alphabetic');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  
  // Estados locais para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // AtoM retorna 12 por padrão
  
  // Estado para busca por creator
  const [searchByCreator, setSearchByCreator] = useState('');
  
  // Estado para mostrar detalhes do item
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Estado local para resultados de creator (substitui temporariamente o contexto)
  const [creatorResults, setCreatorResults] = useState(null);
  
  // Estado para artistas em destaque
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  

  // Função para limpar busca local
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchByCreator('');
    setCreatorResults(null);
    clearSearch();
  };

  // Função para lidar com busca
  const handleSearch = async (query = searchQuery, field = searchField, page = 1) => {
    if (page === 1) {
      setCurrentPage(1); // Reset pagination when searching
      setCreatorResults(null); // Clear creator results
      setSearchByCreator(''); // Clear creator search
    }
    setSearchQuery(query);
    setSearchField(field);
    
    // Calcular skip baseado na página
    const skip = (page - 1) * itemsPerPage;
    
    try {
      let url;
      if (!query?.trim()) {
        // Se não há query, carrega itens padrão com limit e skip
        if (page === 1) {
          url = `/api/acervo?limit=${itemsPerPage}`;
        } else {
          url = `/api/acervo?limit=${itemsPerPage}&skip=${skip}`;
        }
      } else {
        // Busca com sq0 e sf0 - usar paginação real sempre com limit e skip
        if (page === 1) {
          url = `/api/acervo?sq0=${encodeURIComponent(query.trim())}&sf0=${field}&limit=${itemsPerPage}`;
        } else {
          url = `/api/acervo?sq0=${encodeURIComponent(query.trim())}&sf0=${field}&limit=${itemsPerPage}&skip=${skip}`;
        }
      }
      
      console.log(`[Acervo] Buscando página ${page}:`, url);
      const response = await fetch(url);
      const data = await response.json();
      
      // Usar estado local para controle total da paginação
      setCreatorResults({
        results: data.results || [],
        total: data.total || 0,
        creatorId: null,
        currentPage: page,
        isSearch: !!query?.trim()
      });
    } catch (error) {
      console.error('Erro na busca:', error);
      // Fallback para o contexto original apenas na primeira página
      if (page === 1) {
        performSearch(query, field);
      }
    }
  };
  
  // Função para busca por creator
  const handleCreatorSearch = async (creatorId, page = 1) => {
    if (!creatorId.trim()) return;
    
    if (page === 1) {
      setCurrentPage(1);
      setSearchByCreator(creatorId);
      setSearchQuery(''); // Clear text search
    }
    
    await handleCreatorSearchPage(creatorId, page);
  };
  
  // Função auxiliar para buscar página específica de creator (busca todos os itens)
  const handleCreatorSearchPage = async (creatorId, page = 1) => {
    try {
      // Usar limite alto para garantir que todos os itens do creator sejam carregados
      const url = `/api/acervo?creators=${creatorId}&limit=100`;
      
      console.log(`[Acervo] Buscando todos os itens do creator ${creatorId}:`, url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`[Acervo] Encontrados ${data.total} itens para creator ${creatorId}`);
      
      // Store creator results in local state
      setCreatorResults({
        results: data.results || [],
        total: data.total || 0,
        creatorId: creatorId,
        currentPage: page
      });
      
      // Clear normal search to show creator results
      if (page === 1) {
        clearSearch();
        setSearchQuery(`Creator: ${creatorId}`);
      }
      
    } catch (error) {
      console.error('[Acervo] Erro na busca por creator:', error);
      if (page === 1) {
        alert(`Erro ao buscar creator ${creatorId}: ${error.message}`);
      }
    }
  };
  
  // Função para navegar entre páginas
  const goToPage = async (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Recarregar dados com paginação real (exceto creator)
    if (creatorResults?.creatorId) {
      // Se é busca por creator, não precisa recarregar (todos os itens já estão carregados)
      return;
    } else if (creatorResults?.isSearch || searchQuery) {
      // Se é busca textual, recarregar com paginação real
      await handleSearch(searchQuery, searchField, page);
    } else {
      // Se é página inicial, recarregar com paginação real
      await handleSearch('', 'title', page);
    }
  };
  
  // Determine which results to show (creator results take priority)
  const activeResults = creatorResults ? creatorResults.results : searchResults;
  const activeTotal = creatorResults ? creatorResults.total : searchTotal;
  
  // Calcular dados de paginação
  const totalPages = Math.ceil(activeTotal / itemsPerPage);
  
  // Lógica para diferentes tipos de visualização:
  // - Creator: slice local (todos os itens carregados com limit=100)
  // - Busca textual: paginação real (12 itens da API com skip)
  // - Página inicial: paginação real (12 itens da API com skip)
  const currentItems = (() => {
    if (creatorResults?.creatorId) {
      // Creator: paginar localmente (carrega todos com limit=100)
      return activeResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    } else {
      // Busca textual e página inicial: itens já vem paginados da API
      return activeResults;
    }
  })();
  
  // Função para abrir detalhes do item
  const openItemDetails = async (slug) => {
    try {
      const response = await fetch(`https://base.acervodistritohiphop.com.br/index.php/api/informationobjects/${slug}`);
      const itemDetails = await response.json();
      setSelectedItem(itemDetails);
    } catch (error) {
      console.error('Erro ao carregar detalhes do item:', error);
    }
  };

  // Função para navegar para página do artista
  const goToArtistPage = (creatorId) => {
    // Rolar para o topo e depois buscar por creator
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      handleCreatorSearch(creatorId);
    }, 500);
  };

  // Função para carregar dados dos artistas em destaque
  const loadFeaturedArtists = async () => {
    setLoadingArtists(true);
    const artists = [
      { id: '675', name: 'Dino Black', description: 'Rapper, compositor e ativista cultural' },
      { id: '1069', name: 'Vera Veronika', description: 'Artista visual e fotógrafa' }
    ];

    try {
      const artistsWithData = await Promise.all(
        artists.map(async (artist) => {
          try {
            const response = await fetch(`/api/acervo?creators=${artist.id}&limit=100`);
            const data = await response.json();
            
            return {
              ...artist,
              totalItems: data.total || 0,
              recentItems: (data.results || []).slice(0, 5), // Apenas 5 para preview
              thumbnail: data.results?.[0]?.thumbnail_url?.replace('https://acervodistrito', 'https://base.acervodistrito') || null
            };
          } catch (error) {
            console.error(`Erro ao carregar dados do artista ${artist.name}:`, error);
            return {
              ...artist,
              totalItems: 0,
              recentItems: [],
              thumbnail: null
            };
          }
        })
      );

      setFeaturedArtists(artistsWithData);
    } catch (error) {
      console.error('Erro ao carregar artistas em destaque:', error);
    } finally {
      setLoadingArtists(false);
    }
  };

  // Carregar artistas em destaque
  useEffect(() => {
    loadFeaturedArtists();
  }, []);

  // Carregar itens iniciais
  useEffect(() => {
    const loadInitialItems = async () => {
      try {
        // Verificar parâmetros de URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const artistParam = urlParams.get('artist');
        const creatorParam = urlParams.get('creator');
        
        let initialQuery = '';
        if (searchParam) {
          setSearchQuery(searchParam);
          initialQuery = searchParam;
        } else if (artistParam) {
          setSearchQuery(artistParam);
          initialQuery = artistParam;
        } else if (creatorParam) {
          // Se veio da página do artista, buscar diretamente por creator
          handleCreatorSearch(creatorParam);
          return;
        }
        
        // Usar nossa função de busca melhorada
        await handleSearch(initialQuery, 'title');
        
      } catch (error) {
        console.error('[Acervo] Erro ao carregar itens:', error);
      }
    };

    loadInitialItems();
  }, [performSearch]);


  return (
    <div>
      <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
      
      <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen">
        {/* Seção de Artistas em Destaque */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-dirty-stains text-theme-primary mb-4">
              ARTISTAS EM DESTAQUE
            </h2>
            <p className="text-lg font-sometype-mono text-gray-600">
              Conheça os artistas que fazem parte do nosso acervo
            </p>
          </div>


          {loadingArtists ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-sometype-mono">Carregando artistas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  className="bg-theme-background border-2 border-black p-6 hover:bg-zinc-100 transition-all duration-300 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail do artista */}
                    <div className="md:w-32 md:h-32 w-full h-48 flex-shrink-0">
                      {artist.thumbnail ? (
                        <img
                          src={artist.thumbnail}
                          alt={artist.name}
                          className="w-full h-full object-cover border-2 border-black"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 border-2 border-black flex items-center justify-center">
                          <span className="text-4xl">🎭</span>
                        </div>
                      )}
                    </div>

                    {/* Informações do artista */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-dirty-stains text-theme-primary mb-2">
                          {artist.name}
                        </h3>
                        <p className="font-sometype-mono text-gray-700 mb-3">
                          {artist.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 border border-blue-300 font-sometype-mono text-sm">
                            📊 {artist.totalItems} {artist.totalItems === 1 ? 'item' : 'itens'}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 border border-green-300 font-sometype-mono text-sm">
                            🆔 Creator {artist.id}
                          </span>
                        </div>
                      </div>

                      {/* Botões de ação */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => goToArtistPage(artist.id)}
                          className="px-4 py-2 bg-blue-500 text-white border-2 border-black font-dirty-stains hover:bg-blue-600 transition-colors"
                        >
                          👤 Ver Página do Artista
                        </button>
                        <button
                          onClick={() => handleCreatorSearch(artist.id)}
                          className="px-4 py-2 bg-green-500 text-white border-2 border-black font-dirty-stains hover:bg-green-600 transition-colors"
                        >
                          🔍 Ver Todos os Itens
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview dos itens recentes */}
                  {artist.recentItems.length > 0 && (
                    <div className="mt-6 pt-4 border-t-2 border-black">
                      <h4 className="font-dirty-stains text-lg mb-3">Itens Recentes:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {artist.recentItems.slice(0, 3).map((item, itemIndex) => (
                          <div
                            key={item.slug || itemIndex}
                            className="bg-white p-2 border border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => openItemDetails(item.slug)}
                          >
                            {item.thumbnail_url && (
                              <img
                                src={item.thumbnail_url.replace('https://acervodistrito', 'https://base.acervodistrito')}
                                alt={item.title || 'Item'}
                                className="w-full h-16 object-cover border border-gray-200 mb-1"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <p className="text-xs font-sometype-mono truncate">
                              {item.title || 'Sem título'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Barra de Busca Melhorada */}
        <motion.div 
          className="mb-8 p-6 bg-white/90 border-2 border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            {/* Busca Principal */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Digite sua busca... (ex: vera, dino, 1994)"
                  className="flex-1 px-4 py-3 bg-theme-background border-2 border-black font-sometype-mono text-base focus:outline-none focus:border-yellow-400"
                />
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="px-4 py-3 bg-theme-background border-2 border-black font-sometype-mono text-base focus:outline-none focus:border-yellow-400"
                >
                  <option value="title">Título</option>
                  <option value="referenceCode">Código de Referência</option>
                  <option value="genre">Gênero</option>
                  <option value="subject">Assunto</option>
                  <option value="name">Nome</option>
                </select>
                <button
                  onClick={() => handleSearch()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white border-2 border-black font-dirty-stains transition-colors"
                >
                  🔍 Buscar
                </button>
              </div>
            </div>
            
            {/* Busca por Creator */}
            <div className="flex flex-col md:flex-row gap-4 items-center border-t-2 border-gray-200 pt-4">              
              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-black font-dirty-stains text-sm transition-colors"
                >
                  ✕ Limpar
                </button>
              </div>
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-600 font-sometype-mono text-center">
            💡 Use a busca textual para termos específicos ou a busca por Creator para ver todos os itens de um criador
          </p>
        </motion.div>

        {/* Contador de Resultados e Paginação */}
        <motion.div 
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-lg font-dirty-stains">
              {activeTotal} {activeTotal === 1 ? 'item encontrado' : 'itens encontrados'}
              {searchQuery && (creatorResults ? 
                ` para Creator ID: ${creatorResults.creatorId}` : 
                ` para "${searchQuery}" em ${getFieldLabel(searchField)}`
              )}
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-sometype-mono">Página {currentPage} de {totalPages}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains text-sm transition-colors"
                  >
                    ←
                  </button>
                  
                  {/* Números das páginas */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`px-3 py-1 border-2 border-black font-dirty-stains text-sm transition-colors ${
                          pageNum === currentPage 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains text-sm transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Grade de Itens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {loading.search ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-sometype-mono">Carregando acervo...</p>
            </div>
          ) : errors.search ? (
            <div className="text-center py-12">
              <div className="bg-theme-background border-2 border-black p-6 bg-white/90">
                <p className="font-dirty-stains text-xl mb-2">Erro ao carregar</p>
                <p className="font-sometype-mono">{errors.search}</p>
              </div>
            </div>
          ) : activeResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-theme-background border-2 border-black p-6">
                <p className="font-dirty-stains text-xl mb-2">Nenhum item encontrado</p>
                <p className="font-sometype-mono">Tente um termo de busca diferente</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((item, index) => (
                <motion.div 
                  key={item.slug || index} 
                  className="bg-theme-background border-2 border-black hover:bg-zinc-100 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 flex flex-col h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => openItemDetails(item.slug)}
                >
                  {/* Thumbnail se disponível */}
                  {item.thumbnail_url && (
                    <div className="mb-3 overflow-hidden">
                      <img 
                        src={item.thumbnail_url.replace('https://acervodistrito', 'https://base.acervodistrito')} 
                        alt={item.title || 'Sem título'}
                        className="w-full h-40 object-cover border-b-2 border-black transition-transform duration-300 hover:scale-110"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-dirty-stains mb-3 leading-tight line-clamp-2">
                      {item.title || 'Sem título'}
                    </h3>
                    
                    <div className="space-y-1 flex-1">
                      {item.physical_characteristics && (
                        <p className="text-sm font-sometype-mono text-gray-700">
                          📁 {item.physical_characteristics}
                        </p>
                      )}
                      
                      {item.creation_dates && item.creation_dates.length > 0 && (
                        <p className="text-sm font-sometype-mono text-gray-700">
                          📅 {item.creation_dates[0]}
                        </p>
                      )}
                      
                      {item.reference_code && (
                        <p className="text-xs font-sometype-mono text-gray-500">
                          🔗 {item.reference_code}
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t-2 border-black flex justify-between items-center">
                      <p className="text-xs font-sometype-mono opacity-60 truncate mr-2">
                        {item.slug || 'N/A'}
                      </p>
                      <button className="text-xs bg-blue-500 text-white px-3 py-1 border border-black font-dirty-stains hover:bg-blue-600 transition-colors whitespace-nowrap">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Paginação */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains transition-colors"
              >
                ← Anterior
              </button>
              
              <span className="px-4 py-2 font-sometype-mono">
                Página {currentPage} de {totalPages}
              </span>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains transition-colors"
              >
                Próxima →
              </button>
            </div>
          </motion.div>
        )}


        
        {/* Modal de Detalhes do Item */}
        {selectedItem && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              className="bg-white border-4 border-black max-w-4xl max-h-[90vh] overflow-y-auto p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-dirty-stains text-theme-primary">
                  {selectedItem.title || 'Sem título'}
                </h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-2xl hover:bg-gray-100 w-8 h-8 flex items-center justify-center border border-black"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações principais */}
                <div className="space-y-4">
                  {selectedItem.reference_code && (
                    <div>
                      <strong className="font-dirty-stains">Código de Referência:</strong>
                      <p className="font-sometype-mono">{selectedItem.reference_code}</p>
                    </div>
                  )}
                  
                  {selectedItem.physical_characteristics && (
                    <div>
                      <strong className="font-dirty-stains">Características Físicas:</strong>
                      <p className="font-sometype-mono">{selectedItem.physical_characteristics}</p>
                    </div>
                  )}
                  
                  {selectedItem.creation_dates && selectedItem.creation_dates.length > 0 && (
                    <div>
                      <strong className="font-dirty-stains">Datas de Criação:</strong>
                      <p className="font-sometype-mono">{selectedItem.creation_dates.join(', ')}</p>
                    </div>
                  )}
                  
                  {selectedItem.level_of_description && (
                    <div>
                      <strong className="font-dirty-stains">Nível de Descrição:</strong>
                      <p className="font-sometype-mono">{selectedItem.level_of_description}</p>
                    </div>
                  )}
                  
                  {selectedItem.scope_and_content && (
                    <div>
                      <strong className="font-dirty-stains">Âmbito e Conteúdo:</strong>
                      <p className="font-sometype-mono text-sm">{selectedItem.scope_and_content}</p>
                    </div>
                  )}
                </div>
                
                {/* Mídia e links */}
                <div className="space-y-4">
                  {selectedItem.digital_object_url && (
                    <div>
                      <strong className="font-dirty-stains">Objeto Digital:</strong>
                      <div className="mt-2">
                        <img 
                          src={selectedItem.digital_object_url.replace('https://acervodistrito', 'https://base.acervodistrito')}
                          alt={selectedItem.title || 'Objeto digital'}
                          className="w-full max-w-md border-2 border-black"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedItem.notes && selectedItem.notes.length > 0 && (
                    <div>
                      <strong className="font-dirty-stains">Notas:</strong>
                      <div className="space-y-1">
                        {selectedItem.notes.map((note, index) => (
                          <p key={index} className="font-sometype-mono text-sm bg-gray-100 p-2 border border-gray-300">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Links externos */}
              <div className="mt-6 pt-4 border-t-2 border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://base.acervodistritohiphop.com.br/index.php/${selectedItem.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white border-2 border-black font-dirty-stains hover:bg-blue-600 transition-colors"
                  >
                    🔗 Ver no Sistema Original
                  </a>
                  <a
                    href={`https://base.acervodistritohiphop.com.br/index.php/api/informationobjects/${selectedItem.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white border-2 border-black font-dirty-stains hover:bg-green-600 transition-colors"
                  >
                    📡 Ver API JSON
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Acervo;
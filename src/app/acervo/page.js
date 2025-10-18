"use client";

import { useState, useEffect } from 'react';
import HeaderApp from '@/components/html/HeaderApp';
import atomService from '@/services/atomService';
import { motion } from 'motion/react';

const Acervo = () => {
  // Estados para busca e resultados
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  
  // Estados para a seção de informationobjects
  const [informationObjects, setInformationObjects] = useState([]);
  const [loadingObjects, setLoadingObjects] = useState(true);
  const [objectsError, setObjectsError] = useState(null);

  // Função para realizar busca
  const performSearch = async (query = '') => {
    console.info('[Acervo] 🔍 Iniciando busca:', { query });
    setLoading(true);
    setError(null);
    try {
      const searchParams = {
        q: query || '*',
        limit: 24,
        sort: 'alphabetic'
      };
      
      console.info('[Acervo] 📋 Parâmetros de busca:', searchParams);
      
      const response = await atomService.search(searchParams);

      console.info('[Acervo] ✅ Resposta recebida:', {
        total: response.total,
        count: response.results?.length,
        query: response.query
      });

      setItems(response.results || []);
      setTotalResults(response.total || 0);
      
    } catch (error) {
      console.error('[Acervo] ❌ Erro na busca:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar busca
  const clearSearch = () => {
    setSearchQuery('');
    performSearch('');
  };

  // Função para lidar com busca
  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  // Carregar itens iniciais
  useEffect(() => {
    const loadInitialItems = async () => {
      try {
        // Verificar parâmetros de URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const artistParam = urlParams.get('artist');
        
        let initialQuery = '';
        if (searchParam) {
          setSearchQuery(searchParam);
          initialQuery = searchParam;
        } else if (artistParam) {
          setSearchQuery(artistParam);
          initialQuery = artistParam;
        }
        
        await performSearch(initialQuery);
        
      } catch (error) {
        console.error('[Acervo] Erro ao carregar itens:', error);
        setError(error.message);
      }
    };

    loadInitialItems();
  }, []);

  // Carregar informationobjects ao montar o componente
  useEffect(() => {
    const loadInformationObjects = async () => {
      try {
        setLoadingObjects(true);
        const response = await atomService.getItems({ limit: 24 });
        setInformationObjects(response.results);
        console.info('[Acervo] ✅ InformationObjects carregados:', {
          total: response.total,
          count: response.results.length,
          sample: response.results[0]
        });
      } catch (error) {
        console.error('[Acervo] ❌ Erro ao carregar informationobjects:', error);
        setObjectsError(error.message);
      } finally {
        setLoadingObjects(false);
      }
    };

    loadInformationObjects();
  }, []);

  return (
    <div className="relative z-10">
      <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Barra de Busca Simplificada */}
        <motion.div 
          className="mb-8 p-6 bg-white/90 border-2 border-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar no acervo... (ex: Dino Black, rap, 1994, Ceilândia)"
              className="flex-1 px-4 py-3 bg-theme-background border-2 border-black font-sometype-mono text-base focus:outline-none focus:border-yellow-400"
            />
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleSearch('Dino Black')}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-black font-dirty-stains text-sm transition-colors"
              >
                🎤 Dino Black
              </button>
              <button
                onClick={() => handleSearch('rap')}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-black font-dirty-stains text-sm transition-colors"
              >
                🎵 RAP
              </button>
              <button
                onClick={() => handleSearch('GOG')}
                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-black font-dirty-stains text-sm transition-colors"
              >
                👑 GOG
              </button>
              <button
                onClick={() => {
                  console.log('🧪 Iniciando teste busca direta');
                  setLoading(true);
                  setError(null);
                  // Busca direta via fetch para testar
                  fetch('/api/acervo?sq0=vera&sf0=title')
                    .then(res => res.json())
                    .then(data => {
                      console.log('🧪 Teste busca direta - Resposta:', data);
                      setItems(data.results || []);
                      setTotalResults(data.total || 0);
                      setSearchQuery('vera (teste direto)');
                      setLoading(false);
                    })
                    .catch(err => {
                      console.error('❌ Erro teste:', err);
                      setError(err.message);
                      setLoading(false);
                    });
                }}
                className="px-4 py-2 bg-green-400 hover:bg-green-300 border-2 border-black font-dirty-stains text-sm transition-colors"
              >
                🧪 Teste Vera
              </button>
              <button
                onClick={() => handleSearch('1994')}
                className="px-4 py-2 bg-blue-400 hover:bg-blue-300 border-2 border-black font-dirty-stains text-sm transition-colors"
              >
                📅 Anos 90
              </button>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-black font-dirty-stains text-sm transition-colors"
              >
                ✕ Limpar
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600 font-sometype-mono text-center">
            💡 Digite qualquer termo para buscar em títulos, descrições, artistas e localizações
          </p>
        </motion.div>

        {/* Contador de Resultados */}
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
        >
          {loading ? (
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
                <p className="font-sometype-mono">Tente um termo de busca diferente</p>
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

        {/* Seção de InformationObjects da API */}
        <section className="mt-16 py-12 border-t-2 border-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-dirty-stains text-center mb-8 text-theme-primary">
              ITENS DO ACERVO (API)
            </h2>
            
            {loadingObjects ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-sometype-mono">Carregando itens do acervo...</p>
              </div>
            ) : objectsError ? (
              <div className="text-center py-12">
                <div className="bg-theme-background border-2 border-black p-6 bg-white/90">
                  <p className="font-dirty-stains text-xl mb-2">Erro ao carregar dados</p>
                  <p className="font-sometype-mono">{objectsError}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center mb-8">
                  <p className="text-lg font-sometype-mono text-theme-secondary">
                    Total de itens encontrados: {informationObjects.length}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {informationObjects.map((item, index) => (
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
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Acervo;
"use client";

import { useState, useEffect } from 'react';
import HeaderApp from '@/components/html/HeaderApp';
import SearchBar from '@/components/acervo/SearchBar';
import SearchResults from '@/components/acervo/SearchResults';
import atomService from '@/services/atomService';

const Acervo = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);
  
  // Estados para a seção de informationobjects
  const [informationObjects, setInformationObjects] = useState([]);
  const [loadingObjects, setLoadingObjects] = useState(true);
  const [objectsError, setObjectsError] = useState(null);

  // Carrega informationobjects ao montar o componente
  useEffect(() => {
    const loadInformationObjects = async () => {
      try {
        setLoadingObjects(true);
        const response = await atomService.getItems({ limit: 10 });
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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    // Se a query estiver vazia, limpa os resultados
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    
    try {
      // Busca usando a API AtoM com os parâmetros corretos
      const response = await atomService.search({
        q: query,
        field: 'title',
        operator: 'and',
        limit: 20,
        sort: 'alphabetic'
      });

      console.info('[Acervo/Search] 🔍 Resultados recebidos', {
        query,
        total: response.total,
        count: response.results?.length ?? 0,
        sample: response.results?.[0]
      });

      setSearchResults(response.results || []);
      setTotalResults(response.total || 0);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
      setTotalResults(0);
      alert('Erro ao buscar no acervo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10">
      <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Barra de busca */}
        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Resultados da busca */}
        <SearchResults 
          results={searchResults}
          loading={loading}
          query={searchQuery}
          total={totalResults}
        />

        {/* Seção de InformationObjects da API */}
        <section className="mt-16 py-12 border-t-2 border-theme">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-dirty-stains text-center mb-8 text-theme-primary">
              ITENS DO ACERVO (API)
            </h2>
            
            {loadingObjects ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-2 border-theme border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-sometype-mono">Carregando itens do acervo...</p>
              </div>
            ) : objectsError ? (
              <div className="text-center py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p className="font-bold">Erro ao carregar dados:</p>
                  <p>{objectsError}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {informationObjects.map((item, index) => (
                  <div key={item.slug || index} className="bg-theme-card border-2 border-theme p-6 rounded-lg">
                    <h3 className="text-xl font-dirty-stains mb-3 text-theme-primary">
                      {item.title || 'Sem título'}
                    </h3>
                    
                    {item.physical_characteristics && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Características:</strong> {item.physical_characteristics}
                      </p>
                    )}
                    
                    {item.reference_code && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Código:</strong> {item.reference_code}
                      </p>
                    )}
                    
                    {item.creation_dates && item.creation_dates.length > 0 && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Data:</strong> {item.creation_dates[0]}
                      </p>
                    )}
                    
                    {item.level_of_description && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Nível:</strong> {item.level_of_description}
                      </p>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-theme-secondary">
                      <p className="text-xs font-sometype-mono text-theme-secondary">
                        ID: {item.slug || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Acervo;
"use client";

import { useState } from 'react';
import HeaderApp from '@/components/html/HeaderApp';
import SearchBar from '@/components/acervo/SearchBar';
import SearchResults from '@/components/acervo/SearchResults';
import atomService from '@/services/atomService';

const Acervo = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalResults, setTotalResults] = useState(0);

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
      </div>
    </div>
  );
};

export default Acervo;
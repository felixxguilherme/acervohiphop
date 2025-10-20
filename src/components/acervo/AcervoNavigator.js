"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import atomService from '../../services/atomService.js';

const AcervoNavigator = () => {
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'collections' | 'gallery' | 'search'
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    collections: 0,
    media: 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Carregando dados iniciais da API real...');
      
      const [allItems, collectionsData, mediaData] = await Promise.all([
        atomService.getItems({ limit: 1000 }),
        atomService.getCollections({ limit: 50 }),
        atomService.getMediaItems({ limit: 50 })
      ]);

      console.log('✅ Dados recebidos da API:', {
        allItems: allItems.total,
        collections: collectionsData.total,
        media: mediaData.total
      });
      
      console.log('📁 Coleções da API:', collectionsData.results);
      console.log('🖼️ Mídia da API:', mediaData.results);

      setItems(allItems.results || []);
      setCollections(collectionsData.results || []);
      setMediaItems(mediaData.results || []);
      setStats({
        total: allItems.total || 0,
        collections: collectionsData.total || 0,
        media: mediaData.total || 0
      });
      
      console.log('🎯 Estados atualizados:', {
        itemsCount: allItems.results?.length,
        collectionsCount: collectionsData.results?.length,
        mediaCount: mediaData.results?.length
      });
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados da API:', error);
      setError(error.message);
      // Set empty states on error
      setItems([]);
      setCollections([]);
      setMediaItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await atomService.search({
        q: term,
        field: 'title',
        limit: 20
      });
      setSearchResults(results.results || []);
    } catch (error) {
      console.error('Erro na busca:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, description, onClick, isActive }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        cursor-pointer p-6 rounded-lg border transition-all
        ${isActive 
          ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400' 
          : 'bg-black/40 border-yellow-400/30 hover:border-yellow-400/60'
        }
      `}
    >
      <div className="text-center">
        <div className="text-4xl mb-3">{icon}</div>
        <div className="text-2xl font-scratchy font-bold mb-2">{value}</div>
        <div className="text-lg font-medium mb-1">{title}</div>
        <div className="text-sm opacity-70">{description}</div>
      </div>
    </motion.div>
  );

  const ItemCard = ({ item, index }) => {
    console.log(`🎯 Renderizando item ${index}:`, item);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4 hover:border-yellow-400/60 transition-colors"
      >
        {item.thumbnail_url && (
          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => console.log('❌ Erro ao carregar imagem:', e.target.src)}
            />
          </div>
        )}
        <h3 className="font-scratchy text-yellow-400 font-bold mb-2 line-clamp-2">
          {item.title || 'Título não disponível'}
        </h3>
        <div className="text-sm text-yellow-100/70 space-y-1">
          <div className="text-xs bg-yellow-400/20 p-1 rounded mb-2">
            Slug: {item.slug || 'N/A'}
          </div>
          {item.reference_code && (
            <div className="flex items-center">
              <span className="mr-2">🏷️</span>
              {item.reference_code}
            </div>
          )}
          {item.level_of_description && (
            <div className="flex items-center">
              <span className="mr-2">📂</span>
              {item.level_of_description}
            </div>
          )}
          {item.creation_dates && item.creation_dates[0] && (
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              {new Date(item.creation_dates[0]).toLocaleDateString('pt-BR')}
            </div>
          )}
          {item.place_access_points && item.place_access_points[0] && (
            <div className="flex items-center">
              <span className="mr-2">📍</span>
              {item.place_access_points[0]}
            </div>
          )}
          {item.physical_characteristics && (
            <div className="text-xs mt-2 p-2 bg-black/30 rounded">
              📋 {item.physical_characteristics.substring(0, 80)}...
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const OverviewSection = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-scratchy text-yellow-400 mb-4"
        >
          🎵 ACERVO HIP HOP DF
        </motion.h1>
        <p className="text-yellow-100/70 max-w-2xl mx-auto">
          Explore nosso acervo digital completo com {stats.total} itens preservando a história do Hip Hop no Distrito Federal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon="📁"
          title="Coleções"
          value={stats.collections}
          description="Documentos organizados por tema"
          onClick={() => setViewMode('collections')}
          isActive={viewMode === 'collections'}
        />
        <StatCard
          icon="🖼️"
          title="Imagens"
          value={stats.media}
          description="Fotografias e documentos digitais"
          onClick={() => setViewMode('gallery')}
          isActive={viewMode === 'gallery'}
        />
        <StatCard
          icon="🔍"
          title="Busca"
          value="Avançada"
          description="Sistema completo de pesquisa"
          onClick={() => setViewMode('search')}
          isActive={viewMode === 'search'}
        />
      </div>

      {/* Recent Items Preview */}
      <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
        <h2 className="text-2xl font-scratchy text-yellow-400 mb-4 flex items-center">
          <span className="mr-2">⭐</span>
          Itens em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.slice(0, 6).map((item, index) => (
            <ItemCard key={item.slug} item={item} index={index} />
          ))}
        </div>
        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('collections')}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-scratchy font-bold transition-colors"
          >
            📁 Ver Todas as Coleções
          </motion.button>
        </div>
      </div>
    </div>
  );

  const CollectionsSection = () => {
    console.log('🔍 CollectionsSection - Estado atual:', {
      loading,
      collectionsLength: collections.length,
      collections: collections
    });
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-scratchy text-yellow-400 mb-2">
            📁 Coleções do Acervo
          </h2>
          <p className="text-yellow-100/70">
            {collections.length} coleções organizadas por tema e período
          </p>
        </div>

        {/* Debug Info */}
        <div className="bg-blue-900/50 border border-blue-400/30 rounded-lg p-4 text-sm">
          <div className="text-blue-200">
            🐛 Debug: Loading={loading ? 'true' : 'false'}, Collections={collections.length}, Error={error ? 'YES' : 'NO'}
          </div>
          {error && (
            <div className="text-red-300 mt-2">
              ❌ Erro: {error}
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-8">
            <div className="flex items-center justify-center">
              <div className="text-yellow-400">
                <span className="animate-spin mr-2">⏳</span>
                Carregando coleções...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-400/30 rounded-lg p-8">
            <div className="text-center text-red-200">
              <div className="text-4xl mb-2">⚠️</div>
              <div className="text-xl font-bold mb-2">Erro ao carregar coleções</div>
              <div className="text-sm">{error}</div>
              <button
                onClick={loadInitialData}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
              >
                🔄 Tentar novamente
              </button>
            </div>
          </div>
        ) : collections.length === 0 ? (
          <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-8">
            <div className="text-center text-yellow-100/70">
              <div className="text-4xl mb-2">📂</div>
              <div>Nenhuma coleção encontrada</div>
              <div className="text-sm mt-2 text-yellow-400">
                API conectada mas sem dados retornados
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection, index) => {
              console.log(`📦 Renderizando coleção ${index}:`, collection);
              return (
                <ItemCard key={collection.slug} item={collection} index={index} />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const GallerySection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-scratchy text-yellow-400 mb-2">
          🖼️ Galeria de Imagens
        </h2>
        <p className="text-yellow-100/70">
          {mediaItems.length} imagens e documentos digitais do acervo
        </p>
      </div>

      {loading ? (
        <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-8">
          <div className="flex items-center justify-center">
            <div className="text-yellow-400">
              <span className="animate-spin mr-2">⏳</span>
              Carregando galeria...
            </div>
          </div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-8">
          <div className="text-center text-yellow-100/70">
            <div className="text-4xl mb-2">🖼️</div>
            <div>Nenhuma imagem encontrada</div>
            <div className="text-sm mt-2 text-red-400">
              Verifique o console para logs de debug
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaItems.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg overflow-hidden hover:border-yellow-400/60 transition-colors"
            >
              <div className="aspect-square">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-scratchy text-yellow-400 text-sm font-bold mb-1 line-clamp-2">
                  {item.title}
                </h3>
                {item.creation_dates && item.creation_dates[0] && (
                  <div className="text-xs text-yellow-100/70">
                    📅 {new Date(item.creation_dates[0]).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const SearchSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-scratchy text-yellow-400 mb-2">
          🔍 Busca no Acervo
        </h2>
        <p className="text-yellow-100/70">
          Sistema de busca avançada em todo o acervo
        </p>
      </div>

      <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="🔍 Buscar no acervo..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="flex-1 px-4 py-3 bg-black/50 border border-yellow-400/30 rounded-lg text-yellow-100 placeholder-yellow-100/50 focus:border-yellow-400 focus:outline-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSearch(searchTerm)}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-lg font-scratchy font-bold transition-colors"
          >
            Buscar
          </motion.button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-scratchy text-yellow-400 mb-4">
              Resultados ({searchResults.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((item, index) => (
                <ItemCard key={item.slug} item={item} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const NavigationTabs = () => (
    <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4 mb-8">
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'overview', label: '🏠 Visão Geral', icon: '🏠' },
          { key: 'collections', label: '📁 Coleções', icon: '📁' },
          { key: 'gallery', label: '🖼️ Galeria', icon: '🖼️' },
          { key: 'search', label: '🔍 Busca', icon: '🔍' }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setViewMode(tab.key)}
            className={`
              px-4 py-2 rounded-lg font-scratchy font-bold transition-all
              ${viewMode === tab.key
                ? 'bg-yellow-400 text-black'
                : 'text-yellow-400 hover:bg-yellow-400/20'
              }
            `}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );

  if (loading && viewMode === 'overview') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-2xl font-scratchy text-yellow-400">
            Carregando acervo...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {viewMode !== 'overview' && <NavigationTabs />}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'overview' && <OverviewSection />}
          {viewMode === 'collections' && <CollectionsSection />}
          {viewMode === 'gallery' && <GallerySection />}
          {viewMode === 'search' && <SearchSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AcervoNavigator;
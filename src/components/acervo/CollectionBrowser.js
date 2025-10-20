"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import atomService from '../../services/atomService.js';
import PolaroidPhoto from '../PolaroidPhoto';

const CollectionBrowser = ({ onSelectCollection, selectedCollection }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('alphabetic');

  useEffect(() => {
    loadCollections();
  }, [sortBy]);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar getCollections (AtoM 2.9) para buscar apenas coleções de nível superior
      const response = await atomService.getCollections({
        limit: 50,
        sort: sortBy,
        languages: 'pt' // AtoM 2.9: Forçar resposta em português
      });
      
      setCollections(response.results || []);
    } catch (err) {
      console.error('Erro ao carregar coleções:', err);
      setError('Erro ao carregar coleções. Tente novamente.');
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

  const getCollectionIcon = (levelOfDescription) => {
    switch (levelOfDescription) {
      case 'Collection': return '📚';
      case 'Fonds': return '🗂️';
      case 'Series': return '📋';
      case 'Série': return '📋';
      case 'Arquivo': return '📄';
      case 'Grupo de documentos/arquivos': return '📁';
      default: return '📄';
    }
  };

  const CollectionCard = ({ collection, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4 
        hover:border-yellow-400 transition-all cursor-pointer group
        ${selectedCollection?.slug === collection.slug ? 'border-yellow-400 bg-yellow-400/10' : ''}
      `}
      onClick={() => onSelectCollection(collection)}
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {getCollectionIcon(collection.level_of_description)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors line-clamp-2">
            {collection.title}
          </h3>
          
          <div className="mt-2 space-y-1 text-sm text-yellow-100/70">
            {collection.reference_code && (
              <div className="flex items-center">
                <span className="text-yellow-400">🏷️</span>
                <span className="ml-1">{collection.reference_code}</span>
              </div>
            )}
            
            {collection.creation_dates && collection.creation_dates.length > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400">📅</span>
                <span className="ml-1">{formatDate(collection.creation_dates[0])}</span>
              </div>
            )}
            
            {collection.place_access_points && collection.place_access_points.length > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-400">📍</span>
                <span className="ml-1">{collection.place_access_points[0]}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="text-yellow-400">📊</span>
              <span className="ml-1 capitalize">{collection.level_of_description}</span>
            </div>
          </div>
          
          {collection.physical_characteristics && (
            <p className="mt-2 text-xs text-yellow-100/50 line-clamp-2">
              {collection.physical_characteristics}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const CollectionListItem = ({ collection, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded p-3 mb-2
        hover:border-yellow-400 transition-all cursor-pointer group
        ${selectedCollection?.slug === collection.slug ? 'border-yellow-400 bg-yellow-400/10' : ''}
      `}
      onClick={() => onSelectCollection(collection)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="text-lg group-hover:scale-110 transition-transform">
            {getCollectionIcon(collection.level_of_description)}
          </span>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-yellow-400 group-hover:text-yellow-300 transition-colors truncate">
              {collection.title}
            </h4>
            <div className="flex items-center space-x-4 mt-1 text-xs text-yellow-100/70">
              {collection.reference_code && (
                <span>🏷️ {collection.reference_code}</span>
              )}
              {collection.creation_dates?.[0] && (
                <span>📅 {formatDate(collection.creation_dates[0])}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-yellow-400 opacity-60 group-hover:opacity-100">
          {collection.level_of_description}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-yellow-400 text-lg">
            <span className="animate-spin mr-2">⏳</span>
            Carregando coleções...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-red-400/30 rounded-lg p-6">
        <div className="text-center text-red-400">
          <div className="text-2xl mb-2">⚠️</div>
          <div>{error}</div>
          <button
            onClick={loadCollections}
            className="mt-4 px-4 py-2 bg-red-600/80 text-white rounded hover:bg-red-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-scratchy text-yellow-400 flex items-center">
          <span className="mr-2">📁</span>
          Coleções ({collections.length})
        </h2>
        
        <div className="flex items-center space-x-3">
          {/* Ordenação */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-black/50 border border-yellow-400/30 rounded text-yellow-100 text-sm focus:border-yellow-400 focus:outline-none"
          >
            <option value="alphabetic">A-Z</option>
            <option value="date">Data</option>
            <option value="identifier">Código</option>
          </select>
          
          {/* Toggle de visualização */}
          <div className="flex bg-black/50 border border-yellow-400/30 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-sm transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-yellow-400 hover:bg-yellow-400/20'
              }`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm transition-colors ${
                viewMode === 'list' 
                  ? 'bg-yellow-400 text-black' 
                  : 'text-yellow-400 hover:bg-yellow-400/20'
              }`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Seleção Atual */}
      {selectedCollection && (
        <div className="mb-4 p-3 bg-yellow-400/10 border border-yellow-400/50 rounded">
          <div className="text-sm text-yellow-400 mb-1">📌 Coleção Selecionada:</div>
          <div className="text-yellow-100 font-medium">{selectedCollection.title}</div>
        </div>
      )}

      {/* Lista de Coleções */}
      {collections.length === 0 ? (
        <div className="text-center py-8 text-yellow-100/70">
          <div className="text-4xl mb-2">📂</div>
          <div>Nenhuma coleção encontrada</div>
        </div>
      ) : (
        <div>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection, index) => (
                <CollectionCard 
                  key={collection.slug} 
                  collection={collection} 
                  index={index} 
                />
              ))}
            </div>
          ) : (
            <div className="space-y-0">
              {collections.map((collection, index) => (
                <CollectionListItem 
                  key={collection.slug} 
                  collection={collection} 
                  index={index} 
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estatísticas */}
      <div className="mt-6 pt-4 border-t border-yellow-400/20 text-center text-sm text-yellow-100/70">
        💡 Estas são as coleções de nível superior do acervo Hip Hop DF
      </div>
    </div>
  );
};

export default CollectionBrowser;
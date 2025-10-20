"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import atomService from '../../services/atomService.js';
import PolaroidPhoto from '../PolaroidPhoto';

const MediaGallery = ({ filters = {}, onItemSelect }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('polaroid'); // 'polaroid' | 'grid' | 'masonry'
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    loadMediaItems(true); // Reset ao mudar filtros
  }, [filters]);

  const loadMediaItems = async (reset = false) => {
    if (loading && !reset) return;
    
    setLoading(true);
    if (reset) {
      setError(null);
      setPage(0);
      setMediaItems([]);
    }

    try {
      const currentPage = reset ? 0 : page;
      
      const response = await atomService.getMediaItems({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        sort: filters.sort || 'alphabetic',
        ...filters
      });

      const newItems = response.results || [];
      
      if (reset) {
        setMediaItems(newItems);
      } else {
        setMediaItems(prev => [...prev, ...newItems]);
      }
      
      setHasMore(newItems.length === ITEMS_PER_PAGE);
      setPage(currentPage + 1);
      
    } catch (err) {
      console.error('Erro ao carregar itens de mídia:', err);
      setError('Erro ao carregar galeria. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadMediaItems(false);
    }
  };

  const handleItemClick = async (item) => {
    setSelectedItem(item);
    onItemSelect?.(item);
    
    // Buscar detalhes completos do item
    try {
      const fullItem = await atomService.getItem(item.slug);
      setSelectedItem(fullItem);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const PolaroidGallery = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mediaItems.map((item, index) => (
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, y: 20, rotate: Math.random() * 4 - 2 }}
          animate={{ opacity: 1, y: 0, rotate: Math.random() * 4 - 2 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            rotate: 0,
            zIndex: 10
          }}
          className="cursor-pointer"
          onClick={() => handleItemClick(item)}
        >
          <PolaroidPhoto
            src={item.thumbnail_url}
            alt={item.title}
            caption={item.title}
            className="w-full"
          />
        </motion.div>
      ))}
    </div>
  );

  const GridGallery = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {mediaItems.map((item, index) => (
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="relative group cursor-pointer aspect-square overflow-hidden rounded-lg border border-yellow-400/30"
          onClick={() => handleItemClick(item)}
        >
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-sm font-medium line-clamp-2">
                {item.title}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const MasonryGallery = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {mediaItems.map((item, index) => (
        <motion.div
          key={item.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="break-inside-avoid cursor-pointer group"
          onClick={() => handleItemClick(item)}
        >
          <div className="relative overflow-hidden rounded-lg border border-yellow-400/30 mb-4">
            <img
              src={item.thumbnail_url}
              alt={item.title}
              className="w-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-medium">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderGallery = () => {
    switch (viewMode) {
      case 'polaroid': return <PolaroidGallery />;
      case 'grid': return <GridGallery />;
      case 'masonry': return <MasonryGallery />;
      default: return <PolaroidGallery />;
    }
  };

  if (loading && mediaItems.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-yellow-400 text-lg">
            <span className="animate-spin mr-2">⏳</span>
            Carregando galeria...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-scratchy text-yellow-400 flex items-center">
            <span className="mr-2">🖼️</span>
            Galeria ({mediaItems.length})
          </h2>
          
          <div className="flex items-center space-x-3">
            {/* Modo de visualização */}
            <div className="flex bg-black/50 border border-yellow-400/30 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('polaroid')}
                className={`px-3 py-1 text-sm transition-colors ${
                  viewMode === 'polaroid' 
                    ? 'bg-yellow-400 text-black' 
                    : 'text-yellow-400 hover:bg-yellow-400/20'
                }`}
                title="Polaroids"
              >
                📷
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-yellow-400 text-black' 
                    : 'text-yellow-400 hover:bg-yellow-400/20'
                }`}
                title="Grade"
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('masonry')}
                className={`px-3 py-1 text-sm transition-colors ${
                  viewMode === 'masonry' 
                    ? 'bg-yellow-400 text-black' 
                    : 'text-yellow-400 hover:bg-yellow-400/20'
                }`}
                title="Masonry"
              >
                ⚏
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Galeria */}
      {error ? (
        <div className="bg-black/40 backdrop-blur-sm border border-red-400/30 rounded-lg p-6">
          <div className="text-center text-red-400">
            <div className="text-2xl mb-2">⚠️</div>
            <div>{error}</div>
            <button
              onClick={() => loadMediaItems(true)}
              className="mt-4 px-4 py-2 bg-red-600/80 text-white rounded hover:bg-red-600 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-12">
          <div className="text-center text-yellow-100/70">
            <div className="text-6xl mb-4">📷</div>
            <div className="text-xl mb-2">Nenhuma imagem encontrada</div>
            <div className="text-sm">Tente ajustar os filtros de busca</div>
          </div>
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6">
          {renderGallery()}
          
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-3 bg-yellow-400/20 border border-yellow-400/50 text-yellow-400 rounded-lg hover:bg-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span>
                    Carregando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="mr-2">⬇️</span>
                    Carregar Mais
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-black border border-yellow-400 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-scratchy text-yellow-400">
                    {selectedItem.title}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-yellow-400 hover:text-yellow-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Imagem */}
                <div className="mb-6">
                  <img
                    src={selectedItem.digital_object?.url || selectedItem.thumbnail_url}
                    alt={selectedItem.title}
                    className="w-full max-w-2xl mx-auto rounded-lg border border-yellow-400/30"
                  />
                </div>

                {/* Detalhes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-yellow-100">
                  <div className="space-y-3">
                    {selectedItem.reference_code && (
                      <div>
                        <span className="text-yellow-400 font-medium">Código:</span>
                        <div>{selectedItem.reference_code}</div>
                      </div>
                    )}
                    
                    {selectedItem.creators && selectedItem.creators.length > 0 && (
                      <div>
                        <span className="text-yellow-400 font-medium">Criador:</span>
                        <div>{selectedItem.creators[0].authorized_form_of_name}</div>
                      </div>
                    )}
                    
                    {selectedItem.dates && selectedItem.dates.length > 0 && (
                      <div>
                        <span className="text-yellow-400 font-medium">Data:</span>
                        <div>{selectedItem.dates[0].date}</div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {selectedItem.digital_object && (
                      <div>
                        <span className="text-yellow-400 font-medium">Tipo:</span>
                        <div>{selectedItem.digital_object.media_type}</div>
                      </div>
                    )}
                    
                    {selectedItem.extent_and_medium && (
                      <div>
                        <span className="text-yellow-400 font-medium">Formato:</span>
                        <div>{selectedItem.extent_and_medium}</div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedItem.scope_and_content && (
                  <div className="mt-6">
                    <span className="text-yellow-400 font-medium block mb-2">Descrição:</span>
                    <p className="text-yellow-100 leading-relaxed">
                      {selectedItem.scope_and_content}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;
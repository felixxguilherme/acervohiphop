'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLatestItems, getMediaItems, getCollections } from '@/services/atomApi';
import PolaroidCard from '@/components/PolaroidPhoto';
import { CartoonButton } from '@/components/ui/cartoon-button';

// AIDEV-NOTE: Component to display real data from AtoM API on homepage
export default function AcervoRealData() {
  const [latestItems, setLatestItems] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [latestResponse, mediaResponse, collectionsResponse] = await Promise.all([
          getLatestItems(6),
          getMediaItems(6),
          getCollections(8)
        ]);
        
        setLatestItems(latestResponse.results || []);
        setMediaItems(mediaResponse.results || []);
        setCollections(collectionsResponse.results || []);
        
      } catch (err) {
        console.error('Error fetching acervo data:', err);
        setError(err.message);
        setIsApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#1a1a1a', padding: '4rem 2rem', color: 'white' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-600 rounded mb-8 mx-auto max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If API is not available, don't render the section at all
  if (!isApiAvailable || error) {
    console.warn('AcervoRealData: API not available, hiding section');
    return null;
  }

  return (
    <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#1a1a1a', padding: '4rem 2rem', color: 'white' }}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl md:text-8xl font-dirty-stains mb-4 text-yellow-400">
            ACERVO VIVO
          </h2>
          <p className="text-xl md:text-2xl font-sometype-mono text-gray-300 max-w-3xl mx-auto">
            Documentos, fotos e memórias reais do Hip Hop brasiliense, direto do nosso arquivo digital
          </p>
          <div className="mt-4 flex justify-center">
            <span className="text-sm bg-green-600 px-3 py-1 rounded-full text-theme">
              🔗 Conectado ao Acervo Digital
            </span>
          </div>
        </motion.div>

        {/* Latest Items */}
        {latestItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="text-4xl font-dirty-stains mb-8 text-center text-green-400">
              ÚLTIMAS ADIÇÕES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestItems.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-gray-800 p-4 rounded-lg border border-gray-600"
                >
                  {item.thumbnail_url && (
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded mb-4"
                      loading="lazy"
                    />
                  )}
                  <h4 className="text-lg font-sometype-mono mb-2 text-yellow-300 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    {item.level_of_description}
                  </p>
                  {item.creation_dates && item.creation_dates.length > 0 && (
                    <p className="text-xs text-green-300">
                      {item.creation_dates[0]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Media Items */}
        {mediaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-4xl font-dirty-stains mb-8 text-center text-red-400">
              GALERIA DE IMAGENS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <PolaroidCard
                    src={item.thumbnail_url || '/placeholder-image.webp'}
                    alt={item.title}
                    caption={item.title}
                    size="md"
                    rotation={`rotate-${(index % 3 + 1) * 2}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Collections */}
        {collections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-4xl font-dirty-stains mb-8 text-center text-blue-400">
              COLEÇÕES PRINCIPAIS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collections.slice(0, 6).map((item, index) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg border-l-4 border-blue-400"
                >
                  <h4 className="text-xl font-sometype-mono mb-3 text-blue-300 line-clamp-2">
                    {item.title}
                  </h4>
                  {item.physical_characteristics && (
                    <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                      {item.physical_characteristics}
                    </p>
                  )}
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{item.level_of_description}</span>
                    {item.creation_dates && item.creation_dates.length > 0 && (
                      <span className="text-green-300">{item.creation_dates[0]}</span>
                    )}
                  </div>
                  {item.place_access_points && item.place_access_points.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded text-yellow-300">
                        📍 {item.place_access_points[0]}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-900/50 to-red-900/50 p-8 rounded-lg border border-purple-400/30 text-center"
        >
          <h3 className="text-3xl font-dirty-stains mb-6 text-purple-300">
            ESTATÍSTICAS DO ACERVO
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-sometype-mono text-yellow-400 mb-2">39</div>
              <div className="text-sm text-gray-300">Itens Catalogados</div>
            </div>
            <div>
              <div className="text-3xl font-sometype-mono text-green-400 mb-2">{mediaItems.length}</div>
              <div className="text-sm text-gray-300">Imagens Digitalizadas</div>
            </div>
            <div>
              <div className="text-3xl font-sometype-mono text-blue-400 mb-2">{collections.length}</div>
              <div className="text-sm text-gray-300">Coleções Organizadas</div>
            </div>
          </div>
          
          <div className="mt-8">
            <CartoonButton 
              text="EXPLORAR ACERVO COMPLETO" 
              textSize="text-xl"
              backgroundMode="static" 
              imagePath="marca-texto-roxo.webp"
              onClick={() => window.location.href = '/acervo'}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
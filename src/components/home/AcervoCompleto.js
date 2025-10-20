'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInformationObjects } from '@/services/atomApi';

// AIDEV-NOTE: Component to display ALL 39 items from the acervo in a comprehensive view
export default function AcervoCompleto() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch ALL items at once
        const response = await getInformationObjects({ 
          limit: 39, // Get all items
          sort: 'lastUpdated'
        });
        
        setAllItems(response.results || []);
        
      } catch (err) {
        console.error('Error fetching complete acervo:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#0a0a0a', padding: '4rem 2rem', color: 'white' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-600 rounded mb-8 mx-auto max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#0a0a0a', padding: '4rem 2rem', color: 'white' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-dirty-stains mb-8 text-red-400">ERRO AO CARREGAR ACERVO</h2>
          <p className="text-xl font-sometype-mono mb-8">
            {error}
          </p>
        </div>
      </section>
    );
  }

  // Categorize items
  const mediaItems = allItems.filter(item => item.thumbnail_url);
  const textualItems = allItems.filter(item => !item.thumbnail_url);
  const itemsWithDates = allItems.filter(item => item.creation_dates && item.creation_dates.length > 0);

  return (
    <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#0a0a0a', padding: '4rem 2rem', color: 'white' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Statistics - Brutalista Style */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative mb-12">
            <h2 className="text-7xl md:text-9xl font-dirty-stains mb-4 text-white transform rotate-1">
              ACERVO
            </h2>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-4">
              <h2 className="text-7xl md:text-9xl font-dirty-stains text-black opacity-50 -rotate-1">
                ACERVO
              </h2>
            </div>
          </div>
          
          <div className="bg-black border-2 border-white p-8 transform -rotate-1 mb-12 mx-auto max-w-4xl">
            <p className="text-xl md:text-2xl font-sometype-mono text-white transform rotate-1">
              {allItems.length} DOCUMENTOS DO HIP HOP BRASILIENSE
            </p>
          </div>
          
          {/* Statistics Grid - Brutalista */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <div className="bg-white border-2 border-black p-6 transform rotate-1">
              <div className="text-3xl md:text-4xl font-sometype-mono text-black font-black mb-2">
                {allItems.length}
              </div>
              <div className="text-xs md:text-sm text-black font-bold uppercase tracking-wider">
                TOTAL ITENS
              </div>
            </div>
            <div className="bg-white border-2 border-black p-6 transform -rotate-1">
              <div className="text-3xl md:text-4xl font-sometype-mono text-black font-black mb-2">
                {mediaItems.length}
              </div>
              <div className="text-xs md:text-sm text-black font-bold uppercase tracking-wider">
                IMAGENS
              </div>
            </div>
            <div className="bg-white border-2 border-black p-6 transform rotate-2">
              <div className="text-3xl md:text-4xl font-sometype-mono text-black font-black mb-2">
                {textualItems.length}
              </div>
              <div className="text-xs md:text-sm text-black font-bold uppercase tracking-wider">
                TEXTOS
              </div>
            </div>
            <div className="bg-white border-2 border-black p-6 transform -rotate-2">
              <div className="text-3xl md:text-4xl font-sometype-mono text-black font-black mb-2">
                {itemsWithDates.length}
              </div>
              <div className="text-xs md:text-sm text-black font-bold uppercase tracking-wider">
                DATADOS
              </div>
            </div>
          </div>
        </motion.div>

        {/* Media Items Section - Brutalista */}
        {mediaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-20"
          >
            <div className="bg-white border-2 border-black p-6 mb-12 transform rotate-1">
              <h3 className="text-4xl md:text-5xl font-dirty-stains text-black text-center transform -rotate-1">
                {mediaItems.length} IMAGENS HISTÓRICAS
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mediaItems.map((item, index) => (
                <motion.div
                  key={item.slug}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`
                    border-2 border-black bg-white p-4 transform
                    ${index % 3 === 0 ? 'rotate-1' : index % 3 === 1 ? '-rotate-1' : 'rotate-2'}
                    hover:scale-105 transition-all duration-300
                  `}
                >
                  <div className="aspect-square bg-white border-2 border-black mb-4 overflow-hidden">
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="bg-white border border-black p-3 transform -rotate-1">
                    <h4 className="text-sm font-sometype-mono text-black font-bold uppercase line-clamp-2 mb-2">
                      {item.title}
                    </h4>
                    <div className="text-xs bg-black text-white px-2 py-1 font-mono uppercase tracking-wide">
                      #{item.slug}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Items Grid - Complete List - Brutalista */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <div className="bg-black border-2 border-white p-8 mb-12 transform -rotate-1">
            <h3 className="text-4xl md:text-6xl font-dirty-stains text-white text-center transform rotate-1">
              TODOS OS {allItems.length} ITENS
            </h3>
          </div>
          
          {/* Category Tags - Brutalista */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white border border-black px-4 py-2 transform rotate-1">
              <span className="text-black font-sometype-mono text-sm font-bold uppercase">COMPOSIÇÕES</span>
            </div>
            <div className="bg-black border border-white px-4 py-2 transform -rotate-1">
              <span className="text-white font-sometype-mono text-sm font-bold uppercase">FOTOGRAFIAS</span>
            </div>
            <div className="bg-white border border-black px-4 py-2 transform rotate-2">
              <span className="text-black font-sometype-mono text-sm font-bold uppercase">TEXTOS</span>
            </div>
            <div className="bg-black border border-white px-4 py-2 transform -rotate-2">
              <span className="text-white font-sometype-mono text-sm font-bold uppercase">IMPRENSA</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allItems.map((item, index) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`
                  border-2 border-black bg-white p-6 transform transition-all duration-300 hover:scale-105
                  ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}
                `}
              >
                {/* Item Header */}
                <div className="mb-4">
                  <div className="border-2 border-black bg-black p-3 mb-3 transform -rotate-1">
                    <h4 className="text-sm font-sometype-mono font-bold uppercase line-clamp-2 text-white">
                      {item.title}
                    </h4>
                  </div>
                  
                  {item.reference_code && (
                    <div className="text-xs px-2 py-1 font-mono font-bold uppercase tracking-wide inline-block bg-black text-white">
                      {item.reference_code}
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="space-y-2 text-xs">
                  {item.physical_characteristics && (
                    <div className="border border-black p-2 transform rotate-1">
                      <p className="font-sometype-mono uppercase font-bold line-clamp-3 text-black">
                        {item.physical_characteristics}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    {item.creation_dates && item.creation_dates.length > 0 && (
                      <div className="px-2 py-1 font-mono font-bold text-xs bg-black text-white">
                        {item.creation_dates[0]}
                      </div>
                    )}
                    
                    {item.place_access_points && item.place_access_points.length > 0 && (
                      <div className="px-2 py-1 font-mono font-bold text-xs bg-black text-white">
                        {item.place_access_points[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Item Footer */}
                <div className="mt-4 pt-2 flex justify-between items-center text-xs">
                  <div className="w-8 h-8 flex items-center justify-center font-mono font-bold bg-black text-white">
                    {index + 1}
                  </div>
                  <div className="px-2 py-1 font-mono text-xs text-black">
                    #{item.slug}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Summary Footer - Brutalista */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white border-2 border-black p-8 transform rotate-1"
        >
          <div className="bg-white border-2 border-black p-6 transform -rotate-2">
            <h3 className="text-3xl md:text-4xl font-dirty-stains mb-8 text-black text-center">
              ESTATÍSTICAS FINAIS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-black border-2 border-black p-4">
                <div className="text-2xl font-sometype-mono text-white font-black mb-1">
                  {allItems.filter(item => item.title.includes('Dino Black')).length}
                </div>
                <div className="text-xs text-white font-bold uppercase">DINO BLACK</div>
              </div>
              <div className="bg-white border-2 border-black p-4">
                <div className="text-2xl font-sometype-mono text-black font-black mb-1">
                  {allItems.filter(item => item.title.includes('Composição')).length}
                </div>
                <div className="text-xs text-black font-bold uppercase">COMPOSIÇÕES</div>
              </div>
              <div className="bg-black border-2 border-black p-4">
                <div className="text-2xl font-sometype-mono text-white font-black mb-1">
                  {allItems.filter(item => item.creation_dates && item.creation_dates.some(date => date.includes('1994'))).length}
                </div>
                <div className="text-xs text-white font-bold uppercase">ANO 1994</div>
              </div>
              <div className="bg-white border-2 border-black p-4">
                <div className="text-2xl font-sometype-mono text-black font-black mb-1">
                  {allItems.filter(item => item.title.includes('GOG')).length}
                </div>
                <div className="text-xs text-black font-bold uppercase">GOG</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
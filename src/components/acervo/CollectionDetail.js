'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInformationObjects } from '@/services/atomApi';

// AIDEV-NOTE: Reusable collection detail component that works for any collection
export default function CollectionDetail({ collectionId, collectionName }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, media, textual
  const [filterYear, setFilterYear] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetic');

  // Computed data
  const [availableYears, setAvailableYears] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    media: 0,
    textual: 0,
    dated: 0
  });

  useEffect(() => {
    const fetchCollectionItems = async () => {
      try {
        setLoading(true);
        
        // Fetch all items
        const response = await getInformationObjects({ 
          limit: 1000, 
          sort: sortBy 
        });
        
        // Filter items for this collection
        let collectionItems = [];
        
        if (collectionId === 'dino-black') {
          // Current logic for Dino Black collection
          collectionItems = response.results.filter(item => 
            item.title.toLowerCase().includes('dino black') ||
            (item.creators && item.creators.some(creator => 
              creator.authorized_form_of_name?.toLowerCase().includes('dino black')
            ))
          );
        } else {
          // Generic logic for future collections
          collectionItems = response.results.filter(item => {
            // Filter by creator
            if (item.creators) {
              return item.creators.some(creator => {
                const creatorSlug = creator.authorized_form_of_name?.toLowerCase().replace(/\s+/g, '-');
                return creatorSlug === collectionId;
              });
            }
            
            // Filter by title pattern
            const titleWords = item.title.toLowerCase().split(/\s+/);
            const collectionWords = collectionId.split('-');
            
            return collectionWords.every(word => 
              titleWords.some(titleWord => titleWord.includes(word))
            );
          });
        }
        
        // Extract available years and locations
        const years = new Set();
        const locations = new Set();
        
        collectionItems.forEach(item => {
          if (item.creation_dates) {
            item.creation_dates.forEach(date => {
              const year = new Date(date).getFullYear();
              if (!isNaN(year)) years.add(year);
            });
          }
          
          if (item.place_access_points) {
            item.place_access_points.forEach(place => locations.add(place));
          }
        });
        
        setAvailableYears(Array.from(years).sort());
        setAvailableLocations(Array.from(locations));
        
        // Calculate statistics
        setStatistics({
          total: collectionItems.length,
          media: collectionItems.filter(item => item.thumbnail_url).length,
          textual: collectionItems.filter(item => !item.thumbnail_url).length,
          dated: collectionItems.filter(item => item.creation_dates?.length > 0).length
        });
        
        setItems(collectionItems);
        setFilteredItems(collectionItems);
        
      } catch (err) {
        console.error('Error fetching collection items:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (collectionId) {
      fetchCollectionItems();
    }
  }, [collectionId, sortBy]);

  // Apply filters
  useEffect(() => {
    let filtered = [...items];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.physical_characteristics?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (filterType === 'media') {
      filtered = filtered.filter(item => item.thumbnail_url);
    } else if (filterType === 'textual') {
      filtered = filtered.filter(item => !item.thumbnail_url);
    }
    
    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter(item =>
        item.creation_dates?.some(date => 
          new Date(date).getFullYear().toString() === filterYear
        )
      );
    }
    
    // Location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(item =>
        item.place_access_points?.includes(filterLocation)
      );
    }
    
    setFilteredItems(filtered);
  }, [items, searchTerm, filterType, filterYear, filterLocation]);

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-600 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-dirty-stains mb-4 text-red-400">
            ERRO AO CARREGAR COLEÇÃO
          </h2>
          <p className="text-lg font-sometype-mono text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Collection Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-dirty-stains text-white transform rotate-1 mb-6">
              {collectionName?.toUpperCase() || 'COLEÇÃO'}
            </h1>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white border-2 border-black p-6 transform rotate-1">
                <div className="text-3xl font-sometype-mono text-black font-black mb-2">
                  {statistics.total}
                </div>
                <div className="text-xs text-black font-bold uppercase">TOTAL</div>
              </div>
              <div className="bg-white border-2 border-black p-6 transform -rotate-1">
                <div className="text-3xl font-sometype-mono text-black font-black mb-2">
                  {statistics.media}
                </div>
                <div className="text-xs text-black font-bold uppercase">IMAGENS</div>
              </div>
              <div className="bg-white border-2 border-black p-6 transform rotate-2">
                <div className="text-3xl font-sometype-mono text-black font-black mb-2">
                  {statistics.textual}
                </div>
                <div className="text-xs text-black font-bold uppercase">TEXTOS</div>
              </div>
              <div className="bg-white border-2 border-black p-6 transform -rotate-2">
                <div className="text-3xl font-sometype-mono text-black font-black mb-2">
                  {statistics.dated}
                </div>
                <div className="text-xs text-black font-bold uppercase">DATADOS</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border-2 border-black p-8 transform -rotate-1">
            <div className="transform rotate-1">
              
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Buscar na coleção..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-4 border-2 border-black font-sometype-mono text-lg focus:outline-none"
                />
              </div>

              {/* Filter Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Type Filter */}
                <div>
                  <label className="block text-xs font-bold text-black uppercase mb-2">
                    Tipo:
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full p-2 border-2 border-black font-sometype-mono text-sm"
                  >
                    <option value="all">Todos</option>
                    <option value="media">Imagens</option>
                    <option value="textual">Textos</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-xs font-bold text-black uppercase mb-2">
                    Ano:
                  </label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="w-full p-2 border-2 border-black font-sometype-mono text-sm"
                  >
                    <option value="all">Todos</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-xs font-bold text-black uppercase mb-2">
                    Local:
                  </label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full p-2 border-2 border-black font-sometype-mono text-sm"
                  >
                    <option value="all">Todos</option>
                    {availableLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-bold text-black uppercase mb-2">
                    Ordenar:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border-2 border-black font-sometype-mono text-sm"
                  >
                    <option value="alphabetic">A-Z</option>
                    <option value="date">Data</option>
                    <option value="identifier">Código</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-center">
                <span className="bg-black text-white px-4 py-2 font-sometype-mono text-sm font-bold">
                  {filteredItems.length} RESULTADO{filteredItems.length !== 1 ? 'S' : ''}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`
                bg-white border-2 border-black p-6 transform transition-all duration-300 hover:scale-105
                ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}
              `}
            >
              {/* Item Image */}
              {item.thumbnail_url && (
                <div className="aspect-square bg-gray-100 border-2 border-black mb-4 overflow-hidden">
                  <img 
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              )}

              {/* Item Header */}
              <div className="mb-4">
                <h3 className="font-sometype-mono font-bold text-sm text-black mb-2 line-clamp-2 uppercase">
                  {item.title}
                </h3>
                
                {item.reference_code && (
                  <div className="bg-black text-white px-2 py-1 font-mono text-xs uppercase inline-block mb-2">
                    {item.reference_code}
                  </div>
                )}
              </div>

              {/* Item Details */}
              <div className="space-y-2 text-xs">
                {item.physical_characteristics && (
                  <div className="border border-black p-2">
                    <p className="font-sometype-mono text-black line-clamp-3">
                      {item.physical_characteristics}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {item.creation_dates?.map((date, i) => (
                    <span key={i} className="bg-black text-white px-2 py-1 font-mono text-xs">
                      {date}
                    </span>
                  ))}
                  
                  {item.place_access_points?.map((place, i) => (
                    <span key={i} className="bg-gray-800 text-white px-2 py-1 font-mono text-xs">
                      {place}
                    </span>
                  ))}
                </div>
              </div>

              {/* Item Footer */}
              <div className="mt-4 pt-2 flex justify-between items-center text-xs">
                <div className="font-mono text-gray-600">
                  #{item.slug}
                </div>
                <div className="bg-black text-white px-2 py-1 font-mono">
                  {item.level_of_description}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-white border-2 border-black p-8 mx-auto max-w-lg">
              <h3 className="text-2xl font-dirty-stains text-black mb-4">
                NENHUM RESULTADO
              </h3>
              <p className="font-sometype-mono text-black">
                Tente ajustar os filtros de busca
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
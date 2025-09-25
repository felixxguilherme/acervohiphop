'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getInformationObjects, getTaxonomy } from '@/services/atomApi';

// AIDEV-NOTE: Scalable collections grid that auto-detects new collections when added to API
export default function CollectionGrid({ onSelectCollection }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);

        // Get all items and group by creator/collection
        const allItems = await getInformationObjects({ limit: 1000, sort: 'alphabetic' });
        
        // Get subjects taxonomy to identify collections
        const subjects = await getTaxonomy(35); // Subjects taxonomy
        
        // Group items by creator/collection
        const collectionsMap = {};
        
        allItems.results.forEach(item => {
          // Extract collection identifier - could be by creator, subject, or pattern
          let collectionKey = 'unknown';
          let collectionName = 'Coleção Não Identificada';
          
          // Method 1: By title pattern (Dino Black detection)
          if (item.title.toLowerCase().includes('dino black')) {
            collectionKey = 'dino-black';
            collectionName = 'Coleção Dino Black';
          }
          // Method 2: By creators array
          else if (item.creators && item.creators.length > 0) {
            const creator = item.creators[0];
            collectionKey = creator.authorized_form_of_name.toLowerCase().replace(/\s+/g, '-');
            collectionName = `Coleção ${creator.authorized_form_of_name}`;
          }
          // Method 3: By subjects (when available)
          else if (subjects && subjects.length > 0) {
            // Find matching subject
            const matchingSubject = subjects.find(subject => 
              item.title.toLowerCase().includes(subject.toLowerCase())
            );
            if (matchingSubject) {
              collectionKey = matchingSubject.toLowerCase().replace(/\s+/g, '-');
              collectionName = `Coleção ${matchingSubject}`;
            }
          }
          
          // Initialize collection if not exists
          if (!collectionsMap[collectionKey]) {
            collectionsMap[collectionKey] = {
              id: collectionKey,
              name: collectionName,
              items: [],
              totalItems: 0,
              mediaItems: 0,
              textualItems: 0,
              locations: new Set(),
              dateRange: { earliest: null, latest: null },
              featured_item: null
            };
          }
          
          // Add item to collection
          collectionsMap[collectionKey].items.push(item);
          collectionsMap[collectionKey].totalItems++;
          
          // Count media vs textual items
          if (item.thumbnail_url) {
            collectionsMap[collectionKey].mediaItems++;
            // Set first media item as featured
            if (!collectionsMap[collectionKey].featured_item) {
              collectionsMap[collectionKey].featured_item = item;
            }
          } else {
            collectionsMap[collectionKey].textualItems++;
          }
          
          // Track locations
          if (item.place_access_points) {
            item.place_access_points.forEach(place => {
              collectionsMap[collectionKey].locations.add(place);
            });
          }
          
          // Track date range
          if (item.creation_dates && item.creation_dates.length > 0) {
            const itemDate = new Date(item.creation_dates[0]);
            const collection = collectionsMap[collectionKey];
            
            if (!collection.dateRange.earliest || itemDate < collection.dateRange.earliest) {
              collection.dateRange.earliest = itemDate;
            }
            if (!collection.dateRange.latest || itemDate > collection.dateRange.latest) {
              collection.dateRange.latest = itemDate;
            }
          }
        });
        
        // Convert to array and sort by total items (largest first)
        const collectionsArray = Object.values(collectionsMap)
          .map(collection => ({
            ...collection,
            locations: Array.from(collection.locations)
          }))
          .sort((a, b) => b.totalItems - a.totalItems);
        
        console.log('📚 Collections detected:', collectionsArray.length);
        console.log('🔍 Collections details:', collectionsArray);
        
        setCollections(collectionsArray);
        
      } catch (err) {
        console.error('Error fetching collections:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-600 rounded mb-8 mx-auto max-w-md"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-dirty-stains mb-4 text-red-400">
            ERRO AO CARREGAR COLEÇÕES
          </h2>
          <p className="text-lg font-sometype-mono text-gray-300">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-8xl font-dirty-stains mb-6 text-white transform rotate-1">
            COLEÇÕES
          </h2>
          <div className="bg-white border-2 border-black p-6 transform -rotate-1 mx-auto max-w-2xl">
            <p className="text-xl font-sometype-mono text-black font-bold">
              {collections.length} COLEÇÃO{collections.length !== 1 ? 'ÕES' : ''} DISPONÍVEL{collections.length !== 1 ? 'EIS' : ''}
            </p>
          </div>
        </motion.div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`
                bg-white border-2 border-black p-8 transform transition-all duration-300 hover:scale-105
                ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}
              `}
            >
              {/* Collection Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-dirty-stains text-black mb-4 transform -rotate-1">
                  {collection.name.toUpperCase()}
                </h3>
                
                {/* Featured Image */}
                {collection.featured_item?.thumbnail_url && (
                  <div className="aspect-square bg-gray-100 border-2 border-black mb-4 overflow-hidden">
                    <img 
                      src={collection.featured_item.thumbnail_url}
                      alt={collection.featured_item.title}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-black border border-black p-3 text-center">
                  <div className="text-2xl font-sometype-mono text-white font-bold">
                    {collection.totalItems}
                  </div>
                  <div className="text-xs text-white uppercase">ITENS</div>
                </div>
                <div className="bg-white border border-black p-3 text-center">
                  <div className="text-2xl font-sometype-mono text-black font-bold">
                    {collection.mediaItems}
                  </div>
                  <div className="text-xs text-black uppercase">IMAGENS</div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-6">
                {collection.locations.length > 0 && (
                  <div className="text-xs">
                    <div className="font-sometype-mono font-bold text-black mb-1 uppercase">
                      Localização:
                    </div>
                    <div className="bg-black text-white px-2 py-1 font-mono text-xs">
                      {collection.locations[0]}
                      {collection.locations.length > 1 && ` +${collection.locations.length - 1}`}
                    </div>
                  </div>
                )}
                
                {collection.dateRange.earliest && (
                  <div className="text-xs">
                    <div className="font-sometype-mono font-bold text-black mb-1 uppercase">
                      Período:
                    </div>
                    <div className="bg-black text-white px-2 py-1 font-mono text-xs">
                      {collection.dateRange.earliest.getFullYear()}
                      {collection.dateRange.latest && 
                       collection.dateRange.latest.getFullYear() !== collection.dateRange.earliest.getFullYear() &&
                       ` - ${collection.dateRange.latest.getFullYear()}`
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button 
                className="w-full bg-black border-2 border-black text-white font-sometype-mono font-bold text-sm py-3 px-4 transform hover:-rotate-1 transition-all duration-200 uppercase"
                onClick={() => {
                  if (onSelectCollection) {
                    onSelectCollection(collection);
                  }
                }}
              >
                Explorar Coleção
              </button>
              
              {/* Collection ID */}
              <div className="mt-4 text-center">
                <div className="text-xs font-mono text-gray-600">
                  #{collection.id}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-detection Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-black border border-white p-6 mx-auto max-w-3xl">
            <p className="text-sm font-sometype-mono text-white">
              🤖 <strong>DETECÇÃO AUTOMÁTICA:</strong> Novas coleções aparecerão automaticamente quando adicionadas à API
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
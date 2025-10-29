"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import atomItemsResponse from '@/data/docItems';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // GUI-NOTE: Live search filtering through all item fields including title, subjects, places, and content
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return atomItemsResponse.results;
    
    const term = searchTerm.toLowerCase();
    return atomItemsResponse.results.filter(item => {
      return (
        item.title.toLowerCase().includes(term) ||
        item.scopeAndContent.toLowerCase().includes(term) ||
        item.subjects.some(subject => subject.toLowerCase().includes(term)) ||
        item.places.some(place => place.name.toLowerCase().includes(term)) ||
        item.creators.some(creator => creator.name.toLowerCase().includes(term))
      );
    });
  }, [searchTerm]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar no acervo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-black/60 border-2 border-theme/30 rounded-lg text-theme placeholder-white/60 text-lg font-mono focus:border-yellow-400 focus:outline-none transition-colors duration-300"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-theme/60">
            🔍
          </div>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-theme/80 text-sm mt-2 font-mono"
        >
          {filteredItems.length} {filteredItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
        </motion.p>
      </motion.div>

      {/* Results Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filteredItems.length}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/70 border border-theme/20 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-colors duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.digitalObjects?.[0]?.thumbnail || '/fundo-base-branca-1.webp'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="inline-block px-2 py-1 bg-yellow-400 text-theme text-xs font-bold rounded uppercase">
                    {item.identifier}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-theme font-bold text-lg mb-2 line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-theme/80 text-sm mb-3 line-clamp-3">
                  {item.scopeAndContent}
                </p>

                {/* Metadata */}
                <div className="space-y-2">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-yellow-400">📅</span>
                    <span className="text-theme/70 font-mono">
                      {new Date(item.dates[0].startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  {/* Location */}
                  {item.places && item.places.length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-yellow-400">📍</span>
                      <span className="text-theme/70">
                        {item.places[0].name}
                      </span>
                    </div>
                  )}

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {item.subjects.slice(0, 3).map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-white/10 text-theme/80 text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                    {item.subjects.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-theme/60 text-xs rounded-full">
                        +{item.subjects.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* No Results */}
      {searchTerm && filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-theme text-2xl font-bold mb-2">
            Nenhum item encontrado
          </h3>
          <p className="text-theme/60 max-w-md mx-auto">
            Tente buscar por outros termos como "hip hop", "breaking", "grafite", "ceilândia", etc.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SearchComponent;
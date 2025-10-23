'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function SearchResults({ results, loading, query, total }) {
  console.info('[SearchResults] 📊 Props recebidas:', { 
    resultsCount: results?.length, 
    loading, 
    query, 
    total,
    results: results 
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-12 bg-yellow-400 rounded-sm"
              initial={{ height: 8 }}
              animate={{
                height: [8, 32, 8],
                backgroundColor: ["#facc15", "#fef08a", "#facc15"]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // No query yet
  if (!query) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-dirty-stains text-theme mb-3">
            Explore o Acervo Hip Hop DF
          </h3>
          <p className="text-theme/70 font-sometype-mono">
            Digite um termo na busca acima para encontrar documentos, 
            composições, imagens e muito mais sobre a história do Hip Hop no Distrito Federal.
          </p>
        </motion.div>
      </div>
    );
  }

  // No results found
  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🤷</div>
          <h3 className="text-2xl font-dirty-stains text-theme mb-3">
            Nenhum resultado encontrado
          </h3>
          <p className="text-theme/70 font-sometype-mono mb-6">
            Não encontramos nada para "<strong className="text-yellow-400">{query}</strong>"
          </p>
          <div className="bg-white/10 backdrop-blur-sm border border-theme/20 rounded-lg p-6">
            <p className="text-theme/90 font-sometype-mono text-sm mb-2">
              <strong>💡 Dicas de busca:</strong>
            </p>
            <ul className="text-theme/70 text-sm space-y-1 text-left max-w-md mx-auto">
              <li>• Tente termos mais gerais (ex: "Dino" ao invés de "Dino Black")</li>
              <li>• Busque por anos (ex: "1994")</li>
              <li>• Procure por locais (ex: "Candangolândia")</li>
              <li>• Use palavras-chave simples (ex: "composição", "rap")</li>
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }

  // Results found
  return (
    <div>
      {/* Header com contador */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 pb-4 border-b-2 border-theme/20"
      >
        <p className="text-theme font-sometype-mono">
          Encontrados <strong className="text-yellow-400 text-xl">{total}</strong> {total === 1 ? 'resultado' : 'resultados'} para 
          <strong className="text-yellow-400"> "{query}"</strong>
        </p>
      </motion.div>

      {/* Grid de resultados */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, index) => (
            <motion.div
              key={item.slug || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/90 backdrop-blur-sm border-3 border-theme 
                       hover:border-yellow-400 transition-all duration-200
                       hover:shadow-xl hover:-translate-y-1
                       overflow-hidden group"
            >
              {/* Imagem se disponível */}
              {item.thumbnail_url && (
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={item.thumbnail_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Conteúdo */}
              <div className="p-5">
                {/* Título */}
                <h3 className="font-scratchy text-xl text-theme mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                  {item.title}
                </h3>

                {/* Metadados */}
                <div className="space-y-2 text-sm font-sometype-mono text-gray-700">
                  {/* Código de referência */}
                  {item.reference_code && (
                    <p className="text-xs text-gray-500">
                      📋 {item.reference_code}
                    </p>
                  )}

                  {/* Data de criação */}
                  {item.creation_dates && item.creation_dates[0] && (
                    <p>
                      📅 {new Date(item.creation_dates[0]).toLocaleDateString('pt-BR')}
                    </p>
                  )}

                  {/* Localização */}
                  {item.place_access_points && item.place_access_points[0] && (
                    <p>
                      📍 {item.place_access_points[0]}
                    </p>
                  )}

                  {/* Nível de descrição */}
                  {item.level_of_description && (
                    <p className="text-xs">
                      🏷️ {item.level_of_description}
                    </p>
                  )}
                </div>

                {/* Descrição física (preview) */}
                {item.physical_characteristics && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {item.physical_characteristics}
                  </p>
                )}

                {/* Link para detalhes */}
                <Link 
                  href={`/acervo/${item.slug}`}
                  className="mt-4 inline-block px-4 py-2 
                           bg-yellow-400 hover:bg-yellow-300 
                           border-2 border-theme
                           font-scratchy text-sm
                           transition-all duration-200
                           hover:scale-105"
                >
                  Ver Detalhes →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}

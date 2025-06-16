/**
 * Componente de exemplo demonstrando o uso do sistema de dados do AtoM
 * Este componente mostra como usar os hooks e serviços criados
 */

'use client';

import { useState } from 'react';
import { 
  useAtomItems, 
  useAtomSearch, 
  useAtomStatistics, 
  useAtomTaxonomies,
  useAtomFormatters 
} from '../hooks/useAtom.js';

export default function AcervoExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Hooks para dados
  const { items, loading: itemsLoading, error: itemsError } = useAtomItems({ limit: 5 });
  const { results: searchResults, loading: searchLoading } = useAtomSearch(searchTerm);
  const { statistics, loading: statsLoading } = useAtomStatistics();
  const { subjects, places, loading: taxonomiesLoading } = useAtomTaxonomies();
  const { formatDate, formatFileSize, formatSubjects } = useAtomFormatters();

  const handleSearch = (e) => {
    e.preventDefault();
    // A busca é automática via hook
  };

  if (itemsLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800">Erro ao carregar dados</h3>
          <p className="text-red-600">{itemsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Acervo Hip Hop Distrito Federal
        </h1>
        <p className="text-lg text-gray-600">
          Sistema de gestão de dados culturais baseado no AtoM
        </p>
      </header>

      {/* Estatísticas */}
      {!statsLoading && statistics && (
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Visão Geral do Acervo</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statistics.overview.totalItems}
              </div>
              <div className="text-sm text-gray-600">Itens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statistics.overview.totalDigitalObjects}
              </div>
              <div className="text-sm text-gray-600">Objetos Digitais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.overview.totalFileSize}
              </div>
              <div className="text-sm text-gray-600">Tamanho Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statistics.overview.totalCollections}
              </div>
              <div className="text-sm text-gray-600">Coleções</div>
            </div>
          </div>
        </section>
      )}

      {/* Busca */}
      <section className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Buscar no Acervo</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite um termo de busca (ex: breaking, hip hop, ceilândia...)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            >
              Buscar
            </button>
          </div>
        </form>

        {searchLoading && (
          <div className="mt-4 text-center text-gray-600">
            Buscando...
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Resultados da Busca</h3>
            {searchResults.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex gap-4">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.identifier} • {formatDate(item.dates?.[0]?.startDate)}
                    </p>
                    <p className="text-gray-700 line-clamp-2">
                      {item.scopeAndContent}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {formatSubjects(item.subjects).slice(0, 3).map((subject, i) => (
                        <span
                          key={i}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Filtros por Taxonomia */}
      {!taxonomiesLoading && (
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Assuntos Principais</h3>
              <div className="space-y-1">
                {subjects.slice(0, 8).map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSearchTerm(subject.name)}
                    className="flex justify-between w-full px-3 py-2 text-left hover:bg-gray-100 rounded text-sm"
                  >
                    <span>{subject.name}</span>
                    <span className="text-gray-500">({subject.count})</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Localidades</h3>
              <div className="space-y-1">
                {places.slice(0, 8).map((place) => (
                  <button
                    key={place.id}
                    onClick={() => setSearchTerm(place.name)}
                    className="flex justify-between w-full px-3 py-2 text-left hover:bg-gray-100 rounded text-sm"
                  >
                    <span>{place.name}</span>
                    <span className="text-gray-500">({place.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Itens Recentes */}
      <section className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Itens Recentes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {item.digitalObjects?.[0]?.thumbnail && (
                <img
                  src={item.digitalObjects[0].thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.identifier} • {formatDate(item.dates?.[0]?.startDate)}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                  {item.scopeAndContent}
                </p>
                <div className="flex flex-wrap gap-1">
                  {formatSubjects(item.subjects).slice(0, 2).map((subject, i) => (
                    <span
                      key={i}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
                {item.digitalObjects?.[0] && (
                  <div className="mt-2 text-xs text-gray-500">
                    {item.digitalObjects[0].mediaType} • {formatFileSize(item.digitalObjects[0].byteSize)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Estatísticas por Região */}
      {!statsLoading && statistics?.byRegion && (
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Distribuição por Região</h2>
          <div className="space-y-2">
            {statistics.byRegion.map((region) => (
              <div key={region.region} className="flex items-center justify-between">
                <span className="font-medium">{region.region}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(region.count / Math.max(...statistics.byRegion.map(r => r.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {region.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
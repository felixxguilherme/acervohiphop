'use client';

import { useState, useEffect } from 'react';
import { getCollections, getInformationObject } from '@/services/atomApi';
import { getStaticCollections, getStaticItemDetails } from '@/services/staticFallback';
import { CartoonButton } from '@/components/ui/cartoon-button';

const CollectionCard = ({ collection, onViewDetails, isExpanded, onToggle }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!isExpanded && !details && collection.slug !== 'erro-api-fallback') {
      setLoading(true);
      try {
        let detailData;
        
        try {
          // Try API first
          detailData = await getInformationObject(collection.slug);
        } catch (apiError) {
          console.warn('⚠️ API falhou, usando fallback estático:', apiError.message);
          // Fallback to static data
          detailData = getStaticItemDetails(collection.slug);
          detailData._isStaticFallback = true;
        }
        
        setDetails(detailData);
      } catch (error) {
        console.error('❌ Erro ao carregar detalhes:', error);
        setDetails({
          error: true,
          message: `Não foi possível carregar os detalhes: ${error.message}`
        });
      } finally {
        setLoading(false);
      }
    }
    onToggle(collection.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-6 hover:border-yellow-400/60 transition-all mb-4"
    >
      {/* Cabeçalho da coleção */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-scratchy font-bold text-yellow-400 mb-2">
            {collection.title}
          </h3>
          <p className="text-sm text-yellow-100/70 mb-2">
            🏷️ Ref: {collection.reference_code}
          </p>
          {collection.creation_dates && collection.creation_dates.length > 0 && (
            <p className="text-sm text-yellow-300">
              📅 Data: {new Date(collection.creation_dates[0]).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggle}
          className="bg-yellow-400 hover:bg-yellow-300 text-theme px-4 py-2 rounded text-sm font-scratchy font-bold transition-colors"
          disabled={loading}
        >
          {loading ? '⏳ Carregando...' : isExpanded ? '👆 Ocultar' : '👁️ Ver detalhes'}
        </motion.button>
      </div>

      {/* Descrição breve */}
      {collection.physical_characteristics && (
        <p className="text-gray-300 text-sm mb-4 italic">
          {collection.physical_characteristics}
        </p>
      )}

      {/* Erro ao carregar detalhes */}
      {isExpanded && details && details.error && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <div className="bg-red-900 border border-red-600 rounded p-4">
            <h4 className="text-red-300 font-bold mb-2">❌ Erro ao Carregar Detalhes</h4>
            <p className="text-red-200 text-sm">{details.message}</p>
          </div>
        </div>
      )}

      {/* Detalhes expandidos */}
      {isExpanded && details && !details.error && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          {details._isStaticFallback && (
            <div className="mb-4 bg-blue-900 border border-blue-600 rounded p-3">
              <p className="text-blue-200 text-sm">
                📄 Dados estáticos • Informações reais do acervo, mas API temporariamente indisponível
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Coluna esquerda - Informações básicas */}
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">INFORMAÇÕES BÁSICAS</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Nível:</span> <span className="text-theme">{details.level_of_description}</span></p>
                  <p><span className="text-gray-400">Status:</span> <span className="text-theme">{details.publication_status}</span></p>
                  {details.extent_and_medium && (
                    <p><span className="text-gray-400">Extensão:</span> <span className="text-theme">{details.extent_and_medium}</span></p>
                  )}
                  {details.languages_of_material && (
                    <p><span className="text-gray-400">Idiomas:</span> <span className="text-theme">{details.languages_of_material.join(', ')}</span></p>
                  )}
                </div>
              </div>

              {/* Criadores */}
              {details.creators && details.creators.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">CRIADORES</h4>
                  {details.creators.map((creator, index) => (
                    <div key={index} className="text-sm mb-3">
                      <p className="text-theme font-medium">{creator.authorized_form_of_name}</p>
                      {creator.dates_of_existence && (
                        <p className="text-gray-400">Período: {creator.dates_of_existence}</p>
                      )}
                      {creator.history && (
                        <p className="text-gray-300 mt-1 text-xs">
                          {creator.history.length > 150 ? creator.history.substring(0, 150) + '...' : creator.history}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Condições de acesso */}
              {details.conditions_governing_access && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">ACESSO</h4>
                  <p className="text-sm text-green-300">{details.conditions_governing_access}</p>
                  {details.conditions_governing_reproduction && (
                    <p className="text-sm text-blue-300 mt-1">{details.conditions_governing_reproduction}</p>
                  )}
                </div>
              )}
            </div>

            {/* Coluna direita - Conteúdo e contexto */}
            <div className="space-y-4">
              {/* Âmbito e conteúdo */}
              {details.scope_and_content && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">DESCRIÇÃO DO CONTEÚDO</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {details.scope_and_content}
                  </p>
                </div>
              )}

              {/* História arquivística */}
              {details.archival_history && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">HISTÓRIA</h4>
                  <p className="text-sm text-gray-300">{details.archival_history}</p>
                </div>
              )}

              {/* Fonte de aquisição */}
              {details.immediate_source_of_acquisition_or_transfer && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">AQUISIÇÃO</h4>
                  <p className="text-sm text-gray-300">{details.immediate_source_of_acquisition_or_transfer}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tags e pontos de acesso */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Assuntos */}
              {details.subject_access_points && details.subject_access_points.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">ASSUNTOS</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.subject_access_points.map((subject, index) => (
                      <span key={index} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lugares */}
              {details.place_access_points && details.place_access_points.length > 0 && (
                <div>
                  <h4 className="font-bold text-yellow-400 mb-2">LUGARES</h4>
                  <div className="flex flex-wrap gap-2">
                    {details.place_access_points.map((place, index) => (
                      <span key={index} className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs">
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informações técnicas */}
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs text-gray-400">
              {details.description_identifier && (
                <p><span className="font-medium">ID:</span> {details.description_identifier}</p>
              )}
              {details.related_units_of_description && (
                <p><span className="font-medium">Arquivo:</span> {details.related_units_of_description}</p>
              )}
              {details.existence_and_location_of_originals && (
                <p><span className="font-medium">Original:</span> {details.existence_and_location_of_originals}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default function CollectionViewer() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCollections, setFilteredCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        
        let response;
        let isUsingFallback = false;
        
        try {
          // Try API first
          response = await getCollections({ limit: 100 });
        } catch (apiError) {
          console.warn('⚠️ API falhou, usando dados estáticos:', apiError.message);
          // Use static fallback
          response = getStaticCollections({ limit: 100 });
          isUsingFallback = true;
          setError('API temporariamente indisponível - usando dados estáticos');
        }
        
        if (response && response.results && response.results.length > 0) {
          setCollections(response.results);
          setFilteredCollections(response.results);
          
          if (isUsingFallback) {
            console.log('📊 Usando fallback estático com', response.results.length, 'itens');
          }
        } else {
          throw new Error('Nenhum dado disponível');
        }
      } catch (err) {
        console.error('❌ Erro fatal ao buscar coleções:', err);
        setError(`Erro ao carregar coleções: ${err.message}`);
        
        // Final fallback - minimal data
        const minimalFallback = [
          {
            slug: 'erro-total-fallback',
            title: 'Acervo Hip Hop DF - Dados indisponíveis',
            reference_code: 'ERRO-TOTAL',
            physical_characteristics: 'Sistema temporariamente indisponível. Nosso acervo contém documentos históricos do Hip Hop do Distrito Federal desde os anos 1980.',
            creation_dates: []
          }
        ];
        setCollections(minimalFallback);
        setFilteredCollections(minimalFallback);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCollections(collections);
    } else {
      const filtered = collections.filter(collection => 
        collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.reference_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (collection.physical_characteristics && 
         collection.physical_characteristics.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCollections(filtered);
    }
  }, [searchTerm, collections]);

  const toggleExpanded = (slug) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredCollections.map(c => c.slug)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-theme p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-6xl font-dirty-stains mb-8">COLEÇÕES DO ACERVO</h1>
            <div className="text-2xl font-sometype-mono">Carregando coleções...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-theme p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-6xl font-dirty-stains mb-8">COLEÇÕES DO ACERVO</h1>
            <div className="text-xl font-sometype-mono text-red-400">
              Erro ao carregar: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-theme p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-dirty-stains text-center mb-8">
          COLEÇÕES DO ACERVO
        </h1>
        
        <div className="mb-8 text-center">
          <p className="text-xl font-sometype-mono text-gray-300 mb-6">
            {collections.length} coleções disponíveis • Arquivo Hip Hop DF
          </p>
          
          {error && (
            <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
              <p className="text-yellow-200 text-sm">
                ⚠️ {error} • Os dados exibidos são estáticos mas representam nosso acervo real
              </p>
            </div>
          )}

          {/* Controles */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Buscar por título, código ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-96 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-theme font-sometype-mono"
            />
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="bg-green-600 hover:bg-green-700 text-theme px-4 py-2 rounded text-sm font-sometype-mono"
              >
                Expandir Tudo
              </button>
              <button
                onClick={collapseAll}
                className="bg-red-600 hover:bg-red-700 text-theme px-4 py-2 rounded text-sm font-sometype-mono"
              >
                Recolher Tudo
              </button>
            </div>
          </div>

          {searchTerm && (
            <p className="text-gray-400 text-sm mb-4">
              {filteredCollections.length} resultado{filteredCollections.length !== 1 ? 's' : ''} para "{searchTerm}"
            </p>
          )}
        </div>

        {/* Lista de coleções */}
        <div className="space-y-4">
          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection.slug}
              collection={collection}
              isExpanded={expandedItems.has(collection.slug)}
              onToggle={toggleExpanded}
            />
          ))}
        </div>

        {filteredCollections.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-xl font-sometype-mono text-gray-400">
              Nenhuma coleção encontrada para "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
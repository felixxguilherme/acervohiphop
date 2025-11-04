"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAcervo } from '@/contexts/AcervoContext';
import HeaderApp from '@/components/html/HeaderApp';
import { motion } from 'motion/react';
import { fetchCompat } from '@/utils/httpClient';
import Map, { Marker } from 'react-map-gl/maplibre';
import atomMapResponse from '@/data/mapa';
import municipiosService from '@/services/municipiosService';
import {
  Calendar,
  MapPin,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  ExternalLink,
  Hash,
  Archive,
  Info,
  Eye,
  X,
  Maximize2
} from 'lucide-react';

const ItemDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { loadItem, isLoading, getError } = useAcervo();

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  const [coordinatesLoading, setCoordinatesLoading] = useState(false);

  useEffect(() => {
    const loadItemData = async () => {
      // Evita carregar novamente se já foi carregado para este slug
      if (hasLoaded && itemData?.slug === slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const item = await loadItem(slug);
        if (!item) {
          throw new Error('Item não encontrado');
        }

        // Se não tem thumbnail_url, tentar buscar da API de lista
        if (!item.thumbnail_url) {
          try {
            const listResponse = await fetchCompat(`/api/acervo?sq0=${encodeURIComponent(item.title)}&sf0=title&limit=1`);
            if (listResponse.ok) {
              const listData = await listResponse.json();
              const foundItem = listData.results?.find(listItem => listItem.slug === slug);
              if (foundItem?.thumbnail_url) {
                item.thumbnail_url = foundItem.thumbnail_url;
              }
            }
          } catch (error) {
            console.warn('⚠️ Erro ao buscar thumbnail da API de lista:', error);
          }
        }

        setItemData(item);
        setHasLoaded(true);

      } catch (err) {
        console.error('❌ Erro ao carregar item:', err);
        setError(err.message);
        setHasLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    if (slug && (!hasLoaded || itemData?.slug !== slug)) {
      loadItemData();
    }
  }, [slug]);

  // Effect para carregar coordenadas quando itemData mudar
  useEffect(() => {
    const loadCoordinates = async () => {
      if (!itemData) return;

      setCoordinatesLoading(true);
      
      try {
        const coords = await getItemCoordinatesAsync();
        setCoordinates(coords);
      } catch (error) {
        console.warn('Erro ao carregar coordenadas:', error);
      } finally {
        setCoordinatesLoading(false);
      }
    };

    loadCoordinates();
  }, [itemData]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Função para determinar qual URL usar para detalhes (prioriza reference_url)
  const getDetailImageUrl = () => {
    if (!itemData) return null;
    
    // Prioridade: reference_url > thumbnail_url
    let url = itemData.reference_url || itemData.thumbnail_url;
    
    if (url) {
      // Aplicar correções de URL
      if (url.includes('acervodistrito') && !url.includes('base.acervodistrito')) {
        url = url.replace('https://acervodistrito', 'https://base.acervodistrito');
        url = url.replace('http://acervodistrito', 'https://base.acervodistrito');
      }
    }
    
    return url;
  };

  // Função para determinar qual URL usar para fullscreen (maior qualidade)
  const getFullscreenImageUrl = () => {
    if (!itemData) return null;
    
    // Prioridade: reference_url > digital_object_url > thumbnail_url
    let url = itemData.reference_url || itemData.digital_object_url || itemData.thumbnail_url;
    
    if (url) {
      // Aplicar correções de URL
      if (url.includes('acervodistrito') && !url.includes('base.acervodistrito')) {
        url = url.replace('https://acervodistrito', 'https://base.acervodistrito');
        url = url.replace('http://acervodistrito', 'https://base.acervodistrito');
      }
    }
    
    return url;
  };

  // Função assíncrona para extrair coordenadas das notas do item
  const getItemCoordinatesAsync = async () => {
    // Primeiro: tentar extrair coordenadas das notes
    if (itemData?.notes && Array.isArray(itemData.notes) && itemData.notes[0]) {
      try {
        const coordinatesString = itemData.notes[0];
        const coordinateRegex = /(-?\d+\.?\d*),?\s*(-?\d+\.?\d*)/;
        const match = coordinatesString.match(coordinateRegex);
        
        if (match) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          
          if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng, source: 'notes' };
          }
        }
      } catch (error) {
        console.warn('Erro ao extrair coordenadas das notas:', error);
      }
    }

    // Segundo: tentar buscar coordenadas pelos place_access_points
    if (itemData?.place_access_points && itemData.place_access_points.length > 0) {
      try {
        // Buscar no mapa local se temos coordenadas para algum dos lugares mencionados
        for (const place of itemData.place_access_points) {
          const placeNormalized = place.toLowerCase().trim();
          
          // Buscar no nosso mapa de localizações
          const foundLocation = atomMapResponse.locations.find(location => {
            const locationName = location.name.toLowerCase();
            return locationName.includes(placeNormalized) || placeNormalized.includes(locationName);
          });
          
          if (foundLocation) {
            return { 
              lat: foundLocation.coordinates.lat, 
              lng: foundLocation.coordinates.lng,
              source: 'place_access_points',
              placeName: foundLocation.name
            };
          }
        }
      } catch (error) {
        console.warn('Erro ao buscar coordenadas por place_access_points:', error);
      }
    }

    // Terceiro: tentar buscar nos municípios do IBGE
    if (itemData?.place_access_points && itemData.place_access_points.length > 0) {
      try {
        for (const place of itemData.place_access_points) {
          const municipioCoords = await municipiosService.findMunicipioCoordinates(place);
          if (municipioCoords) {
            return municipioCoords;
          }
        }
      } catch (error) {
        console.warn('Erro ao buscar coordenadas nos municípios IBGE:', error);
      }
    }
    
    return null;
  };

  // Função síncrona para compatibilidade com o JSX
  const getItemCoordinates = () => {
    return coordinates;
  };

  if (loading) {
    return (
      <div>
        <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen border-theme border-l-3 border-r-3 border-b-3">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-theme border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-sometype-mono">Carregando detalhes do item...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen border-theme border-l-3 border-r-3 border-b-3">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="bg-theme-background border-2 border-theme p-6">
                <p className="font-dirty-stains text-xl mb-2">Erro ao carregar</p>
                <p className="font-sometype-mono mb-4">{error}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-white text-theme border-2 border-theme hover:bg-black hover:text-theme transition-colors flex items-center gap-2 font-dirty-stains"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                  <button
                    onClick={() => router.push('/acervo')}
                    className="px-4 py-2 bg-white text-theme border-2 border-theme hover:bg-black hover:text-theme transition-colors font-dirty-stains"
                  >
                    Ir para Acervo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeaderApp title="ACERVO DIGITAL" showTitle={true} />

      <div className="relative mx-auto py-8 min-h-screen border-theme border-l-3 border-r-3 border-b-3">
        {/* Breadcrumb e navegação */}
        <motion.section
          className="mb-8 px-6 flex flex-col justify-center items-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => router.back()}
            className="mt-4 flex items-center gap-2 px-4 py-2 cursor-pointer border-2 border-theme hover:bg-black hover:text-theme transition-colors font-dirty-stains"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <div className="border-b-3 border-theme p-4 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-sometype-mono text-gray-600">
                <button
                  onClick={() => router.push('/acervo')}
                  className="hover:text-theme-primary transition-colors"
                >
                  Acervo
                </button>
                <span>/</span>
                <span>Item</span>
                <span>/</span>
                <span className="text-theme-primary marca-texto-verde">{slug}</span>
              </div>
            </div>
          </div>          
        </motion.section>

        {/* Hero Section com imagem principal */}
        <motion.section
          className="mb-12 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-theme-background p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Imagem principal */}
              <div className="space-y-4">
                {getDetailImageUrl() ? (
                  <div className="relative group">
                    <img
                      src={getDetailImageUrl()}
                      alt={itemData.title}
                      className="w-full h-96 object-cover cursor-pointer"
                      onClick={() => setShowFullscreenImage(true)}
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => setShowFullscreenImage(true)}
                      className="absolute inset-0 flex items-center justify-center text-theme opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="bg-theme-background p-2 w-16 h-16" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}

                {/* Links externos */}
                {(itemData.digital_object_url || itemData.slug) && (
                  <div className="flex gap-3">
                    {itemData.digital_object_url && (
                      <a
                        href={itemData.digital_object_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-theme border-2 border-theme hover:bg-black hover:text-theme transition-colors font-dirty-stains"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Original
                      </a>
                    )}
                    <a
                      href={`https://base.acervodistritohiphop.com.br/index.php/${itemData.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white text-theme border-2 border-theme hover:bg-black hover:text-theme transition-colors font-dirty-stains"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver no AtoM
                    </a>
                  </div>
                )}
              </div>

              {/* Informações principais */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-dirty-stains text-theme-primary mb-4">
                    {itemData.title}
                  </h1>

                  {itemData.reference_code && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Hash className="w-4 h-4" />
                      <span className="font-sometype-mono">{itemData.reference_code}</span>
                    </div>
                  )}

                  {itemData.level_of_description && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Archive className="w-4 h-4" />
                      <span className="font-sometype-mono">{itemData.level_of_description}</span>
                    </div>
                  )}
                </div>

                {/* Metadados principais */}
                <div className="space-y-4">
                  {itemData.creation_dates && itemData.creation_dates.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-dirty-stains text-lg">Data de Criação</h3>
                        <p className="font-sometype-mono text-gray-700">
                          {itemData.creation_dates.map(date => formatDate(date)).join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {itemData.place_access_points && itemData.place_access_points.length > 0 && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1" />
                      <div>
                        <h3 className="font-dirty-stains text-lg">Localizações</h3>
                        <div className="flex flex-wrap gap-2">
                          {itemData.place_access_points.map((place, index) => (
                            <span
                              key={index}
                              className={`mt-4 border-theme border-2 px-2 py-1 text-sm font-sometype-mono`}
                            >
                              {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {itemData.physical_characteristics && (
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-purple-500 mt-1" />
                      <div>
                        <h3 className="font-dirty-stains text-lg">Características Físicas</h3>
                        <p className="font-sometype-mono text-gray-700">
                          {itemData.physical_characteristics}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Descrições detalhadas */}
        <motion.section
          className="mb-12 px-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-dirty-stains mb-8 text-left border-theme border-b-3 pb-4">DESCRIÇÕES</h2>

            <div className="space-y-6">
              {itemData.scope_and_content && (
                <div className="bg-theme-background p-6">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains text-theme-primary mb-4">
                    <FileText className="w-5 h-5" />
                    Âmbito e Conteúdo
                  </h3>
                  <p className="text-gray-700 font-sometype-mono leading-relaxed">
                    {itemData.scope_and_content}
                  </p>
                </div>
              )}

              {itemData.archival_history && (
                <div className="bg-theme-background p-6">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains text-theme-primary mb-4">
                    <Archive className="w-5 h-5" />
                    História Arquivística
                  </h3>
                  <p className="text-gray-700 font-sometype-mono leading-relaxed">
                    {itemData.archival_history}
                  </p>
                </div>
              )}

              
            </div>
          </div>
        </motion.section>

        {/* Seção do Mapa */}
        {(getItemCoordinates() || coordinatesLoading) && (
          <motion.section
            className="mb-12 px-6"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-dirty-stains mb-8 text-left border-theme border-b-3 pb-4">NO MAPA</h2>
              
              <div className="bg-theme-background p-6">
                <div className="h-96 w-full border-2 border-theme relative overflow-hidden">
                  {coordinatesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-2 border-theme border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-sm font-sometype-mono">Localizando no mapa...</p>
                      </div>
                    </div>
                  ) : getItemCoordinates() ? (
                    <Map
                      mapStyle="https://api.maptiler.com/maps/0198f104-5621-7dfc-896c-fe02aa4f37f8/style.json?key=44Jpa8uxVZvK9mvnZI2z"
                      initialViewState={{
                        longitude: getItemCoordinates().lng,
                        latitude: getItemCoordinates().lat,
                        zoom: getItemCoordinates().source === 'notes' ? 15 : 10
                      }}
                      style={{ width: '100%', height: '100%' }}
                      attributionControl={false}
                    >
                      <Marker
                        longitude={getItemCoordinates().lng}
                        latitude={getItemCoordinates().lat}
                      >
                        <motion.div
                          className={`w-8 h-8 border-4 border-white rounded-full shadow-lg cursor-pointer flex items-center justify-center ${
                            getItemCoordinates().source === 'notes' ? 'bg-red-500' : 'bg-orange-500'
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </motion.div>
                      </Marker>
                    </Map>
                  ) : null}
                </div>
                
                {!coordinatesLoading && getItemCoordinates() && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-sometype-mono text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>
                        Coordenadas: {getItemCoordinates().lat.toFixed(6)}, {getItemCoordinates().lng.toFixed(6)}
                      </span>
                    </div>
                    <div className="text-xs font-sometype-mono text-gray-500">
                      {getItemCoordinates().source === 'notes' ? 
                        'Localização exata do item' : 
                        getItemCoordinates().source === 'place_access_points' ?
                        `Localização aproximada baseada em: ${getItemCoordinates().placeName || 'informações do local'}` :
                        `Município: ${getItemCoordinates().municipioName}, ${getItemCoordinates().uf}`
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* Metadados técnicos */}
        <motion.section
          className="mb-12 px-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="border-theme border-b-3 pb-3 text-2xl sm:text-3xl md:text-4xl font-dirty-stains text-theme-primary mb-8 text-left">METADADOS TÉCNICOS</h2>

            <div className="bg-theme-background p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-dirty-stains text-lg text-theme-primary mb-2 text-bold">Identificação</h4>
                  <div className="space-y-2 text-sm font-sometype-mono">
                    <div><strong>Slug:</strong> {itemData.slug}</div>
                    {itemData.reference_code && (
                      <div><strong>Código de Referência:</strong> {itemData.reference_code}</div>
                    )}
                    {itemData.level_of_description && (
                      <div><strong>Nível de Descrição:</strong> {itemData.level_of_description}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-dirty-stains text-lg text-theme-primary mb-2">Acesso</h4>
                  <div className="space-y-2 text-sm font-sometype-mono">
                    {itemData.digital_object_url && (
                      <div><strong>Objeto Digital:</strong> Disponível</div>
                    )}
                    <div><strong>Visualização:</strong> Pública</div>
                    <div><strong>Formato:</strong> Digital</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Ações finais */}
        <motion.section
          className="px-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="p-6 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 text-theme border-2 border-theme font-dirty-stains hover:bg-black hover:text-theme cursor-pointer hover:border-theme transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à Busca
              </button>

              <button
                onClick={() => router.push('/acervo')}
                className="px-6 py-3 border-2 border-theme text-theme font-dirty-stains hover:bg-black hover:text-theme cursor-pointer transition-colors"
              >
                Explorar Mais Itens
              </button>

              {itemData.slug && (
                <a
                  href={`https://base.acervodistritohiphop.com.br/index.php/${itemData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-theme border-2 border-theme font-dirty-stains hover:bg-black hover:text-theme transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver no Sistema Original
                </a>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Modal de imagem fullscreen */}
      {showFullscreenImage && getFullscreenImageUrl() && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-[10000] flex items-center justify-center p-4"
          onClick={() => setShowFullscreenImage(false)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setShowFullscreenImage(false)}
              className="absolute top-4 right-4 bg-theme-background text-theme p-2 hover:bg-opacity-90 transition-opacity z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getFullscreenImageUrl()}
              alt={itemData.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error('Erro ao carregar imagem fullscreen:', e.target.src);
                setShowFullscreenImage(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetailPage;
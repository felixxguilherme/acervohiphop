"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAcervo } from '@/contexts/AcervoContext';
import HeaderApp from '@/components/html/HeaderApp';
import { motion } from 'motion/react';
import { fetchCompat } from '@/utils/httpClient';
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
  Eye
} from 'lucide-react';

const ItemDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { loadItem, isLoading, getError } = useAcervo();
  
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

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

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div>
        <HeaderApp title="ACERVO DIGITAL" showTitle={true} />
        <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen border-black border-l-3 border-r-3 border-b-3">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
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
        <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen border-black border-l-3 border-r-3 border-b-3">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="bg-theme-background border-2 border-black p-6">
                <p className="font-dirty-stains text-xl mb-2">Erro ao carregar</p>
                <p className="font-sometype-mono mb-4">{error}</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 font-dirty-stains"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                  <button 
                    onClick={() => router.push('/acervo')}
                    className="px-4 py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors font-dirty-stains"
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
      
      <div className="relative max-w-7xl mx-auto px-6 py-10 min-h-screen border-black border-l-3 border-r-3 border-b-3">
        {/* Breadcrumb e navegação */}
        <motion.section 
          className="mb-8 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-theme-background border-2 border-black p-4">
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
                <span className="text-theme-primary font-dirty-stains">{slug}</span>
              </div>
              
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer border-2 border-black hover:bg-black hover:text-white transition-colors font-dirty-stains"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
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
          <div className="bg-theme-background border-2 border-black p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Imagem principal */}
              <div className="space-y-4">
                {itemData.thumbnail_url ? (
                  <div className="relative group">
                    <img 
                      src={(() => {
                        let url = itemData.thumbnail_url;
                        // Aplicar múltiplas correções possíveis
                        if (url.includes('acervodistrito') && !url.includes('base.acervodistrito')) {
                          url = url.replace('https://acervodistrito', 'https://base.acervodistrito');
                          url = url.replace('http://acervodistrito', 'https://base.acervodistrito');
                        }
                        return url;
                      })()} 
                      alt={itemData.title}
                      className="w-full h-96 object-cover border-2 border-black"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                    {itemData.digital_object_url && (
                      <a 
                        href={itemData.digital_object_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 border-2 border-black flex items-center justify-center">
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
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors font-dirty-stains"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Original
                      </a>
                    )}
                    <a 
                      href={`https://base.acervodistritohiphop.com.br/index.php/${itemData.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors font-dirty-stains"
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
                  <h1 className="text-4xl font-dirty-stains text-theme-primary mb-4">
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
                      <MapPin className="w-5 h-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-dirty-stains text-lg">Localizações</h3>
                        <div className="flex flex-wrap gap-2">
                          {itemData.place_access_points.map((place, index) => (
                            <span 
                              key={index}
                              className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-sometype-mono"
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
            <h2 className="text-4xl font-dirty-stains text-theme-primary mb-8 text-left">DESCRIÇÕES</h2>
            
            <div className="space-y-6">
              {itemData.scope_and_content && (
                <div className="bg-theme-background border-2 border-black p-6">
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
                <div className="bg-theme-background border-2 border-black p-6">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains text-theme-primary mb-4">
                    <Archive className="w-5 h-5" />
                    História Arquivística
                  </h3>
                  <p className="text-gray-700 font-sometype-mono leading-relaxed">
                    {itemData.archival_history}
                  </p>
                </div>
              )}

              {itemData.notes && itemData.notes.length > 0 && (
                <div className="bg-theme-background border-2 border-black p-6">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains text-theme-primary mb-4">
                    <Info className="w-5 h-5" />
                    Notas
                  </h3>
                  <div className="space-y-2">
                    {itemData.notes.map((note, index) => (
                      <p key={index} className="text-gray-700 font-sometype-mono leading-relaxed">
                        {note}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Metadados técnicos */}
        <motion.section 
          className="mb-12 px-6"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl font-dirty-stains text-theme-primary mb-8 text-left">METADADOS TÉCNICOS</h2>
            
            <div className="bg-theme-background border-2 border-black p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-dirty-stains text-lg text-theme-primary mb-2">Identificação</h4>
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
          <div className="border-2 border-black p-6 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => router.back()}
                className="px-6 py-3 text-black border-2 border-black font-dirty-stains hover:bg-black hover:text-white cursor-pointer hover:border-white transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à Busca
              </button>
              
              <button 
                onClick={() => router.push('/acervo')}
                className="px-6 py-3 border-2 border-black text-black font-dirty-stains hover:bg-black hover:text-white cursor-pointer transition-colors"
              >
                Explorar Mais Itens
              </button>
              
              {itemData.slug && (
                <a 
                  href={`https://base.acervodistritohiphop.com.br/index.php/${itemData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-black border-2 border-white font-dirty-stains hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver no Sistema Original
                </a>
              )}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ItemDetailPage;
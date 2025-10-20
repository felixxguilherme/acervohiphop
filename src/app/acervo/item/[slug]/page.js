"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAcervo } from '@/contexts/AcervoContext';
import HeaderApp from '@/components/html/HeaderApp';
import { motion } from 'motion/react';
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
        
        console.log('🔍 Carregando item:', slug);
        
        const item = await loadItem(slug);
        if (!item) {
          throw new Error('Item não encontrado');
        }
        
        setItemData(item);
        setHasLoaded(true);
        console.log('✅ Item carregado:', item.title);
        
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
      <div className="min-h-screen bg-white">
        <HeaderApp />
        <div className="flex items-center justify-center h-96 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="font-sometype-mono">Carregando detalhes do item...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderApp />
        <div className="flex items-center justify-center h-96 pt-20">
          <div className="text-center">
            <p className="text-red-500 font-sometype-mono mb-4">Erro: {error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
              <button 
                onClick={() => router.push('/acervo')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Ir para Acervo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderApp />
      
      <main className="pt-20">
        {/* Breadcrumb e navegação */}
        <section className="py-6 bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-sometype-mono text-gray-600">
                <button 
                  onClick={() => router.push('/acervo')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Acervo
                </button>
                <span>/</span>
                <span>Item</span>
                <span>/</span>
                <span className="text-gray-900">{slug}</span>
              </div>
              
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black hover:bg-gray-100 transition-colors font-dirty-stains"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </button>
            </div>
          </div>
        </section>

        {/* Hero Section com imagem principal */}
        <motion.section 
          className="py-12 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Imagem principal */}
              <div className="space-y-4">
                {itemData.thumbnail_url ? (
                  <div className="relative group">
                    <img 
                      src={itemData.thumbnail_url} 
                      alt={itemData.title}
                      className="w-full h-96 object-cover rounded-lg shadow-lg"
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
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
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
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-dirty-stains"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Original
                      </a>
                    )}
                    <a 
                      href={`https://base.acervodistritohiphop.com.br/index.php/${itemData.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors font-dirty-stains"
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
                  <h1 className="text-4xl font-dirty-stains mb-4">
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
          className="py-12 bg-gray-50"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-dirty-stains mb-8 text-center">Descrições</h2>
            
            <div className="space-y-8">
              {itemData.scope_and_content && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains mb-4">
                    <FileText className="w-5 h-5 text-blue-500" />
                    Âmbito e Conteúdo
                  </h3>
                  <p className="text-gray-700 font-sometype-mono leading-relaxed">
                    {itemData.scope_and_content}
                  </p>
                </div>
              )}

              {itemData.archival_history && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains mb-4">
                    <Archive className="w-5 h-5 text-green-500" />
                    História Arquivística
                  </h3>
                  <p className="text-gray-700 font-sometype-mono leading-relaxed">
                    {itemData.archival_history}
                  </p>
                </div>
              )}

              {itemData.notes && itemData.notes.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="flex items-center gap-2 text-xl font-dirty-stains mb-4">
                    <Info className="w-5 h-5 text-purple-500" />
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
          className="py-12 bg-white"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-dirty-stains mb-8 text-center">Metadados Técnicos</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-dirty-stains text-lg mb-2">Identificação</h4>
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
                  <h4 className="font-dirty-stains text-lg mb-2">Acesso</h4>
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
          className="py-8 bg-black text-white"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => router.back()}
                className="px-6 py-3 bg-white text-black font-dirty-stains hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à Busca
              </button>
              
              <button 
                onClick={() => router.push('/acervo')}
                className="px-6 py-3 border-2 border-white text-white font-dirty-stains hover:bg-white hover:text-black transition-colors"
              >
                Explorar Mais Itens
              </button>
              
              {itemData.slug && (
                <a 
                  href={`https://base.acervodistritohiphop.com.br/index.php/${itemData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white font-dirty-stains hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver no Sistema Original
                </a>
              )}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ItemDetailPage;
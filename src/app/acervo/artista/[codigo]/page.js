"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAcervo } from '@/contexts/AcervoContext';
import HeaderApp from '@/components/html/HeaderApp';
import { motion } from 'motion/react';
import { Calendar, Music, Video, MapPin, Clock, ExternalLink } from 'lucide-react';
import { fetchCompat } from '@/utils/httpClient';

const CreatorDetailPage = () => {
  const { codigo } = useParams();
  const { getCreatorItems } = useAcervo();
  
  const [creatorData, setCreatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatorItems, setCreatorItems] = useState([]);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Mapeamento de IDs para slugs conhecidos (expandir conforme necessário)
  const creatorSlugs = {
    675: 'dino-black',
    3312: 'gog', // assumindo que existe uma página para GOG
  };

  // Dados de creators conhecidos - expandir conforme necessário
  const knownCreators = {
    3312: {
      name: "GOG",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      biography: "GOG é um dos pioneiros do rap brasileiro e um dos maiores nomes do hip hop nacional. Nascido em Brasília, desenvolveu sua carreira musical desde os anos 90, tornando-se uma referência no cenário do rap consciente.",
      birthDate: "1974-09-11",
      city: "Brasília, DF"
    }
  };

  // Função para extrair informações do creator a partir dos seus itens
  const extractCreatorInfoFromItems = (items, creatorId) => {
    if (items.length === 0) return null;

    // Tentar extrair nome do creator a partir dos itens
    const firstItem = items[0];
    let creatorName = `Creator ${creatorId}`;
    
    // Procurar por informações de creator nos itens
    if (firstItem.creators && firstItem.creators.length > 0) {
      const creator = firstItem.creators.find(c => c.id == creatorId);
      if (creator && creator.name) {
        creatorName = creator.name;
      } else if (firstItem.creators[0] && firstItem.creators[0].name) {
        creatorName = firstItem.creators[0].name;
      }
    }

    // Extrair cidade mais comum dos place_access_points
    const places = items
      .flatMap(item => item.place_access_points || [])
      .filter(Boolean);
    
    const placeCount = {};
    places.forEach(place => {
      const placeName = typeof place === 'string' ? place : place.name || place;
      placeCount[placeName] = (placeCount[placeName] || 0) + 1;
    });
    
    const mostCommonPlace = Object.entries(placeCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Brasília, DF';

    return {
      name: creatorName,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      biography: `${creatorName} é um artista que contribuiu significativamente para o acervo do Hip Hop do Distrito Federal, com ${items.length} obras catalogadas. Sua produção abrange diversos formatos e períodos, refletindo a riqueza e diversidade da cultura hip hop local.`,
      city: mostCommonPlace,
      birthDate: null // Não é possível extrair da API atual
    };
  };

  // Função para buscar informações biográficas do creator via web scraping
  const fetchCreatorBiographyFromWeb = async (creatorId) => {
    const slug = creatorSlugs[creatorId];
    if (!slug) return null;

    try {
      console.log('🌐 Buscando biografia via web para:', slug);
      
      // Criar uma API route interna para fazer o scraping server-side
      // (pois CORS impede fazer direto do browser)
      const response = await fetchCompat(`/api/creator-biography/${slug}`);
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.warn('⚠️ Não foi possível buscar biografia via web');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro ao buscar biografia:', error);
      return null;
    }
  };

  // Função para carregar itens do creator usando API local (mesmo que os cards)
  const loadCreatorItemsFromAPI = async (creatorId) => {
    console.log('🔍 Buscando itens do creator', creatorId, 'via API local');
    
    let allItems = [];
    let skip = 0;
    const limit = 50; // Buscar em lotes de 50
    
    try {
      // Primeira requisição para saber o total
      const firstUrl = `/api/acervo?creators=${creatorId}&limit=${limit}&skip=${skip}`;
      console.log('📡 Primeira requisição:', firstUrl);
      
      const firstResponse = await fetchCompat(firstUrl);
      
      if (!firstResponse.ok) {
        throw new Error(`API retornou ${firstResponse.status}: ${firstResponse.statusText}`);
      }
      
      const firstData = await firstResponse.json();
      const total = firstData.total || 0;
      allItems = firstData.results || [];
      
      console.log(`📊 Primeira página: ${allItems.length}/${total} itens`);
      
      // Se há mais itens, buscar o restante
      if (total > allItems.length) {
        console.log('📄 Buscando páginas adicionais...');
        
        for (skip = limit; skip < total; skip += limit) {
          const url = `/api/acervo?creators=${creatorId}&limit=${limit}&skip=${skip}`;
          console.log(`🔍 Buscando página skip=${skip}:`, url);
          
          const response = await fetchCompat(url);
          
          if (response.ok) {
            const pageData = await response.json();
            const newItems = pageData.results || [];
            allItems = [...allItems, ...newItems];
            
            console.log(`➕ Adicionados ${newItems.length} itens (total: ${allItems.length}/${total})`);
          } else {
            console.warn(`⚠️ Erro na página skip=${skip}: ${response.status}`);
          }
        }
      }
      
      console.log(`✅ Creator ${creatorId} completo: ${allItems.length} itens carregados`);
      return allItems;
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados da API local:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadCreatorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎭 Carregando dados do creator:', codigo);
        
        // Buscar itens do creator usando API externa diretamente
        const items = await loadCreatorItemsFromAPI(codigo);
        console.log('📦 Itens encontrados:', items.length);
        setCreatorItems(items);
        
        // Buscar informações do creator
        let creatorInfo = knownCreators[codigo];
        
        if (!creatorInfo) {
          // Se não temos dados específicos, extrair dos itens
          creatorInfo = extractCreatorInfoFromItems(items, codigo);
        }
        
        if (!creatorInfo) {
          throw new Error(`Nenhum item encontrado para o creator ${codigo}`);
        }
        
        // Tentar buscar biografia real via web scraping
        try {
          const webBiography = await fetchCreatorBiographyFromWeb(codigo);
          if (webBiography) {
            console.log('📖 Biografia encontrada via web:', webBiography.name);
            
            // Mesclar dados da web com dados existentes
            creatorInfo = {
              ...creatorInfo,
              name: webBiography.name || creatorInfo.name,
              biography: webBiography.biography || creatorInfo.biography,
              birthDate: webBiography.birthDate || creatorInfo.birthDate,
              city: webBiography.city || creatorInfo.city,
              sourceUrl: webBiography.sourceUrl
            };
          }
        } catch (webError) {
          console.warn('⚠️ Não foi possível buscar biografia via web:', webError.message);
          // Continuar com os dados que temos
        }
        
        setCreatorData(creatorInfo);
        console.log('✅ Dados do creator carregados:', creatorInfo.name);
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados do creator:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (codigo) {
      loadCreatorData();
    }
  }, [codigo]);

  // Separar itens por tipo
  const discografia = creatorItems.filter(item => 
    item.genre?.toLowerCase().includes('music') || 
    item.title?.toLowerCase().includes('cd') ||
    item.title?.toLowerCase().includes('album') ||
    item.title?.toLowerCase().includes('disco')
  );

  const videografia = creatorItems.filter(item => 
    item.genre?.toLowerCase().includes('video') || 
    item.title?.toLowerCase().includes('dvd') ||
    item.title?.toLowerCase().includes('video')
  );

  const colaboracoesMapa = creatorItems.filter(item => 
    item.place_access_points && item.place_access_points.length > 0
  );

  // Ordenar por data para timeline
  const timeline = creatorItems
    .filter(item => item.creation_dates && item.creation_dates.length > 0)
    .sort((a, b) => new Date(a.creation_dates[0]) - new Date(b.creation_dates[0]));

  // Paginação para todos os itens
  const totalPages = Math.ceil(creatorItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = creatorItems.slice(startIndex, startIndex + itemsPerPage);

  // Função para navegar entre páginas
  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll para a seção de itens
    const itemsSection = document.getElementById('all-items-section');
    if (itemsSection) {
      itemsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="font-sometype-mono">Carregando dados do artista...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <HeaderApp />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-500 font-sometype-mono mb-4">Erro: {error}</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderApp />
      
      <main className="pt-20">
        {/* Hero Section com Imagem e Nome */}
        <motion.section 
          className="relative h-[70vh] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 h-full relative">
            <div className="relative h-full w-[90%] mx-auto">
              <img 
                src={creatorData.image} 
                alt={creatorData.name}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-70 text-white p-6 rounded-lg">
                <h1 className="text-4xl md:text-6xl font-dirty-stains mb-2">
                  {creatorData.name}
                </h1>
                <p className="text-lg font-sometype-mono opacity-90">
                  {creatorData.city}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Biografia */}
        <motion.section 
          className="py-16 bg-gray-50"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-dirty-stains mb-8 text-center">Biografia</h2>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-lg leading-relaxed font-sometype-mono text-gray-700">
                {creatorData.biography}
              </p>
              {creatorData.birthDate && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span className="font-sometype-mono">
                      Nascimento: {formatDate(creatorData.birthDate)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Todos os Itens do Acervo */}
        <motion.section 
          id="all-items-section"
          className="py-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 justify-center mb-8">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-dirty-stains text-lg">📚</span>
              </div>
              <h2 className="text-3xl font-dirty-stains">Todos os Itens do Acervo</h2>
            </div>
            
            {/* Contador e paginação */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <p className="text-lg font-sometype-mono mb-4 md:mb-0">
                {creatorItems.length} {creatorItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
              </p>
              
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-sometype-mono">Página {currentPage} de {totalPages}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains text-sm transition-colors"
                    >
                      ←
                    </button>
                    
                    {/* Números das páginas */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-1 border-2 border-black font-dirty-stains text-sm transition-colors ${
                            pageNum === currentPage 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-white hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains text-sm transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Grid de itens atuais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentItems.map((item, index) => (
                <motion.div 
                  key={item.slug || index}
                  className="bg-white border-2 border-black p-4 hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {item.thumbnail_url && (
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="w-full h-40 object-cover mb-3 rounded"
                    />
                  )}
                  <h3 className="font-dirty-stains text-lg mb-2 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{item.title}</h3>
                  {item.creation_dates && (
                    <p className="text-gray-600 font-sometype-mono text-sm mb-2">
                      📅 {formatDate(item.creation_dates[0])}
                    </p>
                  )}
                  {item.place_access_points && item.place_access_points.length > 0 && (
                    <p className="text-gray-600 font-sometype-mono text-sm mb-2">
                      📍 {item.place_access_points[0]}
                    </p>
                  )}
                  {item.physical_characteristics && (
                    <p className="text-gray-700 font-sometype-mono text-xs overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {item.physical_characteristics}
                    </p>
                  )}
                  {item.reference_code && (
                    <p className="text-gray-500 font-sometype-mono text-xs mt-2">
                      Ref: {item.reference_code}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Paginação inferior (para facilitar navegação) */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains transition-colors"
                  >
                    ← Anterior
                  </button>
                  
                  <span className="px-4 py-2 font-sometype-mono">
                    Página {currentPage} de {totalPages}
                  </span>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black font-dirty-stains transition-colors"
                  >
                    Próxima →
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Discografia */}
        {discografia.length > 0 && (
          <motion.section 
            className="py-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 justify-center mb-8">
                <Music className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-dirty-stains">Discografia</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {discografia.map((item, index) => (
                  <motion.div 
                    key={item.slug || index}
                    className="bg-white border-2 border-black p-6 hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.02 }}
                  >
                    {item.thumbnail_url && (
                      <img 
                        src={item.thumbnail_url} 
                        alt={item.title}
                        className="w-full h-48 object-cover mb-4 rounded"
                      />
                    )}
                    <h3 className="font-dirty-stains text-xl mb-2">{item.title}</h3>
                    {item.creation_dates && (
                      <p className="text-gray-600 font-sometype-mono text-sm mb-2">
                        {formatDate(item.creation_dates[0])}
                      </p>
                    )}
                    {item.physical_characteristics && (
                      <p className="text-gray-700 font-sometype-mono text-sm">
                        {item.physical_characteristics}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Videografia */}
        {videografia.length > 0 && (
          <motion.section 
            className="py-16 bg-gray-50"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 justify-center mb-8">
                <Video className="w-8 h-8 text-red-500" />
                <h2 className="text-3xl font-dirty-stains">Videografia</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {videografia.map((item, index) => (
                  <motion.div 
                    key={item.slug || index}
                    className="bg-white border-2 border-black p-6 hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.02 }}
                  >
                    {item.thumbnail_url && (
                      <img 
                        src={item.thumbnail_url} 
                        alt={item.title}
                        className="w-full h-48 object-cover mb-4 rounded"
                      />
                    )}
                    <h3 className="font-dirty-stains text-xl mb-2">{item.title}</h3>
                    {item.creation_dates && (
                      <p className="text-gray-600 font-sometype-mono text-sm mb-2">
                        {formatDate(item.creation_dates[0])}
                      </p>
                    )}
                    {item.physical_characteristics && (
                      <p className="text-gray-700 font-sometype-mono text-sm">
                        {item.physical_characteristics}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Colaborações para o Mapa */}
        {colaboracoesMapa.length > 0 && (
          <motion.section 
            className="py-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 justify-center mb-8">
                <MapPin className="w-8 h-8 text-green-500" />
                <h2 className="text-3xl font-dirty-stains">Colaborações para o Mapa</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {colaboracoesMapa.map((item, index) => (
                  <motion.div 
                    key={item.slug || index}
                    className="bg-white border-2 border-black p-6 hover:shadow-lg transition-shadow"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-dirty-stains text-xl mb-2">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.place_access_points.map((place, placeIndex) => (
                        <span 
                          key={placeIndex}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-sometype-mono"
                        >
                          📍 {place}
                        </span>
                      ))}
                    </div>
                    {item.creation_dates && (
                      <p className="text-gray-600 font-sometype-mono text-sm">
                        {formatDate(item.creation_dates[0])}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Timeline das Obras */}
        {timeline.length > 0 && (
          <motion.section 
            className="py-16 bg-gray-50"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 justify-center mb-8">
                <Clock className="w-8 h-8 text-purple-500" />
                <h2 className="text-3xl font-dirty-stains">Linha do Tempo</h2>
              </div>
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  {/* Linha vertical */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-purple-300"></div>
                  
                  {timeline.map((item, index) => (
                    <motion.div 
                      key={item.slug || index}
                      className="relative flex items-center mb-8"
                      initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {/* Ponto na timeline */}
                      <div className="absolute left-3 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full border-2 border-white shadow-lg z-10"></div>
                      
                      {/* Conteúdo */}
                      <div className={`w-full md:w-5/12 ${
                        index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:pr-8'
                      } ml-10 md:ml-0`}>
                        <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm font-sometype-mono">
                              {formatDate(item.creation_dates[0])}
                            </span>
                          </div>
                          <h3 className="font-dirty-stains text-lg mb-2">{item.title}</h3>
                          {item.physical_characteristics && (
                            <p className="text-gray-700 font-sometype-mono text-sm">
                              {item.physical_characteristics}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Estatísticas Finais */}
        <motion.section 
          className="py-16 bg-black text-white"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-dirty-stains mb-8">Contribuição Total</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-dirty-stains text-blue-400 mb-2">
                  {creatorItems.length}
                </div>
                <div className="font-sometype-mono">Itens Total</div>
              </div>
              <div>
                <div className="text-4xl font-dirty-stains text-red-400 mb-2">
                  {discografia.length}
                </div>
                <div className="font-sometype-mono">Álbuns/CDs</div>
              </div>
              <div>
                <div className="text-4xl font-dirty-stains text-green-400 mb-2">
                  {videografia.length}
                </div>
                <div className="font-sometype-mono">Vídeos</div>
              </div>
              <div>
                <div className="text-4xl font-dirty-stains text-purple-400 mb-2">
                  {colaboracoesMapa.length}
                </div>
                <div className="font-sometype-mono">Localizações</div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default CreatorDetailPage;
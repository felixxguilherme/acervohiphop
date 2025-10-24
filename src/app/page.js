'use client';
import './parallaxstyle.css';
import CardParallax from '../components/CardParallax.jsx';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { useAcervo } from '@/contexts/AcervoContext';

import HeaderApp from '@/components/html/HeaderApp';
import PolaroidCard from '@/components/PolaroidPhoto';
import { CartoonButton } from '@/components/ui/cartoon-button';
import HipHopScrollySection from '@/components/HipHopScrollySection';
import AcervoCompleto from '@/components/home/AcervoCompleto';
import ApiResults from '@/components/home/ApiResults';
import atomService from '@/services/atomService';
import atomCollectionsResponse from '@/data/collections';

import { motion, AnimatePresence } from 'motion/react';


export default function Home() {
  // Hooks do contexto
  const { loadStatistics, statistics, loadAllItems, allItems } = useAcervo();

  const [currentTheme, setCurrentTheme] = useState('light');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    
    // Delay para evitar conflitos com animações da página
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);
  
  // Estado para projetos dinâmicos
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "O arquivo é trincheira. Aqui lutamos para imortalizar uma cultura que sobreviveu a tiros, silêncios e invisibilidade.",
      src: "/fundo_base.webp",
      link: "/acervo",
      color: "#FFF",
    },
    {
      title: "ACERVO DIGITAL",
      description: "Documentos únicos que contam a trajetória do Hip Hop no DF.",
      src: "/fundo_base_preto.webp",
      link: "/acervo",
      color: "#FFF",
    },
    {
      title: "MAPA DAS BATALHAS",
      description: "Território cultural mapeado com precisão geográfica.",
      src: "/fundo_base.webp",
      link: "/mapa",
      color: "#FFF",
    },
    {
      title: "REVISTA DIGITAL",
      description: "Curadoria colaborativa conectando ruas, estudos e produção artística.",
      src: "/fundo_base_preto.webp",
      link: "/revista",
      color: "#FFF",
    }
  ]);
  
  const container = useRef(null);
  const [lenis, setLenis] = useState(null);
  const [showSpacer, setShowSpacer] = useState(true); // Estado para controlar o spacer


  // Inicializar Lenis
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenis(lenisInstance);

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisInstance.destroy();
    };
  }, []);
  // Scroll progress para Framer Motion - integrado com Lenis
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Monitorar progresso do scroll para remover o spacer
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Remove o spacer quando o scroll atingir 80% do total
    // Isso permite que o efeito parallax termine adequadamente
    if (latest > 0.8 && showSpacer) {
      setShowSpacer(false);
    }
  });

  // Sincronizar Lenis scroll com Framer Motion
  useEffect(() => {
    if (lenis) {
      lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // Lenis gerencia o scroll, Framer Motion lê os valores
      });
    }
  }, [lenis]);

  // Carregar dados iniciais
  useEffect(() => {
    loadStatistics();
    loadAllItems(24); // Carrega primeiros 24 itens para destaques
    loadFeaturedArtists(); // Carregar artistas em destaque
    loadFeaturedContent(); // Carregar conteúdo para parallax cards
  }, [loadStatistics, loadAllItems]);

  // Estados para artistas em destaque (mesmos do acervo)
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loadingFeaturedArtists, setLoadingFeaturedArtists] = useState(true);

  // Função para carregar conteúdo apresentativo para os cards parallax
  const loadFeaturedContent = async () => {
    try {
      // Buscar itens específicos pelos slugs definidos para cada card
      const specificSlugs = [
        'lancamento-do-grupo-viela-17',
        'vera-ver-onika-e-parceiros-do-jardim-ing-a-na-candangol-andia-foto-de-dino-black',
        'dino-black-vera-ver-onika-e-parceiros-do-hip-hop-df-na-candangol-andia',
        'revista-bizz-primeiro-encontro-de-rap-nacional-no-gin-asio-do-palmeiras'
      ];
      
      const specificItems = [];
      
      // Buscar cada item específico via nossa API interna
      for (const slug of specificSlugs) {
        try {
          const response = await fetch(`/api/acervo/${slug}`);
          
          if (response.ok) {
            const item = await response.json();
            if (item && item.digital_object?.thumbnail_url) {
              specificItems.push({
                slug: slug,
                title: item.title || '',
                thumbnail_url: item.digital_object.thumbnail_url.replace('https://acervodistrito', 'https://base.acervodistrito'),
                creation_dates: item.dates?.map(d => d.date) || [],
                place_access_points: item.place_access_points || [],
                description: item.scope_and_content || '',
                reference_code: item.reference_code || ''
              });
            }
          }
        } catch (error) {
          // Item não encontrado, continuar
        }
      }
      

      // Atualizar os cards com dados reais da API para cada slug específico
      const vielaItem = specificItems.find(item => item.slug === 'lancamento-do-grupo-viela-17');
      const veraItem = specificItems.find(item => item.slug === 'vera-ver-onika-e-parceiros-do-jardim-ing-a-na-candangol-andia-foto-de-dino-black');
      const dinoBlackItem = specificItems.find(item => item.slug === 'dino-black-vera-ver-onika-e-parceiros-do-hip-hop-df-na-candangol-andia');
      const revistaBizzItem = specificItems.find(item => item.slug === 'revista-bizz-primeiro-encontro-de-rap-nacional-no-gin-asio-do-palmeiras');
      
      console.log('Cards data:', { vielaItem, veraItem, dinoBlackItem, revistaBizzItem });
      
      const newProjects = [
        {
          title: "",
          description: vielaItem?.archival_history || "O arquivo é trincheira. Memória viva do Hip Hop do DF.",
          src: vielaItem?.thumbnail_url || "/fundo_base.webp",
          link: "/acervo",
          color: "",
          itemTitle: vielaItem?.title || "",
          itemDate: vielaItem?.creation_dates?.[0] || "",
          place_access_points: vielaItem?.place_access_points || [],
          reference_code: vielaItem?.reference_code || ""
        },
        {
          title: "",
          description: veraItem?.archival_history || "Documentos únicos preservados digitalmente.",
          src: veraItem?.thumbnail_url || "/fundo_base.webp",
          link: "/acervo",
          color: "",
          itemTitle: veraItem?.title || "",
          itemDate: veraItem?.creation_dates?.[0] || "",
          place_access_points: veraItem?.place_access_points || [],
          reference_code: veraItem?.reference_code || ""
        },
        {
          title: "",
          description: dinoBlackItem?.archival_history || "Geografia cultural do Hip Hop no DF",
          src: dinoBlackItem?.thumbnail_url || "/fundo_base.webp",
          link: "/mapa",
          color: "",
          itemTitle: dinoBlackItem?.title || "",
          itemDate: dinoBlackItem?.creation_dates?.[0] || "",
          place_access_points: dinoBlackItem?.place_access_points || [],
          reference_code: dinoBlackItem?.reference_code || ""
        },
        {
          title: "",
          description: revistaBizzItem?.archival_history || "Conteúdo editorial sobre a cultura Hip Hop",
          src: revistaBizzItem?.thumbnail_url || "/fundo_base_preto.webp",
          link: "/revista",
          color: "",
          itemTitle: revistaBizzItem?.title || "",
          itemDate: revistaBizzItem?.creation_dates?.[0] || "",
          place_access_points: revistaBizzItem?.place_access_points || [],
          reference_code: revistaBizzItem?.reference_code || ""
        }
      ];
      
      setProjects(newProjects);
    } catch (error) {
      // Erro ao carregar conteúdo destacado
    }
  };

  // Função para carregar dados dos artistas em destaque
  const loadFeaturedArtists = async () => {
    setLoadingFeaturedArtists(true);
    const artists = [
      { id: '675', name: 'Dino Black', description: 'Rapper, compositor e ativista cultural' },
      { id: '1069', name: 'Vera Veronika', description: 'Artista visual e fotógrafa' }
    ];

    try {
      const artistsWithData = await Promise.all(
        artists.map(async (artist) => {
          try {
            const response = await fetch(`/api/acervo?creators=${artist.id}&limit=10`);
            const data = await response.json();
            
            return {
              ...artist,
              totalItems: data.total || 0,
              recentItems: (data.results || []).slice(0, 3),
              thumbnail: data.results?.[0]?.thumbnail_url?.replace('https://acervodistrito', 'https://base.acervodistrito') || null
            };
          } catch (error) {
            return {
              ...artist,
              totalItems: 0,
              recentItems: [],
              thumbnail: null
            };
          }
        })
      );

      setFeaturedArtists(artistsWithData);
    } catch (error) {
      // Erro ao carregar artistas em destaque
    } finally {
      setLoadingFeaturedArtists(false);
    }
  };


  return (
    <main ref={container} className="main">
      <HeaderApp title="DISTRITO HIPHOP" showTitle={true} />
      {/* CARDS PARALLAX */}
      
      <section className="relative">
        {/* Spray effects */}          
          
        {projects.map((project, i) => {
        const targetScale = 1 - ((projects.length - i) * 0.05);
        return <CardParallax key={project.slug || `p_${i}`} i={i} {...project} progress={scrollYProgress} range={[i * .25, 1]} targetScale={targetScale} />
      })}
      </section>


      {/* Spacer to push content below the sticky cards */}
      {/* <div style={{ height: '80vh' }}></div> */}




      {/* Spacer final */}
      {/* <div style={{ height: '50vh' }}></div> */}

      {/* <HipHopScrollySection />

      <AcervoCompleto />

      <ApiResults /> */}

      {/* <section id="posscrolly" style={{ position: 'relative', zIndex: 1, backgroundColor: 'white', padding: '4rem 2rem' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-dirty-stains text-center mb-8 text-theme-primary">EXPLORE MAIS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4 marca-texto-verde text-theme px-3 py-1">ACERVO</h3>
              <p className="text-lg mb-4">Navegue por nossa <span className="marca-texto-verde px-2 py-1">coleção de documentos históricos</span></p>
              <CartoonButton
                label="EXPLORAR"
                color="marca-texto-verde"
                onClick={() => window.location.href = '/acervo'}
              />
            </div>
            
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4 marca-texto-amarelo text-theme px-3 py-1">MAPA</h3>
              <p className="text-lg mb-4">Descubra os <span className="marca-texto-amarelo px-2 py-1">locais históricos</span> do Hip Hop no DF</p>
              <CartoonButton
                label="NAVEGAR"
                color="marca-texto-amarelo"
                onClick={() => window.location.href = '/mapa'}
              />
            </div>
            
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4 marca-texto-laranja text-theme px-3 py-1">REVISTA</h3>
              <p className="text-lg mb-4">Leia <span className="marca-texto-laranja px-2 py-1">reportagens e entrevistas</span> exclusivas</p>
              <CartoonButton
                label="LER MAIS"
                color="marca-texto-laranja"
                onClick={() => window.location.href = '/revista'}
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Seção de Coleções da API */}
      {/* <section className="py-16 bg-theme-secondary" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-dirty-stains text-center mb-8 text-theme-primary">
            COLEÇÕES DE ARTISTAS (API)
          </h2>
          
          {loadingCollections ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-theme border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg font-sometype-mono">Carregando coleções...</p>
            </div>
          ) : collectionsError ? (
            <div className="text-center py-12">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
                <p className="font-bold">Erro ao carregar coleções:</p>
                <p>{collectionsError}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <p className="text-lg font-sometype-mono text-theme-secondary">
                  Total de coleções encontradas: {collections.length}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection, index) => (
                  <div key={collection.slug || index} className="bg-theme-card border-2 border-theme p-6 rounded-lg">
                    <h3 className="text-xl font-dirty-stains mb-3 text-theme-primary">
                      {collection.title || 'Sem título'}
                    </h3>
                    
                    {collection.level_of_description && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Nível:</strong> {collection.level_of_description}
                      </p>
                    )}
                    
                    {collection.physical_characteristics && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Características:</strong> {collection.physical_characteristics}
                      </p>
                    )}
                    
                    {collection.reference_code && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Código:</strong> {collection.reference_code}
                      </p>
                    )}
                    
                    {collection.creation_dates && collection.creation_dates.length > 0 && (
                      <p className="text-sm font-sometype-mono mb-2 text-theme-secondary">
                        <strong>Data:</strong> {collection.creation_dates[0]}
                      </p>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-theme-secondary">
                      <p className="text-xs font-sometype-mono text-theme-secondary">
                        ID: {collection.slug || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              
              <details className="mt-8 bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer font-bold mb-2">Debug: Raw API Response</summary>
                <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded">
                  {JSON.stringify(collections.slice(0, 2), null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </section> */}

      {/* <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#f0f0f0', padding: '4rem 2rem' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-6xl font-dirty-stains text-center mb-8">CRONOLOGIA</h2>
          
          <div className="space-y-8">
            {[
              { year: "1988", event: "Primeiras rodas de break na Rodoviária" },
              { year: "1990", event: "Surgimento dos primeiros grupos de rap" },
              { year: "1994", event: "Primeiro Encontro de Hip Hop do DF" },
              { year: "1999", event: "Festival Brasileiro de Hip Hop no Mané Garrincha" },
              { year: "2000", event: "Consolidação da cena do grafite" },
              { year: "2005", event: "Duelo Nacional de MCs na Rodoviária" },
              { year: "2010", event: "Nova geração de artistas emerge" },
              { year: "2020", event: "Hip Hop DF se torna patrimônio cultural" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-md">
                <div className="bg-theme-primary text-theme px-4 py-2 rounded-full font-sometype-mono text-xl font-bold">
                  {item.year}
                </div>
                <div className="text-xl font-sometype-mono">
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* SEÇÃO DESTAQUES DO ACERVO */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`${currentTheme === 'light' ? 'fundo-base' : 'fundo-escuro'} relative overflow-hidden pb-20 border-theme border-r-3 border-l-3 border-t-3`}>

        <div className={`relative z-20 w-full`}>
          {/* Título da seção */}
          <div
            className={`bg-hip-vermelho-claro text-left mb-16 text-theme border-theme w-full pb-10 pt-10 px-6`}
          >
            <h2 className="text-8xl pl-6 md:text-5xl mb-6 text-bold">
              DESTAQUES
            </h2>
            <p className="border-theme border-b-3 pb-2 ml-6 text-xl md:text-2xl font-sometype-mono text-theme max-w-4xl leading-relaxed">
              Mergulhe na <span className="marca-texto-verde px-2 py-1">história viva</span> do Hip Hop do DF através de <span className="marca-texto-verde px-2 py-1">documentos únicos</span> que contam nossa trajetória
            </p>

          </div>

          {/* Grid de artistas em destaque - DADOS REAIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 px-4 sm:px-6 md:px-8">
            {!loadingFeaturedArtists && featuredArtists.length > 0 ? featuredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                viewport={{ once: true }}
                className={`group cursor-pointer bg-theme-background border-2 border-theme p-6 hover:bg-zinc-100 transition-all duration-300 hover:shadow-lg`}
                onClick={() => window.location.href = `/acervo/artista/${artist.id}`}
              >
                <div className="flex flex-col gap-6">
                  {/* Imagem do artista */}
                  <div className="w-full h-48 flex-shrink-0">
                    {artist.thumbnail ? (
                      <img
                        src={artist.thumbnail}
                        alt={artist.name}
                        className="w-full h-full object-cover border-b-2 border-theme"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 border-2 border-theme flex items-center justify-center">
                        <span className="text-6xl">🎭</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do artista */}
                  <div className="flex flex-col">
                    <h3 className="font-dirty-stains text-3xl mb-3" style={{ fontFamily: 'var(--font-dirty-stains)' }}>
                      {artist.name}
                    </h3>
                    <p className="font-sometype-mono text-gray-700 mb-4 text-lg">
                      {artist.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-theme text-theme px-3 py-1 border border-theme font-sometype-mono text-sm">
                        {artist.totalItems} {artist.totalItems === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                    
                    {/* Preview dos itens recentes */}
                    {artist.recentItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-theme">
                        <h4 className="font-dirty-stains text-lg mb-3">Itens Recentes:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {artist.recentItems.map((item, itemIndex) => (
                            <div
                              key={item.slug || itemIndex}
                              className="bg-white p-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                              {item.thumbnail_url && (
                                <img
                                  src={item.thumbnail_url.replace('https://acervodistrito', 'https://base.acervodistrito')}
                                  alt={item.title || 'Item'}
                                  className="w-full h-16 object-cover border border-gray-200 mb-1"
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              )}
                              <p className="text-xs font-sometype-mono truncate">
                                {item.title || 'Sem título'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )) : (
              // Loading state
              [0, 1].map((index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  viewport={{ once: true }}
                  className="bg-theme-background border-2 border-theme p-6"
                >
                  <div className="w-full h-48 bg-gray-200 animate-pulse mb-6"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                </motion.div>
              ))
            )}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <CartoonButton
              label="EXPLORAR TODO O ACERVO"
              color=""
              onClick={() => window.location.href = '/acervo'}
              className="text-xl px-8 py-4 bg-theme-primary text-theme"
            />            <p className="font-sometype-mono text-sm text-theme-secondary mt-4">
              {statistics?.totalItems ? `Mais de ${statistics.totalItems} itens` : 'Centenas de itens'} documentando 4 décadas de cultura Hip Hop
            </p>          </motion.div>
        </div>
      </motion.section>

      {/* SEÇÃO TIMELINE HISTÓRICA SIMPLES */}
      {/* <section className="relative py-20 overflow-hidden border-theme border-t-3 border-l-3 border-r-3">
       
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute -top-10 left-8 w-48 h-48 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/spray_preto-1.webp')"
            }}
          />
          <div
            className="absolute bottom-32 right-16 w-20 h-20 bg-contain bg-no-repeat rotate-45"
            style={{
              backgroundImage: "url('/cursor01.webp')"
            }}
          />
        </div>

        <div className="mx-auto relative z-20">
         
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left mb-16 border-theme border-b-3 w-full px-6"
          >
            <h2 className="marca-texto-amarelo text-4xl md:text-5xl font-dirty-stains text-theme mb-6 px-6">
              4 DÉCADAS DE HISTÓRIA
            </h2>
            
          </motion.div>

          
          <div className="relative">
            
            <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 w-1 bg-black h-full top-0"></div>
            
           
            <div className="space-y-24">
              
            
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:pr-8 text-left md:text-right">
                  <div
                    style={{backgroundImage: "url('/folha-pauta-1.webp')", backgroundSize: 'cover'}}
                    className="p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-theme text-xl md:text-2xl mb-2">1980</div>
                    <h3 className="font-dirty-stains text-2xl md:text-3xl text-theme mb-3">PRIMEIROS PASSOS</h3>
                    <p className="font-sometype-mono text-xs md:text-sm text-theme font-bold leading-relaxed">
                      Os primeiros elementos da cultura Hip Hop chegam ao DF. Jovens descobrem essa nova forma de expressão através de discos importados e programas de TV.
                    </p>
                  </div>
                </div>
                <div className="absolute left-8 md:relative md:left-auto z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-4 border-[#FFFCF2] rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-8"></div>
              </motion.div>

              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="hidden md:block md:w-1/2 md:pr-8"></div>
                <div className="absolute left-8 md:relative md:left-auto z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-4 border-theme rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="w-full md:w-1/2 pl-16 md:pl-8">
                  <div style={{backgroundImage: "url('/folha-pauta-1.webp')", backgroundSize: 'cover'}} className="p-6 md:p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-theme text-xl md:text-2xl mb-2">1995</div>
                    <h3 className="font-dirty-stains text-2xl md:text-3xl text-theme mb-3">PRIMEIRO ENCONTRO</h3>
                    <p className="font-sometype-mono text-xs md:text-sm text-theme font-bold leading-relaxed">
                      Realização do 1º Encontro de Hip Hop de Ceilândia. Marco oficial que reuniu os 4 elementos e estabeleceu a cena organizada no DF.
                    </p>
                  </div>
                </div>
              </motion.div>

              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:pr-8 text-left md:text-right">
                  <div style={{backgroundImage: "url('/folha-pauta-1.webp')", backgroundSize: 'cover'}} className="p-6 md:p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-theme text-xl md:text-2xl mb-2">2001</div>
                    <h3 className="font-dirty-stains text-2xl md:text-3xl text-theme mb-3">ERA DIGITAL</h3>
                    <p className="font-sometype-mono text-xs md:text-sm text-theme font-bold leading-relaxed">
                      Início da documentação sistemática com tecnologia digital. Battles e eventos começam a ser registrados, criando memória histórica.
                    </p>
                  </div>
                </div>
                <div className="absolute left-8 md:relative md:left-auto z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-4 border-theme rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="hidden md:block md:w-1/2 md:pl-8"></div>
              </motion.div>

              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="hidden md:block md:w-1/2 md:pr-8"></div>
                <div className="absolute left-8 md:relative md:left-auto z-10">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-black border-4 border-theme rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="w-full md:w-1/2 pl-16 md:pl-8">
                  <div style={{backgroundImage: "url('/folha-pauta-1.webp')", backgroundSize: 'cover'}} className="p-6 md:p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-theme text-xl md:text-2xl mb-2">2020</div>
                    <h3 className="font-dirty-stains text-2xl md:text-3xl text-theme mb-3">PATRIMÔNIO CULTURAL</h3>
                    <p className="font-sometype-mono text-xs md:text-sm text-theme font-bold leading-relaxed">
                      Hip Hop DF é reconhecido como patrimônio cultural. Nova geração mantém tradições enquanto inova com tecnologias digitais.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section> */}

      <section className={`${currentTheme === 'light' ? 'fundo-base' : 'fundo-base-preto'} relative min-h-screen flex flex-col justify-center items-center overflow-hidden border-r-3 border-l-3 border-t-3 border-b-3 border-theme p-8`}>


        {/* Decorative elements */}
        <div className="absolute inset-0 z-10 pointer-events-none decorative-elements">

          {/* Spray effects */}
          <div
            className="absolute -bottom-10 left-15 w-64 h-64 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/cursor02.webp')"
            }}
          />

          <div
            className="absolute top-0 -right-15 w-32 h-32 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/spray_preto-1.webp')"
            }}
          />

          <div
            className="absolute top-5 left-16 w-28 h-28 bg-contain bg-no-repeat rotate-45"
            style={{
              backgroundImage: "url('/spray_preto-2.webp')"
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative z-20 text-center max-w-6xl mx-auto px-6">
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-15 text-2xl md:text-2xl font-sometype-mono text-theme-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            O arquivo é muito mais que um depósito de papel ou um monólito de verdade única; é trincheira. É onde agora lutamos para imortalizar uma cultura que sobreviveu a tiros, silêncios, exclusão e invisibilidade. O arquivo bruto, direto e factual. Sem filtros, sem medo. Porque a verdade não precisa de retoques; ela precisa chegar e ser ouvida. O acervo pretende refletir essa vitalidade, capturando a evolução das expressões artísticas e das narrativas desse movimento. Essa potente fonte que é o Hip Hop, se abastece com nossos percursos, fazendo com que o fluxo nunca seque.
Não tem como falar de memória sem falar de quem a construiu, corporificam nossa pesquisa grandes pilares desta cultura no Distrito Federal que apoiam o Projeto. Memória não é passado morto; são vidas que ecoam no presente e avançam para quem vem depois. É o legado vivo que inspira e transforma. Arquivos não mais encarnados, mas a arte não morre; ela nos consome, sobrevive e se expande. A memória cultural não é um registro estático do passado, mas uma entidade dinâmica que ressoa no presente e influencia o futuro. Cada história compartilhada, cada som, fotografia, baile e parede são o Hip Hop. Porque, no fim, o que a gente faz é simples: a gente compra a briga.
Se você está na mesma luta, o Acervo te espera. 
          </motion.p>


          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="space-y-6"
          >
            <CartoonButton
              label="EXPLORAR ACERVO COMPLETO"
              color=""
              onClick={() => window.location.href = '/acervo'}
              className="text-xl px-8 py-4 mx-auto cursor-pointer"
            />
            {/* <div className="flex flex-wrap justify-center gap-4 text-sm font-sometype-mono text-theme-secondary">
              <span>📸 {artistsData.reduce((total, result) => total + result.total, 0)} itens no acervo</span>
              <span>🎭 {artistsData.length} artistas em destaque</span>
              <span>📅 4 décadas de história</span>
            </div> */}
          </motion.div>
        </div>
      </section>

    </main>
  )
}
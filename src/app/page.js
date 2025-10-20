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


const projects = [
  {
    title: "",
    description: "O arquivo é trincheira. Aqui lutamos para imortalizar uma cultura que sobreviveu a tiros, silêncios e invisibilidade. Sem filtros, sem medo. Memória não é passado morto — são vidas que ecoam no presente. Se você está na mesma luta, o Acervo te espera.",
    src: "https://images.unsplash.com/photo-1635796403527-50ae19d7f65d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcGhvcCUyMGNyZXd8ZW58MHx8MHx8fDA%3D",
    link: "/acervo",
    color: "#FFF"
  },
  {
    title: "ACERVO DIGITAL",
    description: "O Hip Hop respira na voz de quem enfrenta transporte apertado, trabalho mal pago, ausência de lazer. Nossa juventude se arma com letras e rimas, não só para expressar, mas para quebrar o silêncio imposto. Cada som, fotografia e história são o Hip Hop.",
    src: "https://images.unsplash.com/photo-1508973379184-7517410fb0bc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
    link: "/acervo",
    color: "#8A2BE2"
  },
  {
    title: "MAPA DAS BATALHAS",
    description: "Geolocalizações e arquivos se unem criando um panorama da resistência cultural do DF. Veja o território além dos setores e monumentos. Traçamos pontos que conectam a força de uma cultura nascida à margem. Cada batalha é parte dessa construção.",
    src: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop",
    link: "/mapa",
    color: "#DC143C" // "#00CED1"
  },
  {
    title: "REVISTA DIGITAL",
    description: "Ponto de encontro entre o que acontece nas ruas, nos estudos e na produção artística. Curadoria colaborativa que conecta canais, coletivos e vozes independentes. De artigos científicos a entrevistas — ferramenta essencial para quem quer entender o movimento.",
    src: "https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
    link: "/revista",
    color: "#32CD32"
  },
  // {
  //   title: "HIP HOP COMO POLÍTICA",
  //   description: "Uma arte que ultrapassa entretenimento e se torna tecnologia social. O Hip Hop não pede permissão, ele ocupa. É educação não formal que chega onde outros não chegam, ensinando cidadania, identidade e solidariedade que transformam comunidades.",
  //   src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
  //   link: "/acervo",
  //   color: "#DC143C"
  // }
]

export default function Home() {
  // Hooks do contexto
  const { loadStatistics, statistics, loadAllItems, allItems } = useAcervo();
  
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
  }, [loadStatistics, loadAllItems]);

  // Estados para artistas em destaque (mesmos do acervo)
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const [loadingFeaturedArtists, setLoadingFeaturedArtists] = useState(true);

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
            console.error(`Erro ao carregar dados do artista ${artist.name}:`, error);
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
      console.error('Erro ao carregar artistas em destaque:', error);
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
          <div
            className="absolute top-0 left-15 w-32 h-32 bg-contain bg-no-repeat z-20"
            style={{
              backgroundImage: "url('/cursor02.png')"
            }}
          />
          
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
              <h3 className="text-2xl font-sometype-mono mb-4">ACERVO</h3>
              <p className="text-lg mb-4">Navegue por nossa coleção de documentos históricos</p>
              <CartoonButton
                label="EXPLORAR"
                color="bg-red-400"
                onClick={() => window.location.href = '/acervo'}
              />
            </div>
            
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4">MAPA</h3>
              <p className="text-lg mb-4">Descubra os locais históricos do Hip Hop no DF</p>
              <CartoonButton
                label="NAVEGAR"
                color="bg-sky-400"
                onClick={() => window.location.href = '/mapa'}
              />
            </div>
            
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4">REVISTA</h3>
              <p className="text-lg mb-4">Leia reportagens e entrevistas exclusivas</p>
              <CartoonButton
                label="LER MAIS"
                color="bg-lime-400"
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
                <div className="bg-theme-primary text-white px-4 py-2 rounded-full font-sometype-mono text-xl font-bold">
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
      <section className="relative bg-theme-background overflow-hidden pb-20 pt-16 border-black border-r-3 border-l-3 border-t-3">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute top-20 -right-10 w-24 h-24 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/spray_preto-1.png')"
            }}
          />
          <div
            className="absolute bottom-20 left-10 w-20 h-20 bg-contain bg-no-repeat rotate-12"
            style={{
              backgroundImage: "url('/spray_preto-2.png')"
            }}
          />
        </div>

        <div className="relative z-20 w-full">
          {/* Título da seção */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left mb-16 border-black border-b-3 w-full pb-6 px-6"
          >
            <h2 className="marca-texto-vermelho text-4xl md:text-5xl font-dirty-stains text-theme-primary mb-6">
              DESTAQUES
            </h2>
            <p className="pl-6 text-xl md:text-2xl font-sometype-mono text-theme-secondary max-w-4xl leading-relaxed">
              Mergulhe na história viva do Hip Hop do DF através de documentos únicos que contam nossa trajetória
            </p>
          </motion.div>

          {/* Grid de artistas em destaque - DADOS REAIS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-8">
            {!loadingFeaturedArtists && featuredArtists.length > 0 ? featuredArtists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                viewport={{ once: true }}
                className="group cursor-pointer bg-theme-background border-2 border-black p-6 hover:bg-zinc-100 transition-all duration-300 hover:shadow-lg"
                onClick={() => window.location.href = `/acervo/artista/${artist.id}`}
              >
                <div className="flex flex-col gap-6">
                  {/* Imagem do artista */}
                  <div className="w-full h-48 flex-shrink-0">
                    {artist.thumbnail ? (
                      <img
                        src={artist.thumbnail}
                        alt={artist.name}
                        className="w-full h-full object-cover border-2 border-black"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 border-2 border-black flex items-center justify-center">
                        <span className="text-6xl">🎭</span>
                      </div>
                    )}
                  </div>

                  {/* Informações do artista */}
                  <div className="flex flex-col">
                    <h3 className="font-dirty-stains text-3xl text-theme-primary mb-3">
                      {artist.name}
                    </h3>
                    <p className="font-sometype-mono text-gray-700 mb-4 text-lg">
                      {artist.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 border border-blue-300 font-sometype-mono text-sm">
                        📊 {artist.totalItems} {artist.totalItems === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                    
                    {/* Preview dos itens recentes */}
                    {artist.recentItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t-2 border-black">
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
                  className="bg-theme-background border-2 border-black p-6"
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
              color="bg-theme-primary text-black"
              onClick={() => window.location.href = '/acervo'}
              className="text-xl px-8 py-4"
            />            <p className="font-sometype-mono text-sm text-theme-secondary mt-4">
              {statistics?.totalItems ? `Mais de ${statistics.totalItems} itens` : 'Centenas de itens'} documentando 4 décadas de cultura Hip Hop
            </p>          </motion.div>
        </div>
      </section>

      {/* SEÇÃO TIMELINE HISTÓRICA SIMPLES */}
      <section className="relative py-20 overflow-hidden border-black border-t-3 border-l-3 border-r-3">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="absolute -top-10 left-8 w-48 h-48 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/spray_preto-1.png')"
            }}
          />
          <div
            className="absolute bottom-32 right-16 w-20 h-20 bg-contain bg-no-repeat rotate-45"
            style={{
              backgroundImage: "url('/cursor01.png')"
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-20">
          {/* Título da seção */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left mb-16"
          >
            <h2 className="marca-texto-amarelo text-4xl md:text-5xl font-dirty-stains text-white mb-6 px-6">
              4 DÉCADAS DE HISTÓRIA
            </h2>
            {/* <p className="text-xl md:text-2xl font-sometype-mono text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Marcos fundamentais que moldaram o Hip Hop do Distrito Federal
            </p> */}
          </motion.div>

          {/* Timeline Container */}
          <div className="relative">
            {/* Linha central vertical */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-black h-full top-0"></div>
            
            {/* Anos da Timeline */}
            <div className="space-y-24">
              
              {/* 1980 - Lado Esquerdo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-1/2 pr-8 text-right">
                  <div
                    style={{backgroundImage: "url('/folha-pauta-1.png')", backgroundSize: 'cover'}}
                    className="p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-black text-2xl mb-2">1980</div>
                    <h3 className="font-dirty-stains text-3xl text-black mb-3">PRIMEIROS PASSOS</h3>
                    <p className="font-sometype-mono text-sm text-black font-bold leading-relaxed">
                      Os primeiros elementos da cultura Hip Hop chegam ao DF. Jovens descobrem essa nova forma de expressão através de discos importados e programas de TV.
                    </p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-8 h-8 bg-black border-4 border-[#FFFCF2] rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="w-1/2 pl-8"></div>
              </motion.div>

              {/* 1995 - Lado Direito */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-1/2 pr-8"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 bg-black border-4 border-white rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="w-1/2 pl-8">
                  <div style={{backgroundImage: "url('/folha-pauta-1.png')", backgroundSize: 'cover'}} className="p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-black text-2xl mb-2">1995</div>
                    <h3 className="font-dirty-stains text-3xl text-black mb-3">PRIMEIRO ENCONTRO</h3>
                    <p className="font-sometype-mono text-sm text-black font-bold leading-relaxed">
                      Realização do 1º Encontro de Hip Hop de Ceilândia. Marco oficial que reuniu os 4 elementos e estabeleceu a cena organizada no DF.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 2001 - Lado Esquerdo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-1/2 pr-8 text-right">
                  <div style={{backgroundImage: "url('/folha-pauta-1.png')", backgroundSize: 'cover'}} className="p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-black text-2xl mb-2">2001</div>
                    <h3 className="font-dirty-stains text-3xl text-black mb-3">ERA DIGITAL</h3>
                    <p className="font-sometype-mono text-sm text-black font-bold leading-relaxed">
                      Início da documentação sistemática com tecnologia digital. Battles e eventos começam a ser registrados, criando memória histórica.
                    </p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="w-8 h-8 bg-black border-4 border-white rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="w-1/2 pl-8"></div>
              </motion.div>

              {/* 2020 - Lado Direito */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center"
              >
                <div className="w-1/2 pr-8"></div>
                <div className="relative z-10">
                  <div className="w-8 h-8 bg-black border-4 border-white rounded-full shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"></div>
                </div>
                <div className="w-1/2 pl-8">
                  <div style={{backgroundImage: "url('/folha-pauta-1.png')", backgroundSize: 'cover'}} className="p-9 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
                    <div className="font-scratchy font-black text-black text-2xl mb-2">2020</div>
                    <h3 className="font-dirty-stains text-3xl text-black mb-3">PATRIMÔNIO CULTURAL</h3>
                    <p className="font-sometype-mono text-sm text-black font-bold leading-relaxed">
                      Hip Hop DF é reconhecido como patrimônio cultural. Nova geração mantém tradições enquanto inova com tecnologias digitais.
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden border-r-3 border-l-3 border-t-3 border-b-3 border-black pb-0">


        {/* Decorative elements */}
        <div className="absolute inset-0 z-10 pointer-events-none decorative-elements">

          {/* Spray effects */}
          <div
            className="absolute bottom-0 left-15 w-64 h-64 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/cursor02.png')"
            }}
          />

          <div
            className="absolute top-0 -right-15 w-32 h-32 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/spray_preto-1.png')"
            }}
          />

          <div
            className="absolute top-5 left-16 w-28 h-28 bg-contain bg-no-repeat rotate-45"
            style={{
              backgroundImage: "url('/spray_preto-2.png')"
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
            className="text-2xl md:text-3xl font-sometype-mono text-theme-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Arquivo bruto, direto e factual. Capturando a evolução das expressões artísticas que sobreviveram à exclusão e invisibilidade. Memória viva que inspira e transforma gerações.
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
              color="bg-black text-white"
              onClick={() => window.location.href = '/acervo'}
              className="text-xl px-8 py-4 mx-auto"
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
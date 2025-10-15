'use client';
import './parallaxstyle.css';
import CardParallax from '../components/CardParallax.jsx';
import { useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis'

import HeaderApp from '@/components/html/HeaderApp';
import PolaroidCard from '@/components/PolaroidPhoto';
import { CartoonButton } from '@/components/ui/cartoon-button';
import HipHopScrollySection from '@/components/HipHopScrollySection';
import AcervoCompleto from '@/components/home/AcervoCompleto';
import ApiResults from '@/components/home/ApiResults';
import atomService from '@/services/atomService';
import { getActiveArtists, DEFAULT_ARTIST_IMAGE } from '@/data/artists';
import atomCollectionsResponse from '@/data/collections';

import { motion, AnimatePresence } from 'motion/react';


const projects = [
  {
    title: "",
    description: "Uma plataforma digital dedicada à preservação e documentação da cultura Hip Hop no Distrito Federal. Nosso objetivo é contar as histórias, mapear os locais históricos e celebrar os protagonistas que construíram este movimento.",
    src: "https://images.unsplash.com/photo-1635796403527-50ae19d7f65d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcGhvcCUyMGNyZXd8ZW58MHx8MHx8fDA%3D",
    link: "/acervo",
    color: "#FFF"
  },
  {
    title: "ACERVO DIGITAL", 
    description: "Explore nossa coleção de documentos, fotos, vídeos e áudios que contam a história do Hip Hop brasiliense. Desde os primeiros b-boys até os rappers contemporâneos, preservamos a memória de quatro décadas de cultura.",
    src: "https://images.unsplash.com/photo-1508973379184-7517410fb0bc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
    link: "/acervo",
    color: "#8A2BE2"
  },
  {
    title: "MAPA INTERATIVO",
    description: "Navegue pelos locais históricos do Hip Hop no DF através do nosso mapa interativo. Descubra onde aconteceram as primeiras batalhas, os pontos de encontro dos grafiteiros e os estúdios que marcaram época.",
    src: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600&fit=crop", 
    link: "/mapa",
    color: "#00CED1"
  },
  {
    title: "REVISTA DIGITAL",
    description: "Leia reportagens, entrevistas e ensaios sobre a cultura Hip Hop do Distrito Federal. Nossa revista traz as vozes dos protagonistas, análises críticas e reflexões sobre o passado, presente e futuro do movimento.",
    src: "https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
    link: "/revista",
    color: "#32CD32"
  },
  {
    title: "MEMÓRIA VIVA",
    description: "Coletamos depoimentos, registramos histórias e documentamos a evolução contínua do Hip Hop brasiliense. Cada elemento da cultura - rap, breaking, grafite e DJing - tem seu espaço preservado para as futuras gerações.",
    src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop",
    link: "/acervo",
    color: "#DC143C"
  }
]

export default function Home() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })

  // Estados para artistas da API
  const [artistsData, setArtistsData] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [artistsError, setArtistsError] = useState(null);
  const [projectsWithAPI, setProjectsWithAPI] = useState(projects);

  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  })

  // Carregar artistas da API
  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoadingArtists(true);
        
        // Buscar artistas ativos da configuração
        const activeArtists = getActiveArtists();
        console.info('[Home] 🎭 Artistas ativos configurados:', activeArtists.map(a => a.name));
        
        if (activeArtists.length === 0) {
          console.warn('[Home] ⚠️ Nenhum artista ativo encontrado');
          setProjectsWithAPI([projects[0]]); // Apenas primeiro card
          return;
        }
        
        // Buscar dados de cada artista na API
        const artistsResults = await atomService.getMultipleArtistsItems(activeArtists);
        setArtistsData(artistsResults);
        
        // Criar projects combinando o primeiro card estático com artistas da API
        const firstProject = projects[0]; // Mantém o primeiro card
        
        const artistProjects = artistsResults
          .filter(result => result.total > 0) // Apenas artistas com conteúdo
          .map((result, index) => {
            const artist = activeArtists.find(a => a.key === result.artistKey);
            const firstItem = result.results[0] || {};
            
            return {
              title: artist.displayName,
              description: `${artist.description} (${result.total} ${result.total === 1 ? 'item' : 'itens'} no acervo)`,
              src: firstItem.thumbnail_url || DEFAULT_ARTIST_IMAGE,
              link: `/acervo?artist=${artist.key}`,
              color: artist.color,
              slug: `artist-${artist.key}`,
              artistKey: artist.key,
              itemCount: result.total,
              strategy: result.strategy,
              // Metadados do primeiro item para exibição
              reference_code: firstItem.reference_code,
              creation_dates: firstItem.creation_dates,
              place_access_points: firstItem.place_access_points
            };
          });
        
        setProjectsWithAPI([firstProject, ...artistProjects]);
        
        console.info('[Home] ✅ Artistas carregados:', {
          totalArtists: activeArtists.length,
          artistsWithContent: artistProjects.length,
          summary: artistProjects.map(p => ({
            name: p.title,
            count: p.itemCount,
            strategy: p.strategy
          }))
        });
        
      } catch (error) {
        console.error('[Home] ❌ Erro ao carregar artistas:', error);
        setArtistsError(error.message);
      } finally {
        setLoadingArtists(false);
      }
    };

    loadArtists();
  }, []);

  return (
    <main ref={container} className="main">
      <HeaderApp title="DISTRITO HIPHOP" showTitle={true} />
      
      {/* HERO SECTION */}
      <section className="hero-section relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
        
        
        {/* Decorative elements */}
        <div className="absolute inset-0 z-10 pointer-events-none decorative-elements">
          
          {/* Spray effects */}
          <div 
            className="absolute top-20 right-20 w-32 h-32 bg-contain bg-no-repeat"
            style={{
              backgroundImage: "url('/spray_preto-1.png')"
            }}
          />
          
          <div 
            className="absolute bottom-32 left-16 w-28 h-28 bg-contain bg-no-repeat rotate-45"
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
            Preservando a memória e cultura do Hip Hop do Distrito Federal através de documentos, fotos, vídeos e histórias dos protagonistas do movimento
          </motion.p>
          
          {/* Featured Artists Preview */}
          {!loadingArtists && artistsData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12"
            >
             
              
              <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                {artistsData.slice(0, 3).map((result, index) => {
                  const artist = getActiveArtists().find(a => a.key === result.artistKey);
                  const item = result.results[0];
                  
                  return (
                    <motion.div
                      key={`hero-artist-${result.artistKey}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                      className="group cursor-pointer"
                      onClick={() => window.location.href = `/acervo?artist=${artist.key}`}
                    >
                      <div className="relative">
                        <PolaroidCard
                          src={item?.thumbnail_url || DEFAULT_ARTIST_IMAGE}
                          alt={artist?.displayName}
                          caption={artist?.displayName}
                          subtitle={`${result.total} ${result.total === 1 ? 'item' : 'itens'}`}
                          tapeColor={index === 0 ? "yellow" : index === 1 ? "blue" : "green"}
                          rotation={index % 2 === 0 ? -3 : 3}
                          className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-0"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
          
          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="space-y-6"
          >
            <CartoonButton
              label="EXPLORAR ACERVO COMPLETO"
              color="bg-yellow-400"
              onClick={() => window.location.href = '/acervo'}
              className="text-xl px-8 py-4 mx-auto"
            />
            
            <div className="flex flex-wrap justify-center gap-4 text-sm font-sometype-mono text-theme-secondary">
              <span>📸 {artistsData.reduce((total, result) => total + result.total, 0)} itens no acervo</span>
              <span>🎭 {artistsData.length} artistas em destaque</span>
              <span>📅 4 décadas de história</span>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* CARDS PARALLAX DOS ARTISTAS */}
      <section className="relative">
        {!loadingArtists && !artistsError && projectsWithAPI.length > 0 && (
          projectsWithAPI.slice(1).map((project, i) => {
            const targetScale = 1 - ((projectsWithAPI.length - i - 1) * 0.05);
            return (
              <CardParallax 
                key={project.slug || `hero_p_${i}`} 
                i={i} 
                {...project} 
                progress={scrollYProgress} 
                range={[i * 0.25, 1]} 
                targetScale={targetScale}
              />
            );
          })
        )}
        
        {/* Spacer para empurrar conteúdo abaixo dos cards sticky */}
        <div style={{ height: `${Math.max(projectsWithAPI.length - 1, 1) * 80}vh` }}></div>
      </section>
      
      {/* Loading state para artistas */}
      {/* {loadingArtists ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-theme border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-xl font-dirty-stains text-theme-primary">
              Carregando artistas do acervo...
            </p>
            <p className="text-sm font-sometype-mono text-theme-secondary mt-2">
              Buscando conteúdo na API AtoM
            </p>
          </div>
        </div>
      ) : artistsError ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Erro ao carregar artistas</h3>
              <p className="mb-4">{artistsError}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Cards dos artistas
        projectsWithAPI.map( (project, i) => {
          const targetScale = 1 - ( (projectsWithAPI.length - i) * 0.05);
          return <CardParallax key={project.slug || `p_${i}`} i={i} {...project} progress={scrollYProgress} range={[i * .2, 1]} targetScale={targetScale}/>
        })
      )} */}
      
      {/* Spacer to push content below the sticky cards */}
      {/* <div style={{ height: '80vh' }}></div> */}

      {/* Seção EM DESTAQUE */}
      {/* <section className="py-16 bg-theme-background relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-dirty-stains text-center mb-4 text-theme-primary">
              EM DESTAQUE
            </h2>
            <p className="text-xl font-sometype-mono text-center mb-12 text-theme-secondary max-w-3xl mx-auto">
              Conheça alguns dos itens mais importantes do nosso acervo
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artistsData.slice(0, 3).map((result, index) => {
              const artist = getActiveArtists().find(a => a.key === result.artistKey);
              const item = result.results[0];
              
              return (
                <motion.div
                  key={`featured-${result.artistKey}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <PolaroidCard
                    src={item?.thumbnail_url || DEFAULT_ARTIST_IMAGE}
                    alt={item?.title || artist?.displayName}
                    caption={item?.title || artist?.displayName}
                    subtitle={item?.creation_dates?.[0] || 'Data não informada'}
                    tapeColor="yellow"
                    rotation={index % 2 === 0 ? -2 : 2}
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-dirty-stains text-2xl text-theme-primary mb-2">
                      {item?.title || artist?.displayName}
                    </h3>
                    <p className="font-sometype-mono text-sm text-theme-secondary mb-3">
                      {item?.scope_and_content || artist?.description}
                    </p>
                    <CartoonButton
                      label="VER MAIS"
                      color="bg-yellow-400"
                      onClick={() => window.location.href = `/acervo?search=${encodeURIComponent(item?.title || artist?.displayName)}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section> */}


      {/* Seção NAVEGUE PELO MOSAICO */}
      {/* <section className="py-16 bg-theme-background relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl font-dirty-stains text-center mb-4 text-theme-primary">
              NAVEGUE PELO MOSAICO
            </h2>
            <p className="text-xl font-sometype-mono text-center mb-12 text-theme-secondary max-w-3xl mx-auto">
              Explore diferentes aspectos da cultura Hip Hop através de nosso acervo diversificado
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artistsData.flatMap(result => result.results.slice(0, 2)).slice(0, 18).map((item, index) => (
              <motion.div
                key={`mosaic-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="aspect-square group cursor-pointer"
                onClick={() => window.location.href = `/acervo?search=${encodeURIComponent(item.title)}`}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-black shadow-lg">
                  <img
                    src={item.thumbnail_url || DEFAULT_ARTIST_IMAGE}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-sometype-mono truncate">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <CartoonButton
              label="VER TODO O ACERVO"
              color="bg-black"
              onClick={() => window.location.href = '/acervo'}
            />
          </motion.div>
        </div>
      </section> */}

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

      {/* <section
        style={{
          position: 'relative',
          zIndex: 10,
          color: 'white',
          padding: '4rem 2rem',
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url('/imgfundo.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-dirty-stains mb-8 text-white">acervo hip-hop</h2>
          <p className="text-2xl font-sometype-mono mb-8">
            O Hip Hop do DF continua evoluindo. Faça parte dessa história.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="p-8">
              <h3 className="text-3xl font-dirty-stains mb-4">PARTICIPE</h3>
              <p className="text-lg mb-6 font-sometype-mono">Envie suas histórias, fotos e documentos para nosso acervo</p>
              <div className="flex justify-center">
                <CartoonButton
                  label="Envie sua história"
                  color="bg-amber-300"
                  onClick={() => window.location.href = '/acervo#contribua'}
                />
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-dirty-stains mb-4">CONECTE</h3>
              <p className="text-lg mb-6 font-sometype-mono">Navegue pela história e cultura do hip hop do DF</p>
              <div className="flex justify-center">
                <CartoonButton
                  label="Visitar acervo"
                  color="bg-emerald-300"
                  onClick={() => window.location.href = '/comunidade'}
                />
              </div>
            </div>
          </div>
        </div>
      </section> */}
      
    </main>
  )
}
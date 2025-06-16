"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedButton from '@/components/AnimatedButton';
import StackedPagesScroll from "@/components/ui/stack";

const Revista = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estratégia de carregamento otimizado - mesma da homepage
    if (typeof window !== 'undefined') {
      // Pré-armazenar a imagem em cache
      const bgImage = new window.Image();
      bgImage.src = '/fundo_base.jpg';

      // Adicionar preload no head se não existir
      let link = document.querySelector('link[href="/fundo_base.jpg"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = '/fundo_base.jpg';
        link.type = 'image/jpeg';
        link.fetchpriority = 'high';
        document.head.appendChild(link);
      }

      // Mostrar página quando imagem estiver carregada
      if (bgImage.complete) {
        setIsLoading(false);
      } else {
        bgImage.onload = () => setIsLoading(false);
        bgImage.onerror = () => setIsLoading(false);
        setTimeout(() => setIsLoading(false), 2000);
      }
    }
  }, []);

  return (
    <>
      {/* Tela de carregamento - mesma da homepage */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-16 bg-white rounded-sm"
                initial={{ height: 8 }}
                animate={{
                  height: [8, 40, 8],
                  backgroundColor: ["#ffffff", "#f8e71c", "#ffffff"]
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
      )}

      {/* Conteúdo da página */}
      <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Título ocupando toda a largura da tela - ACIMA DE TUDO */}
        <div className="w-full bg-transparent">
          <motion.h1
            className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-black text-center py-4 md:py-6 lg:py-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              letterSpacing: '0.05em',
              lineHeight: '0.9'
            }}
          >
            REVISTA DIGITAL
          </motion.h1>
        </div>

        <motion.div
          className="relative w-full py-4 md:py-6 border-t-3 border-b-3 border-solid border-black z-20"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between px-4 md:px-8">
            <div className="flex items-start px-4 absolute top-[-50px] left-[-50px]">
              <Image src="cursor03.png" alt="Marca de spray com escorrimento" width={150} height={180} />
            </div>
            {/* Navegação principal - centralizada */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 flex-1">
              <Link href="/">
                <AnimatedButton textSize="text-3xl" text="INÍCIO" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Page Content with Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full overflow-hidden"
          >
            <div className="w-full overflow-hidden">
              {/* Hero Section da Revista */}
              <div className="container mx-auto px-4 py-8">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center text-black mb-12"
                >
                  <h2 className="font-sometype-mono text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl mb-8 max-w-4xl mx-auto">
                    Revista Digital do Hip Hop Brasiliense - Preservando memórias, contando histórias
                  </h2>
                </motion.div>

                {/* Seção Revista em Destaque */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-16"
                >
                  <div className="bg-black/20 backdrop-blur-sm border-3 border-black rounded-lg p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <img 
                          src="https://images.unsplash.com/photo-1635796403527-50ae19d7f65d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcGhvcCUyMGNyZXd8ZW58MHx8MHx8fDA%3D" 
                          alt="Revista Zulu Nation DF - Edição #03"
                          className="w-full rounded-lg shadow-lg border-2 border-black"
                        />
                      </div>
                      <div>
                        <h3 className="font-dirty-stains text-4xl mb-4 text-black">REVISTA ZULU NATION DF</h3>
                        <h4 className="font-sometype-mono text-xl mb-4 text-black">Edição #03 - Abril 2005</h4>
                        <p className="font-sometype-mono text-black mb-6">
                          Terceira edição da revista independente da Zulu Nation DF, contendo entrevistas com artistas locais, 
                          agenda cultural, letras de rap e artigos sobre a cultura Hip Hop no Distrito Federal.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {["24 páginas", "Zulu Nation", "Cultura urbana", "Rap nacional"].map((tag) => (
                            <span key={tag} className="bg-[#fae523] text-black px-3 py-1 rounded-full text-sm font-sometype-mono border border-black">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Grid de Reportagens e Materiais */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-16"
                >
                  <h3 className="font-dirty-stains text-4xl text-center mb-8 text-black">REPORTAGENS EM DESTAQUE</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        title: "1º Encontro de Hip Hop de Ceilândia",
                        date: "15 de Agosto, 1995",
                        description: "Documentação fotográfica do primeiro grande encontro de Hip Hop organizado em Ceilândia, reunindo crews de breaking, MCs e DJs da região.",
                        image: "https://images.unsplash.com/photo-1508973379184-7517410fb0bc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
                        tags: ["Ceilândia", "Breaking", "Crew TNT"]
                      },
                      {
                        title: "Festa Hip Hop Samambaia",
                        date: "20 de Novembro, 1998",
                        description: "Cartaz promocional histórico da festa realizada em Samambaia, apresentando grupos locais e convidados de outras regiões do DF.",
                        image: "https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
                        tags: ["Samambaia", "Posse Mente Zulu", "Festa"]
                      },
                      {
                        title: "Competição de Breaking - Planaltina",
                        date: "28 de Julho, 2001",
                        description: "Registro audiovisual de competição histórica mostrando battles entre crews locais e de outras regiões do DF.",
                        image: "https://images.unsplash.com/photo-1517151692071-54b58b01b550?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D",
                        tags: ["Planaltina", "B-Boy Tornado", "Breaking"]
                      },
                      {
                        title: "Mural de Grafite - Estação Taguatinga",
                        date: "12-15 de Setembro, 2003",
                        description: "Documentação de mural produzido próximo ao metrô, retratando elementos da cultura Hip Hop e identidade local.",
                        image: "https://images.unsplash.com/photo-1565970350234-0231bd6c6cdd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcGhvcCUyMGdyYWZmaXRpfGVufDB8fDB8fHww",
                        tags: ["Taguatinga", "Crew TDF", "Arte urbana"]
                      },
                      {
                        title: "Movimento Zulu Nation no DF",
                        date: "1999 - presente",
                        description: "A história do capítulo da Universal Zulu Nation no Distrito Federal e seu papel na preservação da cultura Hip Hop.",
                        image: "https://images.unsplash.com/photo-1635796403527-50ae19d7f65d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcGhvcCUyMGNyZXd8ZW58MHx8MHx8fDA%3D",
                        tags: ["Zulu Nation DF", "Educação", "Cultura"]
                      },
                      {
                        title: "Crew TNT - Pioneiros de Ceilândia",
                        date: "1994-2005",
                        description: "A trajetória da crew que marcou os primeiros anos do Hip Hop em Ceilândia, organizando eventos e reunindo a comunidade.",
                        image: "https://images.unsplash.com/photo-1719634689927-58ec6baf0f0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGhpcGhvcCUyMGNyZXd8ZW58MHx8MHx8fDA%3D",
                        tags: ["Crew TNT", "Ceilândia", "Pioneiros"]
                      }
                    ].map((story, index) => (
                      <motion.div
                        key={story.title}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-white/90 backdrop-blur-sm border-3 border-black rounded-lg overflow-hidden cursor-pointer shadow-lg"
                      >
                        <img 
                          src={story.image} 
                          alt={story.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <div className="text-sm font-sometype-mono text-black/70 mb-2">{story.date}</div>
                          <h4 className="font-dirty-stains text-xl mb-3 text-black leading-tight">{story.title}</h4>
                          <p className="font-sometype-mono text-sm text-black/80 mb-4 leading-relaxed">{story.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {story.tags.map((tag) => (
                              <span key={tag} className="bg-[#fae523] text-black px-2 py-1 rounded text-xs font-sometype-mono border border-black">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Seção Estatísticas do Acervo */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-black/20 backdrop-blur-sm border-3 border-black rounded-lg p-8 mb-16"
                >
                  <h3 className="font-dirty-stains text-4xl text-center mb-8 text-black">NOSSO ACERVO</h3>
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    {[
                      { number: "2.500+", label: "Itens Documentais", icon: "📚" },
                      { number: "847", label: "Registros Catalogados", icon: "📝" },
                      { number: "40+", label: "Anos de História", icon: "🗓️" },
                      { number: "15+", label: "Regiões do DF", icon: "🗺️" }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className="text-black"
                      >
                        <div className="text-4xl mb-2">{stat.icon}</div>
                        <div className="font-dirty-stains text-3xl mb-2">{stat.number}</div>
                        <div className="font-sometype-mono text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Componente StackedPagesScroll */}
                {/* <div className="mb-8">
                  <StackedPagesScroll />
                </div> */}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Revista;
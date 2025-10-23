"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { SpinningText } from '@/components/magicui/spinning-text';
import AnimatedButton from '@/components/AnimatedButton';
import { useEffect } from 'react';
import PolaroidCard from '@/components/PolaroidPhoto';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import HeaderApp from '@/components/html/HeaderApp';

import { CartoonButton } from '@/components/ui/cartoon-button';
import { ClipPathLinks } from '@/components/ui/clip-path-links';
import StackedPagesScroll from '@/components/ui/stack';
import StackedPagesScrollSimple from '@/components/ui/stack-simple';
import StoryCard from '@/components/ui/story-card';
import AcervoPreview from '@/components/home/AcervoPreview';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estratégia de carregamento otimizado
    if (typeof window !== 'undefined') {
      // Simular carregamento rápido
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  return (
    <>
      {/* Tela de carregamento */}
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

      {/* Conteúdo principal */}
      <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        
        <HeaderApp title="DISTRITO HIPHOP" showTitle={true} />

        {/* Hero Section - StackedPagesScroll - História do Hip Hop DF */}
        <div className="relative z-0">
          <StackedPagesScroll />
        </div>

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
            className="w-full overflow-hidden max-w-screen-xl mx-auto px-4 md:px-8 py-8 border-solid border-theme"
          >
            {/* Grid de conteúdo original */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[70vh] mb-12">
              {/* Coluna esquerda (1/4) com duas imagens empilhadas */}
              <div className="md:col-span-5 gap-6">
                {/* Imagem superior - usando PolaroidCard */}
                <PolaroidCard
                  imageSrc={'https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww'}
                  tape={{ position: 'bottom-left', angle: 45 }}
                  caption={`Acervo pessoal DJ Fulano, em Guariroba - Ceilândia, DF`}
                />
              </div>

              {/* Coluna direita (3/4) */}
              <div className="md:col-span-7 flex flex-col justify-center">
                <h3 className="font-sometype-mono text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-3xl text-theme text-center mb-6">Uma plataforma digital dedicada à preservação, documentação e difusão da cultura Hip Hop do Distrito Federal e Entorno. </h3>
                <div className="flex justify-center mt-4">
                  <div className="mr-4">
                    <CartoonButton className="mr-2" color="bg-[#fae523]" label="Visitar Acervo!" onClick={() => window.location.href = '/acervo'} />
                  </div>
                  <div className="ml-4">
                    <CartoonButton className="ml-2" label="Mapa!" color="" onClick={() => window.location.href = '/mapa'} />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid das seções principais usando StoryCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <StoryCard
                title="ACERVO DIGITAL"
                description="Fotografias, vídeos, documentos e registros históricos da cultura Hip Hop do DF preservados digitalmente."
                image="https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww"
                tags={["500+ itens preservados", "Documentação", "História"]}
                href="/acervo"
                index={0}
              />

              <StoryCard
                title="MAPA INTERATIVO"
                description="Navegue pelos territórios e locais históricos do Hip Hop em todas as regiões administrativas do DF."
                image="mapa.webp"
                tags={["31 regiões mapeadas", "Territórios", "Geografia"]}
                href="/mapa"
                index={1}
              />

              <StoryCard
                title="AUDIOVISUAL"
                description="Vídeos, documentários e registros audiovisuais da cena Hip Hop brasiliense e sua evolução."
                image="https://images.unsplash.com/photo-1660182670014-1b4c7602ebea?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                tags={["Documentários", "Clipes", "Registros"]}
                href="/audiovisual"
                index={2}
              />

              <StoryCard
                title="REVISTA DIGITAL"
                description="Artigos, entrevistas e reportagens sobre a cultura Hip Hop do Distrito Federal e sua comunidade."
                image="https://images.unsplash.com/photo-1635796403527-50ae19d7f65d?w=800&auto=format&fit=crop&q=60"
                tags={["Conteúdo editorial", "Entrevistas", "Reportagens"]}
                href="/revista"
                index={3}
              />
            </div>

            {/* Preview do Acervo - Seção adicional */}
            <AcervoPreview />
          </motion.div>

        </AnimatePresence>

        {/* Seção de estatísticas gerais */}
        <motion.div
          id="preservando-cultura-section"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-16 mt-12 border-t-4 border-b-4 border-theme relative bg-white/95"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="font-dirty-stains text-4xl md:text-5xl text-theme/80 mb-4">
                PRESERVANDO NOSSA CULTURA
              </h2>
              <p className="text-theme/80 text-lg font-bold max-w-2xl mx-auto">
                Mais de 40 anos de história Hip Hop no Distrito Federal documentados e preservados
              </p>
            </div>
          </div>
        </motion.div>


        
      </div>
    </>
  );
}
'use client';
import './parallaxstyle.css';
import CardParallax from '../components/CardParallax.jsx';
import { useScroll } from 'framer-motion';
import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis'

import HeaderApp from '@/components/html/HeaderApp';
import PolaroidCard from '@/components/PolaroidPhoto';
import { CartoonButton } from '@/components/ui/cartoon-button';
import HipHopScrollySection from '@/components/HipHopScrollySection';
import AcervoCompleto from '@/components/home/AcervoCompleto';
import ApiResults from '@/components/home/ApiResults';

import { motion, AnimatePresence } from 'motion/react';


const projects = [
  {
    title: "DISTRITO HIP HOP",
    description: "Uma plataforma digital dedicada à preservação e documentação da cultura Hip Hop no Distrito Federal. Nosso objetivo é contar as histórias, mapear os locais históricos e celebrar os protagonistas que construíram este movimento.",
    src: "https://images.unsplash.com/photo-1635796403527-50ae19d7f65d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhpcGhvcCUyMGNyZXd8ZW58MHx8MHx8fDA%3D",
    link: "/acervo",
    color: "#FF6B35"
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

  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })

  return (
    <main ref={container} className="main">
      <HeaderApp title="DISTRITO HIPHOP" showTitle={true} />
      {
        projects.map( (project, i) => {
          const targetScale = 1 - ( (projects.length - i) * 0.05);
          return <CardParallax key={`p_${i}`} i={i} {...project} progress={scrollYProgress} range={[i * .25, 1]} targetScale={targetScale}/>
        })
      }
      
      {/* Spacer to push content below the sticky cards */}
      <div style={{ height: '100vh' }}></div>
      
      <HipHopScrollySection />

      <AcervoCompleto />

      <ApiResults />

      <section id="posscrolly" style={{ position: 'relative', zIndex: 10, backgroundColor: 'white', padding: '4rem 2rem' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-dirty-stains text-center mb-8 text-theme-primary">EXPLORE MAIS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4">ACERVO</h3>
              <p className="text-lg mb-4">Navegue por nossa coleção de documentos históricos</p>
              <CartoonButton textSize="text-xl" text="EXPLORAR" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
            </div>
            
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4">MAPA</h3>
              <p className="text-lg mb-4">Descubra os locais históricos do Hip Hop no DF</p>
              <CartoonButton textSize="text-xl" text="NAVEGAR" backgroundMode="static" imagePath="marca-texto-azul.png" />
            </div>
            
            <div className="bg-theme-card p-6 rounded-lg">
              <h3 className="text-2xl font-sometype-mono mb-4">REVISTA</h3>
              <p className="text-lg mb-4">Leia reportagens e entrevistas exclusivas</p>
              <CartoonButton textSize="text-xl" text="LER MAIS" backgroundMode="static" imagePath="marca-texto-verde.png" />
            </div>
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', zIndex: 10, backgroundColor: '#f0f0f0', padding: '4rem 2rem' }}>
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
      </section>

      <section style={{ position: 'relative', zIndex: 10, backgroundColor: 'black', color: 'white', padding: '4rem 2rem' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-8xl font-dirty-stains mb-8">CONTINUE A HISTÓRIA</h2>
          <p className="text-2xl font-sometype-mono mb-8">
            O Hip Hop do DF continua evoluindo. Faça parte dessa história.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="p-8">
              <h3 className="text-3xl font-dirty-stains mb-4">PARTICIPE</h3>
              <p className="text-lg mb-6">Envie suas histórias, fotos e documentos para nosso acervo</p>
            </div>
            <div className="p-8">
              <h3 className="text-3xl font-dirty-stains mb-4">CONECTE</h3>
              <p className="text-lg mb-6">Junte-se à comunidade e mantenha viva a cultura Hip Hop</p>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  )
}
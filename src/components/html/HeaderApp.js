"use client";

import AnimatedButton from "../AnimatedButton";
import Link from "next/link";
import { motion } from "motion/react";
import { SpinningText } from "../magicui/spinning-text";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import ThemeToggle from "../ThemeToggle";

export default function HeaderApp({ title, showTitle = false }) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Atualiza quando o tema muda
    setCurrentTheme(theme);
  }, [theme]);
  useEffect(() => {
    let ticking = false;
    const SCROLL_THRESHOLD = 100; // Threshold em pixels para ativar o estado "scrolled"
    const HYSTERESIS = 20; // Histerese para evitar alternância rápida

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Implementa histerese: só muda o estado se ultrapassar o threshold com margem
          if (currentScrollY > SCROLL_THRESHOLD + HYSTERESIS && !isScrolled) {
            setIsScrolled(true);
          } else if (currentScrollY < SCROLL_THRESHOLD - HYSTERESIS && isScrolled) {
            setIsScrolled(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]); // Dependência necessária para verificar estado atual

  return (
    <motion.header
      className="sticky top-0 w-full border-3 border-solid border-theme z-50"
      style={{
        backgroundColor: currentTheme === 'light' ? '#FFFCF2' : '#252422',
        willChange: 'height, transform'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        height: isScrolled ? 'auto' : 'auto'
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <motion.div 
        className="w-full border-theme overflow-hidden"
        animate={{ 
          minHeight: isScrolled ? '70px' : '200px'
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1]
        }}
      >
        {isScrolled ? (
          /* Layout compacto durante scroll */
          <div className="relative h-full">
            <div className="grid grid-cols-12 h-full">
              {/* Primeira coluna: Spinning text ocupando toda altura */}
              <div className="col-span-2 flex items-center justify-center border-r-3 border-theme h-full">
                <Link href="/">
                  <SpinningText
                    radius={6}
                    className="h-12 w-12 text-sm tracking-[0.3em] font-scratchy"
                  >
                    acervo • hip-hop •
                  </SpinningText>
                </Link>
              </div>

              {/* Segunda coluna: Navegação compacta */}
              <div className="col-span-10 flex items-center justify-center px-4 md:px-8 py-3">
                <nav className="flex gap-2 md:gap-3">
                  <Link href="/acervo">
                    <AnimatedButton textSize="text-lg" text="ACERVO" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
                  </Link>
                  <Link href="/mapa">
                    <AnimatedButton textSize="text-lg" text="MAPA" backgroundMode="static" imagePath="marca-texto-azul.png" />
                  </Link>
                  <Link href="/revista">
                    <AnimatedButton textSize="text-lg" text="REVISTA" backgroundMode="static" imagePath="marca-texto-verde.png" />
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Toggle de tema fixo no canto superior direito */}
            <div className="absolute top-2 right-2">
              <ThemeToggle />
            </div>
          </div>
        ) : (
          /* Layout completo quando no topo */
          <div className="relative">
            <div className="grid grid-cols-12 h-full min-h-[200px]">
              {/* Primeira coluna: Imagem e Spinning text - grade vertical */}
              <div className="col-span-2 grid grid-rows-2 border-r-3 border-theme">
                {/* Container da imagem */}
                {showTitle && title ? (
                  <div className="flex items-center justify-center border-b-3 border-theme">
                    <motion.img
                      src="/spray_preto-2.png"
                      alt="Spray decoration"
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                ) : (
                  <div className="border-b-3 border-theme"></div>
                )}
                
                {/* Spinning text */}
                <Link href="/" className="flex items-center justify-center">
                  <div className="scale-120 md:scale-120">
                    <SpinningText
                      radius={8}
                      className="h-20 w-20 text-base md:text-lg tracking-[0.35em] font-scratchy"
                    >
                      acervo • hip-hop • Distrito Federal •
                    </SpinningText>
                  </div>
                </Link>
              </div>

              {/* Segunda coluna: Título e Navegação */}
              <div className="col-span-10 flex flex-col items-center justify-center px-4 md:px-8 py-4 md:py-6">
                {/* Título */}
                {showTitle && title && (
                  <motion.h1
                    className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-theme-primary text-center mb-6 md:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      letterSpacing: '0.05em',
                      lineHeight: '0.9',
                      textTransform: 'uppercase',
                    }}
                  >
                    {title}
                  </motion.h1>
                )}
                
                {/* Navegação principal */}
                <nav className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6">
                  <Link href="/acervo">
                    <AnimatedButton textSize="text-3xl" text="ACERVO" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
                  </Link>
                  <Link href="/mapa">
                    <AnimatedButton textSize="text-3xl" text="MAPA" backgroundMode="static" imagePath="marca-texto-azul.png" />
                  </Link>
                  <Link href="/revista">
                    <AnimatedButton textSize="text-3xl" text="REVISTA" backgroundMode="static" imagePath="marca-texto-verde.png" />
                  </Link>
                </nav>
              </div>
            </div>
            
            {/* Toggle de tema fixo no canto superior direito */}
            <div className="absolute top-2 right-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </motion.div>
    </motion.header>
  );
}
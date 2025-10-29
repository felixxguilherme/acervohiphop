"use client";

import AnimatedButton from "../AnimatedButton";
import Link from "next/link";
import { motion } from "motion/react";
import { SpinningText } from "../magicui/spinning-text";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "../ThemeToggle";

export default function HeaderApp({ title, showTitle = false }) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isScrolledRef = useRef(false);

  // Função para determinar qual logo usar baseado na página e tema
  const getLogoSrc = () => {
    const themeText = currentTheme === 'light' ? 'claro' : 'escuro';
    
    if (pathname?.startsWith('/acervo')) {
      return `/dhh_acervo_${themeText}.webp`;
    } else if (pathname?.startsWith('/mapa')) {
      return `/dhh_mapa_${themeText}.webp`;
    } else if (pathname?.startsWith('/revista')) {
      return `/dhh_revista_${themeText}.webp`;
    } else {
      // Página inicial - usar spray
      return currentTheme === 'light' ? "/spray_preto-2.webp" : "/spray_vermelho-1.webp";
    }
  };

  // Função para determinar o título baseado na página
  const getPageTitle = () => {
    if (pathname?.startsWith('/acervo')) {
      return 'ACERVO';
    } else if (pathname?.startsWith('/mapa')) {
      return 'MAPA';
    } else if (pathname?.startsWith('/revista')) {
      return 'REVISTA';
    } else {
      // Página inicial
      return title || 'DISTRITO HIPHOP';
    }
  };

  // Função para verificar se deve usar formato de duas linhas (só na home)
  const shouldUseTwoLines = () => {
    return pathname === '/' && (title === 'DISTRITO HIPHOP' || !pathname?.startsWith('/'));
  };

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    
    // Delay para evitar conflitos com animações da página
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);

  useEffect(() => {
    // Atualiza quando o tema muda
    setCurrentTheme(theme);
  }, [theme]);

  // Sincronizar ref com estado apenas uma vez
  useEffect(() => {
    isScrolledRef.current = isScrolled;
  }, []);
  useEffect(() => {
    // Só inicializa o scroll listener após a página estar carregada
    if (!isInitialized) return;

    let ticking = false;
    let lastScrollY = 0;
    const SCROLL_THRESHOLD = 100;
    const HYSTERESIS = 30;
    const MIN_SCROLL_DIFF = 5;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Só processa se houve mudança significativa no scroll
          if (Math.abs(currentScrollY - lastScrollY) < MIN_SCROLL_DIFF) {
            ticking = false;
            return;
          }
          
          // Implementa histerese com mais estabilidade usando ref
          if (currentScrollY > SCROLL_THRESHOLD + HYSTERESIS && !isScrolledRef.current) {
            setIsScrolled(true);
          } else if (currentScrollY < SCROLL_THRESHOLD - HYSTERESIS && isScrolledRef.current) {
            setIsScrolled(false);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Debounce adicional para evitar chamadas excessivas
    let timeoutId;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 16); // ~60fps
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [isInitialized]); // Removido isScrolled das dependências

  return (
    <motion.header
      className={`sticky ${currentTheme === 'light' ? 'fundo-base' : 'fundo-base-preto'} top-0 w-full border-3 border-solid border-theme z-[9999]`}
      style={{
        backgroundColor: currentTheme === 'light' ? '#FFFCF2' : '#252422',
        willChange: 'height, transform',
        position: 'sticky',
        top: 0,
        zIndex: 9999
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        height: isScrolled ? 'auto' : 'auto'
      }}
      transition={{ 
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] // Easing mais suave
      }}
    >
      <motion.div 
        className="w-full border-theme overflow-hidden"
        style={{
          minHeight: isScrolled ? '80px' : 'auto'
        }}
      >
        {/* Layout em grid 2x2 para alinhamento perfeito */}
        <div className="relative">
          <div className="grid grid-cols-12 h-full" style={{ 
            minHeight: isScrolled ? '80px' : '200px',
            gridTemplateRows: isScrolled ? '0px 1fr' : '2fr 1fr'
          }}>
            
            {/* Linha 1: Logo + Título */}
            <motion.div 
              className={`col-span-2 ${!isScrolled ? 'border-r-3 border-b-3' : ''} border-theme row-span-1 flex items-center justify-center ${!isScrolled ? 'py-8' : 'py-0'}`}
              animate={{ 
                height: isScrolled ? '0px' : 'auto',
                opacity: isScrolled ? 0 : 1
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1]
              }}
              style={{ overflow: 'hidden' }}
            >
              {showTitle && title && (
                <motion.div 
                  className="flex items-center justify-center w-full h-full"
                >
                  <motion.img
                    src={getLogoSrc()}
                    alt={pathname === '/' ? "Spray decoration" : "Distrito Hip Hop Logo"}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </motion.div>
              )}
            </motion.div>
            
            <motion.div 
              className={`col-span-10 ${!isScrolled ? 'border-b-3' : ''} border-theme row-span-1 flex items-center justify-center ${!isScrolled ? 'py-8' : 'py-0'}`}
              animate={{ 
                height: isScrolled ? '0px' : 'auto',
                opacity: isScrolled ? 0 : 1
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1]
              }}
              style={{ overflow: 'hidden' }}
            >
              {showTitle && title && (
                <motion.div
                  className="flex items-center justify-center w-full h-full"
                >
                  <motion.h1
                    className="font-dirty-stains text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-shadow-lg text-theme-primary text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      letterSpacing: '0.02em',
                      lineHeight: shouldUseTwoLines() ? '0.8' : '1.2',
                      textTransform: 'uppercase',
                      display: shouldUseTwoLines() ? 'flex' : 'block',
                      flexDirection: shouldUseTwoLines() ? 'column' : 'row',
                      alignItems: shouldUseTwoLines() ? 'center' : 'center'
                    }}
                  >
                    {shouldUseTwoLines() ? (
                      <>
                        <span style={{ letterSpacing: '0.05em', width: '100%', textAlign: 'center' }}>DISTRITO</span>
                        <span style={{ letterSpacing: '0.18em', width: '100%', textAlign: 'center' }}>HIPHOP</span>
                      </>
                    ) : (
                      getPageTitle()
                    )}
                  </motion.h1>
                </motion.div>
              )}
            </motion.div>

            {/* Linha 2: Spinning Text + Navegação */}
            <div className={`col-span-2 border-r-3 border-theme row-span-1 flex items-center justify-center ${isScrolled ? 'py-4' : 'py-2'}`}>
              <Link href="/">
                <motion.div
                  animate={{
                    scale: isScrolled ? 0.8 : 1
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                  className="flex items-center justify-center"
                >
                  <SpinningText
                    radius={isScrolled ? 6.5 : 6}
                    className={`${isScrolled ? 'h-14 w-14 text-base' : 'h-16 w-16 text-xs sm:text-sm md:text-base'} tracking-[0.2em] font-scratchy transition-all duration-500`}
                  >
                    acervo • hip-hop • DF •
                  </SpinningText>
                </motion.div>
              </Link>
            </div>
            
            <div className={`col-span-10 row-span-1 flex items-center justify-center ${isScrolled ? 'py-4' : 'py-2'}`}>
              <motion.nav 
                className={`flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full px-2 ${isScrolled ? 'py-2' : 'py-4'}`}
              >
                <Link href="/">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl md:text-2xl lg:text-3xl"} 
                    text="INÍCIO" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-azul" 
                  />
                </Link>
                <Link href="/acervo">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-lg sm:text-xl md:text-2xl" : "text-lg sm:text-2xl md:text-2xl lg:text-3xl"} 
                    text="ACERVO" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-verde" 
                  />
                </Link>
                <Link href="/mapa">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-lg sm:text-xl md:text-2xl" : "text-lg sm:text-2xl md:text-2xl lg:text-3xl"} 
                    text="MAPA" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-amarelo" 
                  />
                </Link>
                <Link href="/revista">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-lg sm:text-xl md:text-2xl" : "text-lg sm:text-2xl md:text-2xl lg:text-3xl"} 
                    text="REVISTA" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-vermelho" 
                  />
                </Link>
              </motion.nav>
            </div>
          </div>
          
          {/* Toggle de tema fixo no canto superior direito */}
          <div className="absolute top-2 right-2">
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </motion.header>
  );
}
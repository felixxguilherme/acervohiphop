"use client";

import AnimatedButton from "../AnimatedButton";
import Link from "next/link";
import { motion } from "motion/react";
import { SpinningText } from "../magicui/spinning-text";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState, useRef } from "react";
import ThemeToggle from "../ThemeToggle";

export default function HeaderApp({ title, showTitle = false }) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const isScrolledRef = useRef(false);

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

  // Sincronizar ref com estado
  useEffect(() => {
    isScrolledRef.current = isScrolled;
  }, [isScrolled]);
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
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1] // Easing mais suave
      }}
    >
      <motion.div 
        className="w-full border-theme overflow-hidden"
        style={{
          minHeight: isScrolled ? '60px' : 'auto'
        }}
      >
        {/* Layout único que transiciona suavemente */}
        <div className="relative">
          <div className="grid grid-cols-12 h-full">
            {/* Primeira coluna: Transições suaves entre estados */}
            <div className="col-span-2 border-r-3 border-theme flex flex-col">
              {/* Container da imagem - apenas visível quando expandido */}
              <motion.div 
                className="flex items-center justify-center border-b-3 border-theme pt-6"
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
                  <motion.img
                    src="/spray_preto-2.png"
                    alt="Spray decoration"
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                )}
              </motion.div>
              
              {/* Spinning text - sempre presente */}
              <div className="flex items-center justify-center flex-1">
                <Link href="/">
                  <motion.div
                    animate={{
                      scale: isScrolled ? 0.6 : 1
                    }}
                    transition={{ 
                      duration: 0.5,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                  >
                    <SpinningText
                      radius={isScrolled ? 4 : 6}
                      className={`${isScrolled ? 'h-8 w-8 text-xs' : 'h-16 w-16 text-xs sm:text-sm md:text-base'} tracking-[0.2em] font-scratchy transition-all duration-500`}
                    >
                      {isScrolled ? 'acervo • hip-hop •' : 'acervo • hip-hop • DF •'}
                    </SpinningText>
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Segunda coluna: Conteúdo que transiciona */}
            <div className="col-span-10 flex flex-col items-center justify-center">
              {/* Título - apenas visível quando expandido */}
              <motion.div
                animate={{ 
                  height: isScrolled ? '0px' : 'auto',
                  opacity: isScrolled ? 0 : 1,
                  marginBottom: isScrolled ? '0px' : '24px'
                }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1]
                }}
                style={{ overflow: 'hidden' }}
              >
                {showTitle && title && (
                  <motion.h1
                    className="font-dirty-stains pt-6 px-2 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-shadow-lg text-theme-primary text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      letterSpacing: '0.02em',
                      lineHeight: '0.9',
                      textTransform: 'uppercase',
                    }}
                  >
                    {title}
                  </motion.h1>
                )}
              </motion.div>
              
              {/* Navegação - adapta tamanho baseado no estado */}
              <motion.nav 
                className={`flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 w-full px-2 ${!isScrolled ? 'border-black border-t-3 pt-4 pb-6' : 'py-3'}`}
              >
                <Link href="/">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-sm" : "text-lg sm:text-xl md:text-2xl lg:text-3xl"} 
                    text="HOME" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-amarelo" 
                  />
                </Link>
                <Link href="/acervo">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-sm" : "text-lg sm:text-xl md:text-2xl lg:text-3xl"} 
                    text="ACERVO" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-vermelho" 
                  />
                </Link>
                <Link href="/mapa">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-sm" : "text-lg sm:text-xl md:text-2xl lg:text-3xl"} 
                    text="MAPA" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-azul" 
                  />
                </Link>
                <Link href="/revista">
                  <AnimatedButton 
                    textSize={isScrolled ? "text-sm" : "text-lg sm:text-xl md:text-2xl lg:text-3xl"} 
                    text="REVISTA" 
                    backgroundMode="static" 
                    backgroundClass="marca-texto-verde" 
                  />
                </Link>
              </motion.nav>
            </div>
          </div>
          
          {/* Toggle de tema fixo no canto superior direito */}
          {/* <div className="absolute top-2 right-2">
            <ThemeToggle />
          </div> */}
        </div>
      </motion.div>
    </motion.header>
  );
}
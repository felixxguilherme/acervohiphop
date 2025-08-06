import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PolaroidCard from '@/components/PolaroidPhoto';

const StackedPagesScroll = ({ startOffset = 0 }) => {
  const [scrollY, setScrollY] = useState(0);
  const [componentStartY, setComponentStartY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { scrollYProgress } = useScroll();
  const containerRef = useRef(null);
  
  // AIDEV-NOTE: Dados das páginas do stack com conteúdo sobre Hip Hop do DF
  const pagesData = [
    {
      title: "ORIGENS DO HIP HOP NO DF",
      subtitle: "Década de 1980 - Primeiros Movimentos",
      content: "O Hip Hop chegou ao Distrito Federal nos anos 80, trazido por jovens das periferias que se identificaram com a cultura urbana americana. Ceilândia se tornou o berço do movimento.",
      imageSrc: "https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2013/04/09/359432/20130409170517234307i.jpg",
      tapePosition: "top-left",
      tapeAngle: -15,
      bgColor: ""
    },
    {
      title: "BREAKING E DANÇA",
      subtitle: "A Arte do Movimento",
      content: "Os breakers pioneiros do DF criaram crews que marcaram época. O breaking se espalhou pelas quadras, praças e espaços públicos, criando uma identidade própria da dança brasiliense.",
      imageSrc: "https://images.unsplash.com/photo-1523895834873-529ef3a565a0?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tapePosition: "top-right",
      tapeAngle: 20,
      bgColor: "bg-white/80"
    },
    {
      title: "GRAFITE NAS RUAS",
      subtitle: "Arte Visual Urbana",
      content: "O grafite transformou muros e viadutos do DF em galerias a céu aberto. Artistas locais desenvolveram estilos únicos, retratando a realidade social e cultural da cidade.",
      imageSrc: "https://images.unsplash.com/photo-1487452066049-a710f7296400?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tapePosition: "bottom-left",
      tapeAngle: -10,
      bgColor: "bg-white/80"
    },
    {
      title: "RAP E PROTESTO",
      subtitle: "A Voz das Periferias",
      content: "O rap do DF nasceu como forma de protesto e denúncia social. MCs locais retrataram a realidade das cidades satélites, criando um som autêntico e politizado.",
      imageSrc: "https://images.unsplash.com/photo-1512830414785-9928e23475dc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tapePosition: "top-left",
      tapeAngle: 15,
      bgColor: "bg-white/80"
    },
    {
      title: "DJ'S E A CULTURA",
      subtitle: "Os Mestres dos Toca-Discos",
      content: "DJs pioneiros foram fundamentais para difundir o Hip Hop no DF, organizando festas em quadras e criando a trilha sonora da juventude periférica brasiliense.",
      imageSrc: "https://plus.unsplash.com/premium_photo-1708194039348-364b423598a5?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tapePosition: "bottom-right",
      tapeAngle: -20,
      bgColor: "bg-white/80"
    },
    {
      title: "TERRITÓRIO E IDENTIDADE",
      subtitle: "Mapeando a Cultura",
      content: "Cada região do DF desenvolveu características únicas do Hip Hop. Ceilândia, Samambaia, Santa Maria e outras cidades criaram suas próprias cenas e identidades culturais.",
      imageSrc: "https://www.jornaldorap.com.br/wp-content/uploads/2025/03/Casa-hip-hop-de-Ceilandia-DJ-Jamaika-960x605.jpg",
      tapePosition: "top-right",
      tapeAngle: 10,
      bgColor: "bg-white/80"
    }
  ];

  useEffect(() => {
    // Verificar se estamos no cliente (browser)
    if (typeof window === 'undefined') return;

    setIsClient(true);
    const updateScrollY = () => setScrollY(window.scrollY);
    const updateWindowHeight = () => setWindowHeight(window.innerHeight);
    
    // Calcular a posição onde o componente inicia - quando o bottom da seção anterior chega no bottom da viewport
    const calculateStartPosition = () => {
      const previousSection = document.getElementById('preservando-cultura-section');
      if (previousSection && window) {
        const rect = previousSection.getBoundingClientRect();
        const currentScrollY = window.scrollY;
        
        // Calcular a posição absoluta do final da seção anterior
        const sectionBottom = currentScrollY + rect.bottom;
        
        // O trigger deve acontecer quando o final da seção anterior estiver visível
        // Começar apenas quando a seção anterior sair completamente da viewport
        
        const triggerPoint = sectionBottom;
        
        setComponentStartY(triggerPoint);
      }
    };
    
    // Inicializar valores
    updateWindowHeight();
    
    // Calcular posição inicial e adicionar listeners
    // Usar timeout para garantir que o DOM esteja totalmente carregado
    setTimeout(calculateStartPosition, 100);
    window.addEventListener('scroll', updateScrollY);
    window.addEventListener('resize', () => {
      updateWindowHeight();
      calculateStartPosition();
    });
    
    return () => {
      window.removeEventListener('scroll', updateScrollY);
      window.removeEventListener('resize', () => {
        updateWindowHeight();
        calculateStartPosition();
      });
    };
  }, []);

  // Não renderizar no servidor ou se windowHeight não foi definido
  if (!isClient || windowHeight === 0) {
    return (
      <div ref={containerRef} className="relative">
        <div style={{ height: `${pagesData.length * 100}vh` }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Espaço para permitir scroll - otimizado para evitar seção em branco */}
      <div style={{ height: `${pagesData.length * 60}vh` }} />
      
      {/* Container fixo para as páginas empilhadas */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-30">
        {pagesData.map((page, index) => {
          // Calcular quando cada página deve aparecer baseado no scroll, começando após o componentStartY
          const startScroll = componentStartY + (index * windowHeight * 0.6);
          const progress = Math.max(0, Math.min(1, (scrollY - startScroll) / (windowHeight * 0.6)));
          
          // Diferentes rotações para cada página
          const rotations = [-2, 1, -1, 2, -3, 1, -1, 2];
          const rotation = rotations[index % rotations.length];
          
          // Posicionamento Y normalizado para todos os cards
          // Começar fora da viewport e subir gradualmente
          const baseY = windowHeight * 0.1; // Posição central normalizada
          const y = baseY - (progress * baseY * 0.5);
          
          // Calcular progresso geral do stack - ajustado para o novo tamanho
          const stackTotalHeight = pagesData.length * windowHeight * 0.6;
          const stackProgress = Math.max(0, Math.min(1, (scrollY - componentStartY) / stackTotalHeight));
          
          // Manter stack visível - sem fade out
          let stackOpacity = 1;
          
          // Só mostrar páginas quando estiver na seção do stack e com progress mínimo
          const isInStackSection = scrollY >= componentStartY;
          const shouldShow = isInStackSection && progress > 0.1;

          if (!shouldShow) return null;

          return (
            <motion.div
              key={index}
              className={`absolute w-[90vw] max-w-6xl h-[80vh] md:h-[70vh] shadow-2xl border-4 border-black ${page.bgColor} backdrop-blur-sm`}
              style={{
                transform: `translateY(${y}px) scale(${progress > 0.3 ? 1 : 0.8 + (progress * 0.4)}) rotate(${rotation}deg)`,
                opacity: (progress > 0.1 ? 1 : 0) * stackOpacity,
                zIndex: index + 1,
              }}
              initial={{ 
                y: windowHeight * 0.1,
                scale: 0.8,
                opacity: 0,
                rotate: rotation 
              }}
              animate={{
                y: y,
                scale: progress > 0.3 ? 1 : 0.8 + (progress * 0.4),
                opacity: (progress > 0.1 ? 1 : 0) * stackOpacity,
                rotate: rotation
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1
              }}
            >
              {/* Layout de duas colunas */}
              <div className="p-6 md:p-8 h-full flex flex-col md:flex-row gap-6">
                {/* Coluna da esquerda - Foto Polaroid */}
                <motion.div 
                  className="w-full md:w-1/2 flex items-center justify-center"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ 
                    opacity: progress > 0.3 ? 1 : 0,
                    x: progress > 0.3 ? 0 : -50
                  }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-full max-w-sm">
                    <PolaroidCard
                      imageSrc={page.imageSrc}
                      tape={{ position: page.tapePosition, angle: page.tapeAngle }}
                      caption={`${page.subtitle}`}
                    />
                  </div>
                </motion.div>

                {/* Coluna da direita - Conteúdo textual */}
                <motion.div 
                  className="w-full md:w-1/2 flex flex-col justify-center text-black p-4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ 
                    opacity: progress > 0.4 ? 1 : 0,
                    x: progress > 0.4 ? 0 : 50
                  }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.h2 
                    className="font-black text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > 0.4 ? 1 : 0,
                      y: progress > 0.4 ? 0 : 20
                    }}
                    transition={{ delay: 0.4 }}
                  >
                    {page.title}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg md:text-xl font-bold mb-6 opacity-80"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > 0.5 ? 0.8 : 0,
                      y: progress > 0.5 ? 0 : 20
                    }}
                    transition={{ delay: 0.5 }}
                  >
                    {page.subtitle}
                  </motion.p>
                  
                  <motion.p 
                    className="text-base md:text-lg leading-relaxed font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > 0.6 ? 1 : 0,
                      y: progress > 0.6 ? 0 : 20
                    }}
                    transition={{ delay: 0.6 }}
                  >
                    {page.content}
                  </motion.p>

                  {/* Indicador de página estilo brutalista */}
                  <motion.div 
                    className="mt-6 flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: progress > 0.7 ? 1 : 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="bg-black text-white px-3 py-2 text-sm font-black border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {index + 1} / {pagesData.length}
                    </div>
                    <div className="bg-white border-2 border-black px-3 py-2 font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      HIP HOP DF
                    </div>
                  </motion.div>
                </motion.div>
              </div>              
            </motion.div>
          );
        })}
      </div>      
    </div>
  );
};

export default StackedPagesScroll;
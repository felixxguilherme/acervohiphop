// import React, { useEffect, useState, useRef } from 'react';
// import { motion, useScroll, useTransform } from 'motion/react';
// import PolaroidCard from '@/components/PolaroidPhoto';

// const StackedPagesScroll = ({ startOffset = 0 }) => {
//   const [scrollY, setScrollY] = useState(0);
//   const [componentStartY, setComponentStartY] = useState(0);
//   const [windowHeight, setWindowHeight] = useState(0);
//   const [isClient, setIsClient] = useState(false);
//   const { scrollYProgress } = useScroll();
//   const containerRef = useRef(null);
  
//   // GUI-NOTE: Dados das páginas do stack com conteúdo sobre Hip Hop do DF
//   const pagesData = [
//     {
//       title: "ORIGENS DO HIP HOP NO DF",
//       subtitle: "Década de 1980 - Primeiros Movimentos",
//       content: "O Hip Hop chegou ao Distrito Federal nos anos 80, trazido por jovens das periferias que se identificaram com a cultura urbana americana. Ceilândia se tornou o berço do movimento.",
//       imageSrc: "https://imgsapp2.correiobraziliense.com.br/app/noticia_127983242361/2013/04/09/359432/20130409170517234307i.webp",
//       tapePosition: "top-left",
//       tapeAngle: -15,
//       bgColor: ""
//     },
//     {
//       title: "BREAKING E DANÇA",
//       subtitle: "A Arte do Movimento",
//       content: "Os breakers pioneiros do DF criaram crews que marcaram época. O breaking se espalhou pelas quadras, praças e espaços públicos, criando uma identidade própria da dança brasiliense.",
//       imageSrc: "https://images.unsplash.com/photo-1523895834873-529ef3a565a0?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       tapePosition: "top-right",
//       tapeAngle: 20,
//       bgColor: "bg-white/80"
//     },
//     {
//       title: "GRAFITE NAS RUAS",
//       subtitle: "Arte Visual Urbana",
//       content: "O grafite transformou muros e viadutos do DF em galerias a céu aberto. Artistas locais desenvolveram estilos únicos, retratando a realidade social e cultural da cidade.",
//       imageSrc: "https://images.unsplash.com/photo-1487452066049-a710f7296400?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       tapePosition: "bottom-left",
//       tapeAngle: -10,
//       bgColor: "bg-white/80"
//     },
//     {
//       title: "RAP E PROTESTO",
//       subtitle: "A Voz das Periferias",
//       content: "O rap do DF nasceu como forma de protesto e denúncia social. MCs locais retrataram a realidade das cidades satélites, criando um som autêntico e politizado.",
//       imageSrc: "https://images.unsplash.com/photo-1512830414785-9928e23475dc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       tapePosition: "top-left",
//       tapeAngle: 15,
//       bgColor: "bg-white/80"
//     },
//     {
//       title: "DJ'S E A CULTURA",
//       subtitle: "Os Mestres dos Toca-Discos",
//       content: "DJs pioneiros foram fundamentais para difundir o Hip Hop no DF, organizando festas em quadras e criando a trilha sonora da juventude periférica brasiliense.",
//       imageSrc: "https://plus.unsplash.com/premium_photo-1708194039348-364b423598a5?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       tapePosition: "bottom-right",
//       tapeAngle: -20,
//       bgColor: "bg-white/80"
//     },
//     {
//       title: "TERRITÓRIO E IDENTIDADE",
//       subtitle: "Mapeando a Cultura",
//       content: "Cada região do DF desenvolveu características únicas do Hip Hop. Ceilândia, Samambaia, Santa Maria e outras cidades criaram suas próprias cenas e identidades culturais.",
//       imageSrc: "https://www.jornaldorap.com.br/wp-content/uploads/2025/03/Casa-hip-hop-de-Ceilandia-DJ-Jamaika-960x605.webp",
//       tapePosition: "top-right",
//       tapeAngle: 10,
//       bgColor: "bg-white/80"
//     }
//   ];

//   useEffect(() => {
//     // Verificar se estamos no cliente (browser)
//     if (typeof window === 'undefined') return;

//     setIsClient(true);
//     const updateScrollY = () => setScrollY(window.scrollY);
//     const updateWindowHeight = () => setWindowHeight(window.innerHeight);
    
//     // Calcular a posição onde o componente inicia
//     const calculateStartPosition = () => {
//       if (containerRef.current && window) {
//         const rect = containerRef.current.getBoundingClientRect();
//         const currentScrollY = window.scrollY;
        
//         // Calcular a posição absoluta do início da primeira página
//         const containerTop = currentScrollY + rect.top;
        
//         // Começar o stack após a primeira página (que tem min-h-screen)
//         const firstPageHeight = window.innerHeight;
//         setComponentStartY(containerTop + firstPageHeight);
//       }
//     };
    
//     // Inicializar valores
//     updateWindowHeight();
    
//     // Calcular posição inicial e adicionar listeners
//     // Usar timeout para garantir que o DOM esteja totalmente carregado
//     setTimeout(calculateStartPosition, 100);
//     window.addEventListener('scroll', updateScrollY);
//     window.addEventListener('resize', () => {
//       updateWindowHeight();
//       calculateStartPosition();
//     });
    
//     return () => {
//       window.removeEventListener('scroll', updateScrollY);
//       window.removeEventListener('resize', () => {
//         updateWindowHeight();
//         calculateStartPosition();
//       });
//     };
//   }, []);

//   return (
//     <div ref={containerRef} className="w-full">
//       {/* Primeira página sempre visível */}
//       <div className="relative w-full min-h-screen flex items-center justify-center py-16">
//         <motion.div
//           className={`w-[90vw] max-w-6xl h-[80vh] md:h-[70vh] shadow-2xl border-4 border-theme ${pagesData[0].bgColor || 'bg-white/90'} backdrop-blur-sm`}
//           style={{
//             transform: `rotate(-2deg)`,
//             zIndex: pagesData.length,
//           }}
//           initial={{ 
//             scale: 0.9,
//             opacity: 0,
//             rotate: -2
//           }}
//           animate={{
//             scale: 1,
//             opacity: 1,
//             rotate: -2
//           }}
//           transition={{
//             type: "spring",
//             stiffness: 80,
//             damping: 25,
//             mass: 1,
//             delay: 0.3
//           }}
//         >
//           {/* Layout da primeira página */}
//           <div className="p-6 md:p-8 h-full flex flex-col md:flex-row gap-6">
//             {/* Coluna da esquerda - Foto Polaroid */}
//             <motion.div 
//               className="w-full md:w-1/2 flex items-center justify-center"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <div className="w-full max-w-sm">
//                 <PolaroidCard
//                   imageSrc={pagesData[0].imageSrc}
//                   tape={{ position: pagesData[0].tapePosition, angle: pagesData[0].tapeAngle }}
//                   caption={`${pagesData[0].subtitle}`}
//                 />
//               </div>
//             </motion.div>

//             {/* Coluna da direita - Conteúdo textual */}
//             <motion.div 
//               className="w-full md:w-1/2 flex flex-col justify-center text-theme p-4"
//               initial={{ opacity: 0, x: 50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 0.8 }}
//             >
//               <motion.h2 
//                 className="font-black text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 1.0 }}
//               >
//                 {pagesData[0].title}
//               </motion.h2>
              
//               <motion.p 
//                 className="text-lg md:text-xl font-bold mb-6 opacity-80"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 0.8, y: 0 }}
//                 transition={{ delay: 1.2 }}
//               >
//                 {pagesData[0].subtitle}
//               </motion.p>
              
//               <motion.p 
//                 className="text-base md:text-lg leading-relaxed font-bold"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 1.4 }}
//               >
//                 {pagesData[0].content}
//               </motion.p>

//               {/* Indicador de página */}
//               <motion.div 
//                 className="mt-6 flex items-center justify-between"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.6 }}
//               >
//                 <div className="bg-black text-theme px-3 py-2 text-sm font-black border-2 border-theme shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                   1 / {pagesData.length}
//                 </div>
//                 <div className="bg-white border-2 border-theme px-3 py-2 font-black text-theme shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                   HIP HOP DF
//                 </div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Seção única com todas as páginas empilhadas */}
//       <div className="relative w-full" style={{ height: `${(pagesData.length - 1) * 100}vh` }}>
//         {/* Container sticky para todas as páginas */}
//         <div className="sticky top-16 w-full h-screen flex items-center justify-center overflow-hidden">
          
//           {/* Todas as páginas empilhadas na mesma posição */}
//           {pagesData.slice(1).map((page, idx) => {
//             const index = idx + 1;
            
//             // Calcular quando cada página deve aparecer baseado no scroll
//             const sectionStart = scrollY > (windowHeight || 800);
//             const pageStart = idx * (windowHeight || 800);
//             const progress = Math.max(0, Math.min(1, (scrollY - (windowHeight || 800) - pageStart) / (windowHeight || 800)));
            
//             // Só mostrar se há progresso ou se estamos fazendo scroll
//             const shouldShow = scrollY > (windowHeight || 800) + (idx * (windowHeight || 800) * 0.8);
            
//             if (!shouldShow) return null;
            
//             return (
//               <motion.div
//                 key={index}
//                 className={`absolute w-[90vw] max-w-6xl h-[80vh] md:h-[70vh] shadow-2xl border-4 border-theme ${page.bgColor || 'bg-white/90'} backdrop-blur-sm`}
//                 style={{
//                   transform: `translateY(${Math.max(0, (1 - progress) * 100)}px) rotate(${[1, -1, 2, -3, 1][idx % 5]}deg)`,
//                   zIndex: index + 1, // Z-index crescente para empilhamento
//                 }}
//                 initial={{ 
//                   y: 100,
//                   scale: 0.9,
//                   opacity: 0,
//                 }}
//                 animate={{
//                   y: Math.max(0, (1 - progress) * 100),
//                   scale: progress > 0.3 ? 1 : 0.9,
//                   opacity: progress > 0.1 ? 1 : 0,
//                 }}
//                 transition={{
//                   type: "spring",
//                   stiffness: 60,
//                   damping: 20,
//                   mass: 1
//                 }}
//               >
//                 {/* Layout de duas colunas */}
//                 <div className="p-6 md:p-8 h-full flex flex-col md:flex-row gap-6">
//                   {/* Coluna da esquerda - Foto Polaroid */}
//                   <div className="w-full md:w-1/2 flex items-center justify-center">
//                     <div className="w-full max-w-sm">
//                       <PolaroidCard
//                         imageSrc={page.imageSrc}
//                         tape={{ position: page.tapePosition, angle: page.tapeAngle }}
//                         caption={`${page.subtitle}`}
//                       />
//                     </div>
//                   </div>

//                   {/* Coluna da direita - Conteúdo textual */}
//                   <div className="w-full md:w-1/2 flex flex-col justify-center text-theme p-4">
//                     <h2 className="font-black text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight">
//                       {page.title}
//                     </h2>
                    
//                     <p className="text-lg md:text-xl font-bold mb-6 opacity-80">
//                       {page.subtitle}
//                     </p>
                    
//                     <p className="text-base md:text-lg leading-relaxed font-bold">
//                       {page.content}
//                     </p>

//                     {/* Indicador de página */}
//                     <div className="mt-6 flex items-center justify-between">
//                       <div className="bg-black text-theme px-3 py-2 text-sm font-black border-2 border-theme shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                         {index + 1} / {pagesData.length}
//                       </div>
//                       <div className="bg-white border-2 border-theme px-3 py-2 font-black text-theme shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                         HIP HOP DF
//                       </div>
//                     </div>
//                   </div>
//                 </div>              
//               </motion.div>
//             );
//           })}
          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StackedPagesScroll;

import React, { useState, useEffect, useRef } from 'react';

const StackedPagesScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const [lastPageComplete, setLastPageComplete] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const papers = [
    {
      id: 1,
      title: "Primeira Folha",
      content: "Esta é a primeira folha da pilha. Role para baixo para ver as outras folhas se empilharem sobre esta.",
      color: "bg-white",
      borderColor: "border-gray-300"
    },
    {
      id: 2,
      title: "Segunda Folha", 
      content: "A segunda folha começa a aparecer e cobrir a primeira conforme você rola a página para baixo.",
      color: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: 3,
      title: "Terceira Folha",
      content: "Esta folha continua o efeito de empilhamento, criando uma sensação de profundidade e movimento.",
      color: "bg-green-50", 
      borderColor: "border-green-200"
    },
    {
      id: 4,
      title: "Quarta Folha",
      content: "Cada folha tem uma rotação ligeiramente diferente para simular uma pilha real de documentos.",
      color: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      id: 5,
      title: "Quinta Folha",
      content: "A última folha da pilha completa o efeito visual desejado de empilhamento progressivo.",
      color: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  ];

  // GUI-NOTE: Altura calculada para que todas as folhas apareçam com a pilha totalmente visível
  // Cada folha precisa de espaço para aparecer + espaço extra para manter visibilidade total
  const scrollSpacePerPage = 200; // Mais espaço de scroll para movimento mais lento e fluido
  const totalScrollNeeded = (papers.length - 1) * scrollSpacePerPage;
  const lastPageCompleteAt = totalScrollNeeded * 0.85; // 85% do scroll para completar a última folha
  
  // GUI-NOTE: Detectar se a última folha está 100% visível
  const isLastPageComplete = scrollY >= lastPageCompleteAt;
  
  // GUI-NOTE: Altura da seção - só permite scroll além quando última folha estiver completa
  const minStackHeight = totalScrollNeeded + 50; // Altura mínima necessária
  const extraBuffer = isLastPageComplete ? 150 : 50; // Buffer menor para reduzir espaço em branco
  const stackHeight = minStackHeight + extraBuffer;
  
  // Atualizar estado da última folha
  useEffect(() => {
    setLastPageComplete(isLastPageComplete);
  }, [isLastPageComplete]);

  return (
    <div className="bg-gray-100">
      {/* Container principal com scroll */}
      <div className="relative pt-20" ref={containerRef}>
        {/* Container das folhas empilhadas - altura otimizada */}
        <div className="relative" style={{ height: `${stackHeight}px` }}>
          <div className="sticky top-24 flex justify-center">
            <div className="relative w-full max-w-2xl h-96">              
              {isLastPageComplete && (
                <div className="absolute -top-16 left-0 right-0 z-50 flex justify-center">
                  <div className="bg-green-500 text-theme px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    ✓ Continue rolando para ver mais conteúdo!
                  </div>
                </div>
              )}
              {papers.map((paper, index) => {
                // A primeira folha está sempre visível, as outras aparecem com scroll
                let progress, startOffset;
                
                if (index === 0) {
                  // Primeira folha sempre visível
                  progress = 1;
                } else {
                  // Folhas subsequentes aparecem com scroll distribuído uniformemente
                  // Cada folha começa a aparecer em intervalos regulares dentro do scroll total
                  const pageScrollStart = (index - 1) * scrollSpacePerPage;
                  const pageScrollDuration = scrollSpacePerPage * 1.2; // 120% do espaço para transição mais lenta
                  
                  progress = Math.max(0, Math.min(1, (scrollY - pageScrollStart) / pageScrollDuration));
                }
                
                // Rotações para dar efeito de pilha
                const rotations = [2, -1.5, 2.5, -2, 1.5];
                const rotation = rotations[index] || 0;
                
                // Posição Y baseada no progresso - movimento mais lento e suave
                const translateY = (1 - progress) * 150; // Movimento mais amplo e gradual
                
                // Opacidade e escala - transições mais suaves com curva ease-out
                const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Curva de ease-out para suavizar
                const opacity = Math.max(0, easeOutProgress * 1.0); // Fade in mais gradual
                const scale = 0.9 + (easeOutProgress * 0.1); // Escala mais pronunciada
                
                // Z-index para empilhamento correto - folhas mais recentes ficam por cima
                const zIndex = 10 + index;

                return (
                  <div
                    key={paper.id}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      transform: `translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      willChange: 'transform, opacity', // Otimização para performance
                    }}
                  >
                    <div className={`
                      ${paper.color} 
                      ${paper.borderColor} 
                      border-2 
                      rounded-lg 
                      shadow-2xl 
                      p-8 
                      mx-4 
                      h-full
                      overflow-hidden
                    `}>
                      <div className="h-full flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          {paper.title}
                        </h2>
                        
                        <div className="flex-1 space-y-4 text-gray-700">
                          <p className="text-lg leading-relaxed">
                            {paper.content}
                          </p>
                          
                          <div className="space-y-3 text-sm">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <p className="text-xs text-gray-500">
                            Folha {paper.id} de {papers.length} • Scroll: {Math.round(scrollY)}px • Progresso: {Math.round(progress * 100)}%
                          </p>
                          {index === papers.length - 1 && (
                            <div className="text-xs font-bold">
                              <p className={`${progress >= 1 ? 'text-green-600' : 'text-orange-600'}`}>
                                Última folha {progress >= 1 ? '✓ Completamente visível' : '⏳ Aparecendo'} ({Math.round(progress * 100)}%)
                              </p>
                              <p className={`${isLastPageComplete ? 'text-green-600' : 'text-blue-600'}`}>
                                Status: {isLastPageComplete ? '✓ Pode continuar rolando' : '⏳ Aguardando conclusão'}
                              </p>
                              <p className="text-gray-500">
                                Scroll: {Math.round(scrollY)}px / {Math.round(lastPageCompleteAt)}px necessários
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StackedPagesScroll;
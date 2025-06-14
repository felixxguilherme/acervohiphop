import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const StackedPagesScroll = () => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Cores de fundo para cada página
  const pageColors = [
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600'
  ];

  // Conteúdo das páginas
  const pageContent = [
    { title: "Primeira Página", subtitle: "Início da jornada", content: "Esta é a primeira página da nossa pilha. Role para baixo para ver o efeito." },
    { title: "Segunda Página", subtitle: "Desenvolvendo", content: "Agora você pode ver como as páginas se empilham uma sobre a outra." },
    { title: "Terceira Página", subtitle: "Progredindo", content: "Cada página tem uma rotação diferente para criar um efeito visual interessante." },
    { title: "Quarta Página", subtitle: "Avançando", content: "O background das páginas anteriores permanece visível através das bordas." },
    { title: "Quinta Página", subtitle: "Construindo", content: "Continue rolando para ver mais páginas se acumularem na pilha." },
    { title: "Sexta Página", subtitle: "Crescendo", content: "A animação é suave e responsiva ao scroll do usuário." },
    { title: "Sétima Página", subtitle: "Expandindo", content: "Cada página mantém sua posição relativa na pilha." },
    { title: "Página Final", subtitle: "Conclusão", content: "Chegamos ao final da nossa demonstração de páginas empilhadas!" }
  ];

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', updateScrollY);
    return () => window.removeEventListener('scroll', updateScrollY);
  }, []);

  return (
    <div className="relative">
      {/* Espaço para permitir scroll */}
      <div style={{ height: `${pageContent.length * 100}vh` }} />
      
      {/* Container fixo para as páginas empilhadas */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        {pageContent.map((page, index) => {
          // Calcular quando cada página deve aparecer baseado no scroll
          const startScroll = index * window.innerHeight;
          const progress = Math.max(0, Math.min(1, (scrollY - startScroll) / window.innerHeight));
          
          // Diferentes rotações para cada página
          const rotations = [-3, 2, -1, 4, -2, 1, -4, 3];
          const rotation = rotations[index % rotations.length];
          
          const y = Math.max(0, Math.min(window.innerHeight, window.innerHeight - (scrollY - startScroll)));

          return (
            <motion.div
              key={index}
              className={`absolute w-80 h-96 md:w-96 md:h-[500px] rounded-2xl shadow-2xl border-4 border-white/20 ${pageColors[index]} backdrop-blur-sm`}
              style={{
                transform: `translateY(${y}px) scale(${progress > 0.5 ? 1 : 0.8 + (progress * 0.4)}) rotate(${rotation}deg)`,
                opacity: 1,
                zIndex: index + 1,
              }}
              initial={{ 
                y: window.innerHeight,
                scale: 0.8,
                opacity: 0,
                rotate: rotation 
              }}
              animate={{
                y: progress > 0 ? 0 : window.innerHeight,
                scale: progress > 0.5 ? 1 : 0.8 + (progress * 0.4),
                opacity: 1,
                rotate: rotation
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1
              }}
            >
              {/* Conteúdo da página */}
              <div className="p-8 h-full flex flex-col justify-between text-white">
                <div>
                  <motion.h2 
                    className="text-2xl md:text-3xl font-bold mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > 0.3 ? 1 : 0,
                      y: progress > 0.3 ? 0 : 20
                    }}
                    transition={{ delay: 0.2 }}
                  >
                    {page.title}
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg md:text-xl opacity-90 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > 0.4 ? 0.9 : 0,
                      y: progress > 0.4 ? 0 : 20
                    }}
                    transition={{ delay: 0.3 }}
                  >
                    {page.subtitle}
                  </motion.p>
                  
                  <motion.p 
                    className="text-base opacity-80 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: progress > 0.5 ? 0.8 : 0,
                      y: progress > 0.5 ? 0 : 20
                    }}
                    transition={{ delay: 0.4 }}
                  >
                    {page.content}
                  </motion.p>
                </div>
                
                {/* Indicador de página */}
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: progress > 0.6 ? 1 : 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-sm opacity-70">
                    Página {index + 1} de {pageContent.length}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                </motion.div>
              </div>
              
              {/* Efeito de brilho */}
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 0.7 ? 0.3 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          );
        })}
      </div>
      
      {/* Indicador de scroll */}
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-2/4 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </div>
      </motion.div>
      
      {/* Barra de progresso */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
};

export default StackedPagesScroll;
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const PageTransition = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [page, setPage] = useState(pathname);

  // Atualize o estado quando o pathname mudar
  useEffect(() => {
    setPage(pathname);
  }, [pathname]);

  // Variantes para a transição da página
  const pageVariants = {
    hidden: {
      y: '100%',
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      y: '-100%',
      opacity: 0,
      transition: {
        ease: 'easeInOut',
        duration: 0.5
      }
    }
  };

  // Função para navegar com animação
  const handleNavigate = (href) => {
    setIsTransitioning(true);
    // Inicia a navegação após um pequeno delay para permitir a animação de saída
    setTimeout(() => {
      router.push(href);
      // Reset o estado de transição depois que a navegação for concluída
      setTimeout(() => setIsTransitioning(false), 500);
    }, 300);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={page}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Exportamos o componente de transição e a função de navegação
export { PageTransition };

// Hook personalizado para usar a navegação com animação
export function useAnimatedNavigation() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateWithAnimation = (href) => {
    setIsTransitioning(true);
    
    // Inicia a navegação após um pequeno delay para permitir a animação de saída
    setTimeout(() => {
      router.push(href);
      // Reset o estado de transição depois que a navegação for concluída
      setTimeout(() => setIsTransitioning(false), 500);
    }, 300);
  };

  return { navigateWithAnimation, isTransitioning };
}
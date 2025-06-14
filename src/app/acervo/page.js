"use client";
import React from 'react';
import { motion } from 'motion/react';

import StackedPagesScroll from '@/components/ui/stack';

const Acervo = () => {
  return (
    <motion.div
      initial={{ y: '100vh' }}
      animate={{ y: 0 }}
      exit={{ y: '100vh' }}
      transition={{
        type: 'tween',
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="inset-0 w-full h-full z-40 overflow-y-auto"
    >
      {/* Conteúdo da página Acervo */}
      <div className="min-h-screen p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-bold text-white mb-8 text-center"
          >
            Acervo
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
             <StackedPagesScroll />
            
          </motion.div>
          <StackedPagesScroll />
        </div>
      </div>
    </motion.div>
  );
};

export default Acervo;
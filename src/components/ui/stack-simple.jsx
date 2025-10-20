"use client";

import React from 'react';
import { motion } from 'motion/react';

const StackedPagesScrollSimple = () => {
  return (
    <div className="relative py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h2 className="font-dirty-stains text-4xl md:text-6xl text-black mb-4">
          HISTÓRIA DO HIP HOP DF
        </h2>
        <p className="font-sometype-mono text-lg text-black/80">
          Uma jornada através de 40 anos de cultura urbana no Distrito Federal
        </p>
      </motion.div>
      
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/90 border-4 border-black p-8 shadow-lg"
        >
          <h3 className="font-dirty-stains text-2xl mb-4 text-black">
            ORIGENS DO HIP HOP NO DF
          </h3>
          <p className="font-sometype-mono text-black mb-4">
            O Hip Hop chegou ao Distrito Federal nos anos 80, trazido por jovens das periferias 
            que se identificaram com a cultura urbana americana. Ceilândia se tornou o berço do movimento.
          </p>
          <div className="bg-[#fae523] text-black px-4 py-2 inline-block border-2 border-black font-bold">
            Década de 1980
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StackedPagesScrollSimple;
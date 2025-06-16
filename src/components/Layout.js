"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { SpinningText } from '@/components/magicui/spinning-text';
import AnimatedButton from '@/components/AnimatedButton';
import { usePathname } from 'next/navigation';

// Componente da página inicial
const HomePage = () => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }} 
    className="pt-20 min-h-screen flex items-center justify-center"
  >
    <div className="container mx-auto px-4 py-16">
      <div className="text-center text-white">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Hip-Hop DF
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Explore a cultura hip-hop do Distrito Federal através do nosso acervo digital
        </motion.p>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link href="/acervo" className="group">
            <motion.div 
              className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 text-center hover:bg-red-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold mb-3 text-red-400">ACERVO</h3>
              <p className="text-sm text-gray-300">Documentos, fotos e memórias da cultura hip-hop</p>
            </motion.div>
          </Link>
          
          <Link href="/audiovisual" className="group">
            <motion.div 
              className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 text-center hover:bg-green-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold mb-3 text-green-400">AUDIOVISUAL</h3>
              <p className="text-sm text-gray-300">Vídeos, músicas e produções audiovisuais</p>
            </motion.div>
          </Link>
          
          <Link href="/mapa" className="group">
            <motion.div 
              className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-center hover:bg-blue-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold mb-3 text-blue-400">MAPA</h3>
              <p className="text-sm text-gray-300">Locais e pontos importantes da cena</p>
            </motion.div>
          </Link>
          
          <Link href="/revista" className="group">
            <motion.div 
              className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center hover:bg-purple-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-bold mb-3 text-purple-400">REVISTA</h3>
              <p className="text-sm text-gray-300">Publicações e conteúdo editorial</p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

export default HomePage;
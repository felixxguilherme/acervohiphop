/**
 * Overview de Estatísticas - Contador Animado
 * Mostra estatísticas do acervo com animações
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useAtomStatistics } from '../../hooks/useAtom.js';
import { NumberTicker } from '../magicui/number-ticker.jsx';

import Image from 'next/image';

function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsOverview() {
  const { statistics, loading } = useAtomStatistics();

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-6 mx-6 mb-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) return null;

  const stats = [
    {
      value: statistics.overview.totalItems,
      label: 'Itens no Acervo',
      icon: '📚',
      color: 'from-blue-400 to-blue-600',
      description: 'Documentos catalogados'
    },
    {
      value: statistics.overview.totalDigitalObjects,
      label: 'Objetos Digitais',
      icon: '💾',
      color: 'from-green-400 to-green-600',
      description: 'Arquivos digitalizados'
    },
    {
      value: statistics.overview.totalFileSize.replace(' GB', ''),
      label: 'Tamanho Total',
      suffix: ' GB',
      icon: '💿',
      color: 'from-purple-400 to-purple-600',
      description: 'Espaço ocupado'
    },
    {
      value: new Date().getFullYear() - 1980,
      label: 'Anos de História',
      icon: '📅',
      color: 'from-orange-400 to-orange-600',
      description: 'Desde os anos 80'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-8 p-8 mx-6 mb-8 transition-all duration-200"
    >
      <div className="flex items-start px-4 absolute top-[-50px] left-[-50px]">
                    <Image src="cursor02.png" alt="Marca de spray com escorrimento" width={150} height={180} />
                  </div>
      <div className="text-center mb-8">
        <h2 className="font-dirty-stains text-3xl font-black text-black mb-4 bg-[#df8d6d] inline-block px-6 py-3 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ACERVO HIP HOP DF
        </h2>
        <p className="font-scratchy text-black font-bold text-2xl p-3 mt-8">
          PRESERVANDO A MEMÓRIA DA CULTURA HIP HOP NO DF
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            className="group relative"
          >
            {/* Container brutalista */}
            <div className="border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-[#df8d6d]">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                className="text-5xl mb-4 text-center"
              >
                {stat.icon}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-4xl font-black text-black mb-2 text-center"
              >
                <NumberTicker value={stat.value} className="font-black font-scratchy" />
              </motion.div>
              
              <div className="text-black font-black font-scratchy text-sm mb-2 text-center uppercase tracking-wide">
                {stat.label}
              </div>
              
              <div className="text-black font-bold text-xs text-center bg-[#df8d6d] p-2 border-2 border-black">
                {stat.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

import HeaderApp from '@/components/html/HeaderApp';
import { TimelineDemo } from '@/components/acervo/Timeline';

// Componentes AtoM 2.9
import ModernAcervoInterface from '@/components/acervo/ModernAcervoInterface';

const Acervo2 = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estratégia de carregamento otimizado
    if (typeof window !== 'undefined') {
      // Simular carregamento rápido
      setTimeout(() => setIsLoading(false), 800);
    }
  }, []);

  return (
    <>
      {/* Tela de carregamento - mesma da homepage */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-16 bg-white rounded-sm"
                initial={{ height: 8 }}
                animate={{
                  height: [8, 40, 8],
                  backgroundColor: ["#ffffff", "#f8e71c", "#ffffff"]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo da página */}
      <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <HeaderApp title="ACERVO DIGITAL 2.9" showTitle={true} />

        {/* Page Content with Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full overflow-hidden"
          >
            {/* Interface Header */}
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="bg-white border-[3px] border-black p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold font-sometype-mono text-black uppercase mb-2">
                      ⚡ ACERVO DIGITAL - VERSÃO ATOM 2.9
                    </h2>
                    <p className="text-black text-sm font-sometype-mono">
                      Nova interface com busca avançada, filtros de taxonomia e compatibilidade total com AtoM 2.9
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-black text-white px-4 py-2 font-bold font-sometype-mono text-sm">
                      NOVA VERSÃO
                    </div>
                    <div className="text-xs text-black font-sometype-mono mt-1">
                      <Link href="/acervo" className="hover:underline">
                        ← Voltar à versão anterior
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interface Principal */}
            <div className="max-w-7xl mx-auto px-6">
              <ModernAcervoInterface />
            </div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-white border-[3px] border-black mt-16 py-8"
            >
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-black font-sometype-mono uppercase mb-2">
                    🎤 ACERVO HIP HOP DISTRITO FEDERAL
                  </h3>
                  <p className="text-black max-w-2xl mx-auto leading-relaxed font-sometype-mono text-sm">
                    PRESERVANDO E COMPARTILHANDO A RICA HISTÓRIA DA CULTURA HIP HOP NO DISTRITO FEDERAL,
                    DESDE OS PRIMEIROS MOVIMENTOS NOS ANOS 90 ATÉ OS DIAS ATUAIS.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center border-[3px] border-black p-4">
                    <div className="text-3xl mb-2">📚</div>
                    <h4 className="font-bold text-black mb-1 font-sometype-mono uppercase">DOCUMENTAÇÃO</h4>
                    <p className="text-black text-xs font-sometype-mono">
                      FOTOGRAFIAS, DOCUMENTOS E REGISTROS HISTÓRICOS
                    </p>
                  </div>
                  <div className="text-center border-[3px] border-black p-4">
                    <div className="text-3xl mb-2">🗺️</div>
                    <h4 className="font-bold text-black mb-1 font-sometype-mono uppercase">TERRITÓRIOS</h4>
                    <p className="text-black text-xs font-sometype-mono">
                      MAPEAMENTO DA CULTURA HIP HOP EM TODAS AS REGIÕES DO DF
                    </p>
                  </div>
                  <div className="text-center border-[3px] border-black p-4">
                    <div className="text-3xl mb-2">👥</div>
                    <h4 className="font-bold text-black mb-1 font-sometype-mono uppercase">COMUNIDADE</h4>
                    <p className="text-black text-xs font-sometype-mono">
                      PRESERVANDO MEMÓRIAS DE ARTISTAS, CREWS E COLETIVOS
                    </p>
                  </div>
                </div>

                <div className="text-black text-xs font-sometype-mono border-t-[3px] border-black pt-4">
                  <p className="uppercase">
                    PROJETO DESENVOLVIDO COM TECNOLOGIA ATOM 2.9
                  </p>
                  <p className="mt-2 uppercase">
                    © 2025 ACERVO HIP HOP DF • PRESERVANDO NOSSA CULTURA
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <TimelineDemo />
    </>
  );
};

export default Acervo2;
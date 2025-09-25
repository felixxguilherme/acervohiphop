"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';

import AnimatedButton from '@/components/AnimatedButton';
import HeaderApp from '@/components/html/HeaderApp';

import { TimelineDemo } from '@/components/acervo/Timeline';
import SearchComponent from '@/components/acervo/SearchComponent';
import AdvancedAcervoInterface from '@/components/acervo/AdvancedAcervoInterface';
import AcervoNavigator from '@/components/acervo/AcervoNavigator';
import CollectionGrid from '@/components/acervo/CollectionGrid';
import CollectionDetail from '@/components/acervo/CollectionDetail';
import CollectionsTest from '@/components/acervo/CollectionsTest';

// Componentes do Acervo
import HeroTimeline from '@/components/acervo/HeroTimeline';
import FilterBar from '@/components/acervo/FilterBar';
import StatsOverview from '@/components/acervo/StatsOverview';
import ItemsGrid from '@/components/acervo/ItemsGrid';

const Acervo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(true);
  const [viewMode, setViewMode] = useState('collections'); // 'collections' or 'detail'
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    // Estratégia de carregamento otimizado - mesma da homepage
    if (typeof window !== 'undefined') {
      // Pré-armazenar a imagem em cache
      const bgImage = new window.Image();
      bgImage.src = '/fundo_base.jpg';

      // Adicionar preload no head se não existir
      let link = document.querySelector('link[href="/fundo_base.jpg"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = '/fundo_base.jpg';
        link.type = 'image/jpeg';
        link.fetchpriority = 'high';
        document.head.appendChild(link);
      }

      // Mostrar página quando imagem estiver carregada
      if (bgImage.complete) {
        setIsLoading(false);
      } else {
        bgImage.onload = () => setIsLoading(false);
        bgImage.onerror = () => setIsLoading(false);
        setTimeout(() => setIsLoading(false), 2000);
      }
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
        <HeaderApp title="ACERVO DIGITAL" showTitle={true} />

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
            {/* Interface Toggle */}
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="bg-black/40 backdrop-blur-sm border border-yellow-400/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-scratchy text-yellow-400 mb-2">
                      Escolha a Interface do Acervo
                    </h2>
                    <p className="text-yellow-100/70 text-sm">
                      {useAdvancedInterface 
                        ? '🚀 Interface avançada com busca por título, expressões, filtros por data e taxonomias' 
                        : '📚 Interface de coleções - navegação estruturada e escalável'
                      }
                    </p>
                  </div>
                  <div className="flex bg-black/50 border border-yellow-400/30 rounded overflow-hidden">
                    <button
                      onClick={() => setUseAdvancedInterface(false)}
                      className={`px-4 py-2 text-sm transition-colors ${
                        !useAdvancedInterface 
                          ? 'bg-yellow-400 text-black' 
                          : 'text-yellow-400 hover:bg-yellow-400/20'
                      }`}
                    >
                      📚 Coleções
                    </button>
                    <button
                      onClick={() => setUseAdvancedInterface(true)}
                      className={`px-4 py-2 text-sm transition-colors ${
                        useAdvancedInterface 
                          ? 'bg-yellow-400 text-black' 
                          : 'text-yellow-400 hover:bg-yellow-400/20'
                      }`}
                    >
                      🚀 Avançada
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {useAdvancedInterface ? (
              /* Interface Avançada */
              <div className="max-w-7xl mx-auto px-6">
                <AdvancedAcervoInterface />
              </div>
            ) : (
              /* Interface de Coleções - Estrutura escalável */
              <div>
                {/* TESTE TEMPORÁRIO */}
                <div className="max-w-7xl mx-auto px-6 mb-8">
                  <CollectionsTest />
                </div>
                
                {viewMode === 'collections' ? (
                  <CollectionGrid 
                    onSelectCollection={(collection) => {
                      setSelectedCollection(collection);
                      setViewMode('detail');
                    }}
                  />
                ) : (
                  <div>
                    {/* Back Button */}
                    <div className="max-w-7xl mx-auto px-4 mb-8">
                      <button
                        onClick={() => {
                          setViewMode('collections');
                          setSelectedCollection(null);
                        }}
                        className="bg-white border-2 border-black text-black font-sometype-mono font-bold text-sm py-3 px-6 transform hover:rotate-1 transition-all duration-200 uppercase"
                      >
                        ← Voltar às Coleções
                      </button>
                    </div>
                    <CollectionDetail 
                      collectionId={selectedCollection?.id} 
                      collectionName={selectedCollection?.name}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Footer do Acervo */}
            {/* <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="bg-black/60 backdrop-blur-md border-t border-white/20 mt-16 py-12"
            >
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    🎤 Acervo Hip Hop Distrito Federal
                  </h3>
                  <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
                    Preservando e compartilhando a rica história da cultura Hip Hop no Distrito Federal,
                    desde os primeiros movimentos nos anos 80 até os dias atuais.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <h4 className="font-semibold text-white mb-1">Documentação</h4>
                    <p className="text-white/60 text-sm">
                      Fotografias, vídeos, documentos e registros históricos
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🗺️</div>
                    <h4 className="font-semibold text-white mb-1">Territórios</h4>
                    <p className="text-white/60 text-sm">
                      Mapeamento da cultura Hip Hop em todas as regiões do DF
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">👥</div>
                    <h4 className="font-semibold text-white mb-1">Comunidade</h4>
                    <p className="text-white/60 text-sm">
                      Preservando memórias de artistas, crews e coletivos
                    </p>
                  </div>
                </div>

                <div className="text-white/40 text-sm">
                  <p>
                    Projeto desenvolvido em parceria com o Arquivo Público do Distrito Federal
                  </p>
                  <p className="mt-2">
                    © 2024 Acervo Hip Hop DF • Preservando nossa cultura
                  </p>
                </div>
              </div>
            </motion.footer> */}
          </motion.div>
        </AnimatePresence>
      </div>

      <TimelineDemo />
    </>
  );
};

export default Acervo;
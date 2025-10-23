/**
 * Card de Item do Acervo - Estilo Polaroid Hip Hop
 * Design inspirado em fotos polaroid com efeitos visuais modernos
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAtomFormatters } from '../../hooks/useAtom.js';

const MEDIA_TYPE_ICONS = {
  'image/jpeg': '📸',
  'video/mp4': '🎬',
  'audio/mp3': '🎵',
  'application/pdf': '📄',
  default: '📁'
};

const MEDIA_TYPE_COLORS = {
  'image/jpeg': 'from-green-500 to-emerald-600',
  'video/mp4': 'from-red-500 to-rose-600',
  'audio/mp3': 'from-purple-500 to-violet-600',
  'application/pdf': 'from-blue-500 to-indigo-600',
  default: 'from-gray-500 to-slate-600'
};

export default function ItemCard({ item, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { formatDate, formatFileSize, formatSubjects } = useAtomFormatters();

  const mainImage = item.digitalObjects?.[0];
  const mediaType = mainImage?.mediaType || 'default';
  const subjects = formatSubjects(item.subjects);

  // Rotação aleatória para efeito polaroid mais natural
  const randomRotation = (index % 3 - 1) * 3; // -3, 0, ou 3 graus

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: randomRotation }}
      animate={{ opacity: 1, y: 0, rotate: isHovered ? 0 : randomRotation }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        onClick={handleCardClick}
        className="relative w-full cursor-pointer transform-gpu"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Frente do Card - Estilo Brutalista */}
        <motion.div
          className="absolute inset-0 bg-white border-4 border-theme shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform-gpu"
          style={{ backfaceVisibility: 'hidden' }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '12px 12px 0px 0px rgba(0, 0, 0, 1)',
            rotate: 0
          }}
        >
          {/* Imagem principal */}
          <div className="relative h-64 bg-gray-100 overflow-hidden border-b-4 border-theme">
            {mainImage?.thumbnail ? (
              <img
                src={mainImage.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full ${MEDIA_TYPE_COLORS[mediaType]} flex items-center justify-center border-4 border-theme`}>
                <div className="text-6xl">
                  {MEDIA_TYPE_ICONS[mediaType]}
                </div>
              </div>
            )}

            {/* Badge do tipo de mídia - Brutalista */}
            <div className={`absolute top-3 right-3 ${MEDIA_TYPE_COLORS[mediaType]} border-2 border-theme px-3 py-1 text-theme text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              <span className="mr-1">{MEDIA_TYPE_ICONS[mediaType]}</span>
              {mediaType.split('/')[0].toUpperCase()}
            </div>

            {/* Indicador de múltiplos objetos - Brutalista */}
            {item.digitalObjects && item.digitalObjects.length > 1 && (
              <div className="absolute bottom-3 left-3 bg-yellow-400 border-2 border-theme px-3 py-1 text-theme text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                +{item.digitalObjects.length - 1} ARQUIVOS
              </div>
            )}

            {/* Overlay de hover - Brutalista */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className="bg-yellow-400 border-4 border-theme p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <svg className="w-8 h-8 text-theme" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Área do texto - Estilo Brutalista */}
          <div className="p-4 bg-white">
            <h3 className="font-black text-theme text-lg leading-tight mb-3 line-clamp-2">
              {item.title.toUpperCase()}
            </h3>
            
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-black text-theme px-2 py-1 text-xs font-black border border-theme">
                  {item.identifier}
                </span>
                <span className="font-black">•</span>
                <span className="font-bold">{formatDate(item.dates?.[0]?.startDate)}</span>
              </div>
            </div>

            {/* Tags de assuntos - Brutalista */}
            <div className="flex flex-wrap gap-2 mb-4">
              {subjects.slice(0, 3).map((subject, i) => (
                <span
                  key={i}
                  className="inline-block bg-yellow-400 text-theme text-xs px-2 py-1 border-2 border-theme font-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  {subject.toUpperCase()}
                </span>
              ))}
              {subjects.length > 3 && (
                <span className="inline-block bg-black text-theme text-xs px-2 py-1 border-2 border-theme font-black">
                  +{subjects.length - 3}
                </span>
              )}
            </div>

            {/* Info footer - Brutalista */}
            <div className="border-t-2 border-theme pt-2">
              <div className="flex justify-between items-center">
                <span className="font-black text-xs">
                  📍 {item.places?.[0]?.name || 'DF'}
                </span>
                {mainImage && (
                  <span className="bg-gray-200 border border-theme px-2 py-1 text-xs font-black">
                    {formatFileSize(mainImage.byteSize)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verso do Card - Detalhes Brutalista */}
        <motion.div
          className="absolute inset-0 bg-black border-4 border-theme p-6 text-theme transform-gpu shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h3 className="font-black text-theme text-xl mb-2 bg-yellow-400 text-theme px-3 py-2 border-2 border-theme shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">{item.title.toUpperCase()}</h3>
              <div className="bg-white text-theme text-sm font-black px-3 py-1 border-2 border-theme inline-block shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                {item.identifier}
              </div>
            </div>

            <div className="flex-1 space-y-4 text-sm">
              {/* Criadores */}
              {item.creators && item.creators.length > 0 && (
                <div className="bg-white/20 border-2 border-theme p-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <div className="text-yellow-400 font-black mb-1">👤 CRIADOR:</div>
                  <div className="text-theme font-bold">{item.creators[0].name}</div>
                </div>
              )}

              {/* Data */}
              <div className="bg-white/20 border-2 border-theme p-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <div className="text-yellow-400 font-black mb-1">📅 DATA:</div>
                <div className="text-theme font-bold">{formatDate(item.dates?.[0]?.startDate)}</div>
              </div>

              {/* Descrição */}
              <div className="bg-white/20 border-2 border-theme p-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <div className="text-yellow-400 font-black mb-1">📝 DESCRIÇÃO:</div>
                <div className="text-theme font-bold line-clamp-3 leading-tight">
                  {item.scopeAndContent}
                </div>
              </div>

              {/* Características físicas */}
              {item.physicalCharacteristics && (
                <div className="bg-white/20 border-2 border-theme p-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  <div className="text-yellow-400 font-black mb-1">⚙️ CARACTERÍSTICAS:</div>
                  <div className="text-theme font-bold text-xs line-clamp-2">
                    {item.physicalCharacteristics}
                  </div>
                </div>
              )}
            </div>

            {/* Footer com ação */}
            <div className="mt-4 pt-4 border-t-4 border-theme">
              <div className="flex justify-between items-center">
                <div className="text-xs text-theme/70 font-bold bg-white/10 px-2 py-1 border border-theme">
                  CLIQUE PARA VOLTAR
                </div>
                <button className="bg-yellow-400 text-theme px-4 py-2 font-black text-sm border-2 border-theme hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                  VER DETALHES →
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sombra dinâmica */}
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.3 : 0.1
        }}
        className="absolute inset-0 bg-black rounded-lg blur-xl -z-10 transform translate-y-4"
      />
    </motion.div>
  );
}

// Adicionar CSS personalizado para a fonte handwriting
const handwritingCSS = `
.font-handwriting {
  font-family: 'Caveat', 'Comic Sans MS', cursive;
}
`;

// Inject CSS if not already present
if (typeof document !== 'undefined' && !document.querySelector('#handwriting-font')) {
  const style = document.createElement('style');
  style.id = 'handwriting-font';
  style.textContent = handwritingCSS;
  document.head.appendChild(style);
}
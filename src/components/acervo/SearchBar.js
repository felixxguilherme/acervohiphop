'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

export default function SearchBar({ onSearch, loading = false }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.info('[SearchBar/handleSubmit] 🔍 Formulário enviado:', { searchTerm: searchTerm.trim() });
    if (searchTerm.trim()) {
      console.info('[SearchBar/handleSubmit] ✅ Chamando onSearch com:', searchTerm.trim());
      onSearch(searchTerm.trim());
    } else {
      console.warn('[SearchBar/handleSubmit] ⚠️ Termo de busca vazio');
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-3">
          {/* Input de busca */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no acervo... (ex: Dino Black, 1994, Candangolândia)"
              className="w-full px-6 py-4 text-lg font-sometype-mono 
                       bg-white/90 backdrop-blur-sm
                       border-3 border-black
                       focus:outline-none focus:ring-4 focus:ring-yellow-400/50
                       placeholder:text-gray-500
                       transition-all duration-200"
              disabled={loading}
            />
            
            {/* Botão de limpar */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Botão de buscar */}
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            onClick={(e) => {
              console.info('[SearchBar/onClick] 🖱️ Botão clicado:', { searchTerm, loading });
            }}
            className="px-8 py-4 
                     bg-yellow-400 hover:bg-yellow-300
                     border-3 border-black
                     font-scratchy text-xl text-black
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:scale-105 hover:rotate-1
                     active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg 
                  className="animate-spin h-5 w-5" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Buscando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                BUSCAR
              </span>
            )}
          </button>
        </div>

        {/* Dica de busca */}
        <p className="mt-2 text-sm text-white/70 font-sometype-mono">
          💡 Dica: A busca procura por títulos, descrições e localizações no acervo
        </p>
      </form>
    </motion.div>
  );
}

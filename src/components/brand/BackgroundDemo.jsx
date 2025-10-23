"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useThemeBackground } from "@/hooks/useBackgroundImage";
import { HipHopCard } from "./HipHopElements";

export default function BackgroundDemo() {
  const { theme, toggleTheme } = useTheme();
  const { backgroundClass, isLoaded, isLoading, hasError, currentImage } = useThemeBackground(theme);

  return (
    <div className="container-hip-hop py-8">
      <HipHopCard className="space-y-6">
        <h2 className="font-dirty-stains text-2xl mb-4">Sistema de Background Híbrido</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status do carregamento */}
          <div className="space-y-3">
            <h3 className="font-sometype-mono font-bold">Status do Background</h3>
            <div className="space-y-2 text-sm font-sometype-mono">
              <div className="flex justify-between">
                <span>Tema atual:</span>
                <span className="font-bold">{theme}</span>
              </div>
              <div className="flex justify-between">
                <span>Imagem:</span>
                <span className="text-xs">{currentImage}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-bold ${
                  isLoading ? 'text-hip-amarelo-escuro' :
                  isLoaded ? 'text-hip-verde-escuro' :
                  hasError ? 'text-hip-vermelho-escuro' :
                  'text-gray-500'
                }`}>
                  {isLoading ? 'Carregando...' :
                   isLoaded ? 'Carregada ✅' :
                   hasError ? 'Erro ❌' :
                   'Aguardando'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Classes CSS:</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {backgroundClass}
                </span>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="space-y-3">
            <h3 className="font-sometype-mono font-bold">Controles</h3>
            <button
              onClick={toggleTheme}
              className="w-full px-4 py-2 bg-hip-amarelo-escuro text-black border-2 border-black shadow-hip-hop hover:shadow-hip-hop-lg transition-all font-sometype-mono font-bold"
            >
              Alternar Tema ({theme === 'light' ? 'Escuro' : 'Claro'})
            </button>
            
            <div className="p-3 bg-gray-50 border-2 border-gray-300 rounded text-xs font-sometype-mono">
              <strong>Como funciona:</strong>
              <br />• Fallback: Cor sólida carrega primeiro
              <br />• Progressive: Imagem carrega depois
              <br />• Graceful: Funciona mesmo se imagem falhar
            </div>
          </div>
        </div>

        {/* Demonstração visual */}
        <div className="space-y-4">
          <h3 className="font-sometype-mono font-bold">Demonstração Visual</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Background atual */}
            <div className={`h-32 border-2 border-black ${backgroundClass} p-4 flex items-center justify-center`}>
              <span className="bg-white/90 px-3 py-1 text-black font-sometype-mono text-sm">
                Background Atual
              </span>
            </div>
            
            {/* Fallback colors */}
            <div className="space-y-2">
              <div className="h-14 bg-hip-fundo-claro border-2 border-black flex items-center justify-center">
                <span className="text-black font-sometype-mono text-sm">Fallback Claro</span>
              </div>
              <div className="h-14 bg-hip-fundo-escuro border-2 border-black flex items-center justify-center">
                <span className="text-white font-sometype-mono text-sm">Fallback Escuro</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="space-y-3">
          <h3 className="font-sometype-mono font-bold">Otimizações Implementadas</h3>
          <ul className="text-sm font-sometype-mono space-y-1 list-disc list-inside">
            <li>✅ Preload com fetchpriority="high" no HTML</li>
            <li>✅ Progressive enhancement (cor → imagem)</li>
            <li>✅ Graceful degradation (funciona sem imagem)</li>
            <li>✅ Loading states visuais</li>
            <li>✅ Error handling robusto</li>
            <li>✅ Mobile-optimized (background-attachment: local)</li>
            <li>✅ Performance monitoring (console logs)</li>
          </ul>
        </div>

        {/* Benefícios */}
        <div className="bg-hip-verde-claro/20 border-2 border-hip-verde-escuro p-4 space-y-2">
          <h4 className="font-sometype-mono font-bold text-hip-verde-escuro">
            ✅ Benefícios da Implementação
          </h4>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li><strong>Zero FOUC:</strong> Cor de fallback aparece instantaneamente</li>
            <li><strong>Progressive:</strong> Imagem carrega por cima quando pronta</li>
            <li><strong>Resiliente:</strong> Funciona mesmo com imagens quebradas</li>
            <li><strong>Performance:</strong> Priorização inteligente de recursos</li>
            <li><strong>UX:</strong> Transição suave sem flashes</li>
          </ul>
        </div>
      </HipHopCard>
    </div>
  );
}
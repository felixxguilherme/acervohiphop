"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useThemeBackground } from "@/hooks/useBackgroundImage";

export default function ThemeBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Hook para gerenciar carregamento das imagens de fundo
  const { backgroundClass, isLoading, hasError } = useThemeBackground(theme);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove(
          "theme-light", 
          "theme-dark",
          "body-theme-light",
          "body-theme-dark"
        );
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === "undefined") {
      return;
    }

    const { classList } = document.body;

    // Remove todas as classes de tema
    classList.remove(
      "theme-light", 
      "theme-dark",
      "body-theme-light",
      "body-theme-dark"
    );
    
    // Adiciona classes de tema com background de imagem
    classList.add(`theme-${theme}`);
    classList.add(`body-theme-${theme}`);
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Background fixo com sistema híbrido */}
      <div
        className={`fixed inset-0 w-full h-full z-0 ${backgroundClass}`}
        aria-hidden="true"
      >
        {/* Indicador visual de carregamento (opcional) */}
        {isLoading && (
          <div className="absolute bottom-4 right-4 text-xs opacity-50 font-sometype-mono">
            Carregando tema...
          </div>
        )}
        
        {/* Fallback visual em caso de erro */}
        {hasError && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/10" />
        )}
      </div>
      
      {/* Overlay sutil para melhorar legibilidade do texto */}
      <div 
        className={`fixed inset-0 w-full h-full z-1 pointer-events-none ${
          theme === 'light' 
            ? 'bg-white/10' 
            : 'bg-black/20'
        }`}
        aria-hidden="true"
      />
    </>
  );
}
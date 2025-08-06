'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useMemo } from 'react';

export const useThemeClasses = () => {
  const { theme } = useTheme();

  const themeClasses = useMemo(() => ({
    // Cores de texto
    textPrimary: 'text-theme-primary',
    textSecondary: 'text-theme-secondary', 
    textMuted: 'text-theme-muted',
    
    // Backgrounds
    bgCard: 'bg-theme-card',
    bgOverlay: 'bg-theme-overlay',
    
    // Bordas
    border: 'border-theme',
    borderSoft: 'border-theme-soft',
    
    // Combinações comuns
    cardStyle: 'bg-theme-card text-theme-primary border-theme',
    overlayStyle: 'bg-theme-overlay text-theme-primary',
    
    // Utilitários baseados no tema atual
    isDark: theme === 'dark',
    isLight: theme === 'light',
    
    // Cores condicionais para casos específicos
    getTextColor: (lightColor = 'text-black', darkColor = 'text-white') => 
      theme === 'light' ? lightColor : darkColor,
    
    getBgColor: (lightColor = 'bg-white', darkColor = 'bg-black') => 
      theme === 'light' ? lightColor : darkColor,
      
    getBorderColor: (lightColor = 'border-black', darkColor = 'border-white') => 
      theme === 'light' ? lightColor : darkColor,
  }), [theme]);

  return themeClasses;
};
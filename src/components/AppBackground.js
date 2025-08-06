'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useEffect } from 'react';

export default function AppBackground() {
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;
    
    // Remove classes de background anteriores
    body.classList.remove('bg-theme-light', 'bg-theme-dark');
    
    // Aplica novo background baseado no tema
    body.classList.add(`bg-theme-${theme}`);
    
    // Remove qualquer imagem de background anterior
    body.style.backgroundImage = 'none';
    
    // Aplica cor sólida baseada no tema
    if (theme === 'light') {
      body.style.backgroundColor = '#d6d5e2';
    } else {
      body.style.backgroundColor = '#686775';
    }
    
    // Remove propriedades desnecessárias
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';
    body.style.backgroundAttachment = '';
    
  }, [theme]);

  // Este componente não renderiza nada visível, apenas aplica estilos ao body
  return null;
}
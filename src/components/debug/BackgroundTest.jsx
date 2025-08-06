'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function BackgroundTest() {
  const { theme } = useTheme();

  const backgroundImage = theme === 'light' 
    ? '/fundo-base-branca-1.jpg' 
    : '/fundo-base-escuro-1.jpg';

  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll'
      }}
    />
  );
}
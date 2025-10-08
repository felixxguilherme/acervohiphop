"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 border-2 border-theme focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme"
      style={{
        backgroundColor: theme === 'light' ? '#F7ECE5' : '#A09A96'
      }}
      aria-label={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      <div
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full border border-theme transition-transform duration-300 flex items-center justify-center"
        style={{
          backgroundColor: theme === 'light' ? '#000' : '#fff',
          transform: theme === 'light' ? 'translateX(0)' : 'translateX(24px)'
        }}
      >
        <div className="text-xs font-bold" style={{ color: theme === 'light' ? '#fff' : '#000' }}>
          {theme === 'light' ? '☀️' : '🌙'}
        </div>
      </div>
    </button>
  );
}
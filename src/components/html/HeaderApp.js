"use client";

import AnimatedButton from "../AnimatedButton";
import Link from "next/link";
import { motion } from "motion/react";
import { SpinningText } from "../magicui/spinning-text";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function HeaderApp({ title, showTitle = false }) {
  const { theme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Carrega o tema do localStorage no primeiro render
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Atualiza quando o tema muda
    setCurrentTheme(theme);
  }, [theme]);
  return (
    <>
    {/* Título dinâmico - renderizado quando showTitle é true */}
      {showTitle && title && (
        <div className="w-full bg-transparent border-solid border-r-3 border-l-3 border-theme border-t-3">
          <motion.h1
            className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-theme-primary text-center py-4 md:py-6 lg:py-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              letterSpacing: '0.05em',
              lineHeight: '0.9',
            }}
          >
            {title}
          </motion.h1>
        </div>
      )}
    <motion.header
      className="sticky top-0 w-full border-3 border-solid border-theme z-50"
      style={{
        backgroundColor: currentTheme === 'light' ? '#EBEAE8' : '#000'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full py-4 md:py-6 border-theme">
        <div className="flex items-center justify-between px-4 md:px-8">
          {/* Spinning text - posicionado à esquerda */}
          <Link href="/">
            <div className="flex items-center px-4">
              <SpinningText>acervo • hip-hop • Distrito Federal •</SpinningText>
            </div>
          </Link>

          {/* Navegação principal - centralizada */}
          <nav className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 flex-1">
            <Link href="/acervo">
              <AnimatedButton textSize="text-3xl" text="ACERVO" backgroundMode="static" imagePath="marca-texto-vermelho.png" />
            </Link>
            <Link href="/mapa">
              <AnimatedButton textSize="text-3xl" text="MAPA" backgroundMode="static" imagePath="marca-texto-azul.png" />
            </Link>
            <Link href="/revista">
              <AnimatedButton textSize="text-3xl" text="REVISTA" backgroundMode="static" imagePath="marca-texto-verde.png" />
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
    </>
  );
}
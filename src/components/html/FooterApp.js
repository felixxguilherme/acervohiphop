"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';

export default function FooterApp() {
  const currentYear = new Date().getFullYear();
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

  const isDark = theme === "dark";
  const facImage = isDark ? "/fac_cor.webp" : "/fac_b&w.webp";
  const gdfImage = isDark ? "/gdf_cor.webp" : "/gdf_b&w.webp";

  
  return (
  <footer
      className={`${currentTheme === 'light' ? 'fundo-base' : 'fundo-base-preto'} relative z-10 border-b-3 border-l-3 border-r-3 border-solid border-theme text-center bg-[#FFFCF2] dark:bg-[#312F2C]`}
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <p className="italic text-sm md:text-base text-theme/80 dark:text-theme/80">
          Este projeto é realizado com recursos do Fundo de Apoio à Cultura do Distrito Federal
        </p>

        <div className={`${currentTheme === 'light' ? '' : 'fundo-base'} flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10`}>
          <div className="w-52 h-20 relative">
            <Image
              src={facImage}
              alt="Fundo de Apoio à Cultura"
              fill
              className="object-contain"
              sizes="208px"
              priority
            />
          </div>
          <div className="w-60 h-24 relative">
            <Image
              src={gdfImage}
              alt="Governo do Distrito Federal"
              fill
              className="object-contain"
              sizes="256px"
              priority
            />
          </div>
        </div>

        <p className="font-sometype-mono mt-4">
          © {currentYear} Distrito HipHop. Todos os direitos reservados <strong>acervodistritohiphop@gmail.com</strong>
        </p>
      </div>
    </footer>
  );
}
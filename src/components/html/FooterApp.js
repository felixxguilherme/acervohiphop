"use client";

import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import Link from 'next/link';

export default function FooterApp() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const facImage = isDark ? "/fac_cor.png" : "/fac_b&w.png";
  const gdfImage = isDark ? "/gdf_cor.png" : "/gdf_b&w.png";

  
  return (
  <footer
      className="relative z-10 border-t-3 border-solid border-theme text-center bg-[#F7ECE5] dark:bg-[#312F2C]"
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <p className="italic text-sm md:text-base text-black/80 dark:text-white/80">
          Este projeto é realizado com recursos do Fundo de Apoio à Cultura do Distrito Federal
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10">
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

        <p className="text-black mt-4 mb-4 dark:text-white">
          © {currentYear} Distrito HipHop. Todos os direitos reservados. <span>📧 contato@distritohiphop.com</span>
        </p>
      </div>
    </footer>
  );
}
"use client";

import AnimatedButton from "../AnimatedButton";
import Link from "next/link";
import { motion } from "motion/react";
import { SpinningText } from "../magicui/spinning-text";

export default function HeaderApp() {
  return (
    <motion.header
      className="relative w-full py-4 md:py-6 border-t-3 border-b-3 border-solid border-theme z-20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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
    </motion.header>
  );
}
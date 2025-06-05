// "use client";

// import NextImage from "next/image";
// import { scratchyFont } from "./fonts";
// import { useEffect, useState } from "react";
// import AnimatedButton from "./components/AnimatedButton";
// import PolaroidCard from "./components/PolaroidPhoto";
// import PolaroidCard2 from "./components/PolaroidPhoto2";
// import { motion } from "framer-motion";

// import Link from "next/link";

// export default function Home() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Estratégia de carregamento otimizado
//     if (typeof window !== 'undefined') {
//       // Pré-armazenar a imagem em cache antes de mostrar a página
//       const bgImage = new window.Image();
//       bgImage.src = '/fundo_base.jpg';

//       // Adicionar preload no head
//       const link = document.createElement('link');
//       link.rel = 'preload';
//       link.as = 'image';
//       link.href = '/fundo_base.jpg';
//       link.type = 'image/jpeg';
//       link.fetchpriority = 'high'; // Prioridade alta para o carregamento
//       document.head.appendChild(link);

//       // Mostrar página somente quando imagem estiver carregada
//       if (bgImage.complete) {
//         setIsLoading(false);
//       } else {
//         bgImage.onload = () => setIsLoading(false);
//         // Fallback em caso de erro ou timeout
//         bgImage.onerror = () => setIsLoading(false);
//         // Timeout de segurança
//         setTimeout(() => setIsLoading(false), 2000);
//       }

//       return () => {
//         if (document.head.contains(link)) {
//           document.head.removeChild(link);
//         }
//       };
//     }
//   }, []);

//   return (
//     <>
//       {/* Tela de carregamento - visível apenas enquanto a imagem carrega */}
//       {isLoading && (
//         <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
//           <div className="flex gap-2">
//             {[0, 1, 2, 3, 4].map((index) => (
//               <motion.div
//                 key={index}
//                 className="w-4 h-16 bg-white rounded-sm"
//                 initial={{ height: 8 }}
//                 animate={{
//                   height: [8, 40, 8],
//                   backgroundColor: ["#ffffff", "#f8e71c", "#ffffff"]
//                 }}
//                 transition={{
//                   duration: 1,
//                   repeat: Infinity,
//                   delay: index * 0.15,
//                   ease: "easeInOut"
//                 }}
//               />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Div com a imagem de fundo usando CSS baseado em URL */}
//       <div
//         className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
//         style={{
//           backgroundImage: `url('/fundo_base.jpg')`,
//           backgroundColor: '#000', // Preto como cor de fallback (não será visível devido à tela de loading)
//         }}
//         aria-hidden="true"
//       />

//       {/* Conteúdo da página - escondido até que a imagem carregue */}
//       <div className={`grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] relative transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
//         <header className={`${scratchyFont.variable} flex justify-center space-between`}>
//           <Link href="/acervo">
//             <AnimatedButton text="ACERVO" href="/" imagePath="teste2.png" />
//           </Link>
//           <AnimatedButton text="AUDIOVISUAL" href="/" imagePath="teste2.png" />
//           <AnimatedButton text="MAPA" href="/" imagePath="teste2.png" />
//           <AnimatedButton text="REVISTA" href="/" imagePath="teste2.png" />


//         </header>

//         <main className="flex flex-col">
//           <div className="grid grid-flow-col grid-rows-3 gap-4">
//             <h1 className="font-dirty-stains text-4xl">DISTRITO HIPHOP</h1>
//             <div className="row-span-2 row-span-5"><PolaroidCard imageSrc={'https://images.unsplash.com/photo-1741183940585-c5b39ed63d83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D'} tape={{ position: 'top-right', angle: 45 }} /></div>
//             <div className="col-span-2 row-span-5"><PolaroidCard2 /></div>
//             <div className="col-span-4 row-span-10"><PolaroidCard imageSrc={'https://images.unsplash.com/photo-1741183940585-c5b39ed63d83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D'} /></div>
//           </div>
//         </main>

//         <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
//           <a
//             className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//             href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <NextImage
//               aria-hidden
//               src="/file.svg"
//               alt="File icon"
//               width={16}
//               height={16}
//             />
//             Learn
//           </a>
//           <a
//             className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//             href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <NextImage
//               aria-hidden
//               src="/window.svg"
//               alt="Window icon"
//               width={16}
//               height={16}
//             />
//             Examples
//           </a>
//           <a
//             className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//             href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <NextImage
//               aria-hidden
//               src="/globe.svg"
//               alt="Globe icon"
//               width={16}
//               height={16}
//             />
//             Go to nextjs.org →
//           </a>
//         </footer>
//       </div>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedButton from "../components/AnimatedButton";
import PolaroidCard from "../components/PolaroidPhoto";
import { SpinningText } from "../components/magicui/spinning-text.jsx"
import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button.jsx";
import HeroVideoDialog from "../components/magicui/hero-video-dialog.jsx";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Estratégia de carregamento otimizado
    if (typeof window !== 'undefined') {
      // Pré-armazenar a imagem em cache
      const bgImage = new window.Image();
      bgImage.src = '/fundo_base.jpg';

      // Adicionar preload no head
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = '/fundo_base.jpg';
      link.type = 'image/jpeg';
      link.fetchpriority = 'high';
      document.head.appendChild(link);

      // Mostrar página quando imagem estiver carregada
      if (bgImage.complete) {
        setIsLoading(false);
      } else {
        bgImage.onload = () => setIsLoading(false);
        bgImage.onerror = () => setIsLoading(false);
        setTimeout(() => setIsLoading(false), 2000);
      }

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, []);

  return (
    <>
      {/* Tela de carregamento */}
      {isLoading && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-16 bg-white rounded-sm"
                initial={{ height: 8 }}
                animate={{
                  height: [8, 40, 8],
                  backgroundColor: ["#ffffff", "#f8e71c", "#ffffff"]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Imagem de fundo */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
        style={{
          backgroundImage: `url('/fundo_base.jpg')`,
          backgroundColor: '#000',
        }}
        aria-hidden="true"
      />

      

      {/* Conteúdo principal */}
      <div className={`overflow-hidden min-h-screen flex flex-col ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Header centralizado */}
        <header className="w-full py-4 md:py-6 flex justify-center border-b-2 border-solid border-black">
          <div className="absolute top-13 left-20">
            <SpinningText>acervo • hip-hop • Distrito Federal •</SpinningText>;
          </div>
          <nav className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 px-2">
            <Link href="/acervo">
              <AnimatedButton textSize="text-3xl" text="ACERVO" imagePath="teste.png" />
            </Link>
            <AnimatedButton textSize="text-3xl" text="AUDIOVISUAL" imagePath="teste2.png" />
            <AnimatedButton textSize="text-3xl" text="MAPA" imagePath="teste2.png" />
            <AnimatedButton textSize="text-3xl" text="REVISTA" imagePath="teste2.png" />            
          </nav>          
        </header>

        {/* Layout de imagens em colunas */}
        <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 mb-8">
          {/* Título grande "DISTRITO HIPHOP" */}
          <div className="w-full text-center my-4 md:my-6 lg:my-8">
            <motion.h1
              className={`font-dirty-stains sm:text-6xl md:text-7xl lg:text-8xl text-shadow-lg`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              DISTRITO HIPHOP
            </motion.h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[70vh]">
            {/* Coluna esquerda (1/4) com duas imagens empilhadas */}
            <div className="md:col-span-1 grid grid-rows-2 gap-6 h-full">
              {/* Imagem superior - usando PolaroidCard */}
              <div className="h-64">
                <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1641145927280-0af196517d03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D'} tape={{ position: 'top-left', angle: -45 }} />
              </div>

              <div className="h-64">
                <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww'}
                  tape={{ position: 'bottom-left', angle: 45 }}
                  // secondTape={{ position: 'bottom-right', angle: -45 }}
                  caption={`teste`}
                />
              </div>
            </div>

            <div className="md:col-span-3 h-140">
              {/* <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1741183940585-c5b39ed63d83?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8dG93SlpGc2twR2d8fGVufDB8fHx8fA%3D%3D'} tape={{ position: 'top-right', angle: 45 }} /> */}
              <PolaroidCard
                imageSrc={'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fs2.glbimg.com%2FPGJL0ln1QOVR2K2H6p4WGn70z8w%3D%2F1200x630%2Ffilters%3Amax_age(3600)%2Fs01.video.glbimg.com%2Fdeo%2Fvi%2F04%2F51%2F4525104&f=1&nofb=1&ipt=b2917524fc622904e511e47e944246fd60bb3ba137fd58482875129bc4eb6e93'}
                tape={{position: 'top-right', angle: 45}}
                caption={`https://g1.globo.com/distrito-federal/noticia/2015/10/ceilandia-no-df-recebe-2-expo-hip-hop-brasil-ate-domingo.html`}
              />
            </div>
          </div>
          <InteractiveHoverButton>Conheça</InteractiveHoverButton>
          {/* <HeroVideoDialog
              className="block dark:hidden"
              videoSrc="https://www.youtube.com/embed/situlcE28w0?si=OIrELMHTLQ2LaEQA"
              thumbnailSrc="https://i.ytimg.com/an_webp/situlcE28w0/mqdefault_6s.webp?du=3000&sqp=CKTm-MAG&rs=AOn4CLAuwWbZ7iOZqlH8g5b_6lrEntEStw"
              thumbnailAlt="Dummy Video Thumbnail"
            /> */}
          
        </main>

        {/* Footer como uma faixa simples */}
        <footer className="mt-8 w-full bg-black bg-opacity-70 text-white py-3">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div className={`font-scratchy`}>
              &copy; 2025 Distrito HipHop
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="hover:underline">Instagram</Link>
              <Link href="#" className="hover:underline">YouTube</Link>
              <Link href="#" className="hover:underline">Contato</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
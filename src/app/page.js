// "use client";

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'motion/react';
// import { Button } from '@/components/ui/button';
// import { SpinningText } from '@/components/magicui/spinning-text';
// import AnimatedButton from '@/components/AnimatedButton';
// import { useEffect } from 'react';
// import PolaroidCard from '@/components/PolaroidPhoto';
// import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';

// export default function Home() {
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Estratégia de carregamento otimizado
//     if (typeof window !== 'undefined') {
//       // Pré-armazenar a imagem em cache
//       const bgImage = new window.Image();
//       bgImage.src = '/fundo_base.jpg';

//       // Adicionar preload no head
//       const link = document.createElement('link');
//       link.rel = 'preload';
//       link.as = 'image';
//       link.href = '/fundo_base.jpg';
//       link.type = 'image/jpeg';
//       link.fetchpriority = 'high';
//       document.head.appendChild(link);

//       // Mostrar página quando imagem estiver carregada
//       if (bgImage.complete) {
//         setIsLoading(false);
//       } else {
//         bgImage.onload = () => setIsLoading(false);
//         bgImage.onerror = () => setIsLoading(false);
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
//       {/* Tela de carregamento */}
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

//       {/* Imagem de fundo - agora com z-index menor */}
//       <div
//         className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
//         style={{
//           backgroundImage: `url('/fundo_base.jpg')`,
//           backgroundColor: '#000',
//         }}
//         aria-hidden="true"
//       />

//       {/* Conteúdo principal - removemos o container absoluto */}
//       <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
//         {/* Page Content with Transition */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             initial={{ y: 50, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -50, opacity: 0 }}
//             transition={{
//               type: 'tween',
//               duration: 0.8,
//               ease: [0.25, 0.1, 0.25, 1]
//             }}
//             className="w-full overflow-hidden max-w-screen-xl mx-auto px-4 md:px-8 py-8"
//           >
//             {/* Título grande "DISTRITO HIPHOP" */}
//             <div className="w-full text-center my-4 md:my-6 lg:my-8">
//               <motion.h1
//                 className={`font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-shadow-lg text-black`}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.3 }}
//               >
//                 DISTRITO HIPHOP
//               </motion.h1>
//             </div>

//             {/* Grid de conteúdo */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[70vh]">
//               {/* Coluna esquerda (1/4) com duas imagens empilhadas */}
//               <div className="md:col-span-1 grid grid-rows-2 gap-6">
//                 {/* Imagem superior - usando PolaroidCard */}
//                 <div className="h-64">
//                   <PolaroidCard 
//                     imageSrc={'https://images.unsplash.com/photo-1641145927280-0af196517d03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D'} 
//                     tape={{ position: 'top-left', angle: -45 }} 
//                   />
//                 </div>

//                 <div className="h-64">
//                   <PolaroidCard 
//                     imageSrc={'https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww'}
//                     tape={{ position: 'bottom-left', angle: 45 }}
//                     caption={`teste`}
//                   />
//                 </div>
//               </div>

//               {/* Coluna direita (3/4) */}
//               <div className="md:col-span-3 min-h-[400px]">
//                 <PolaroidCard
//                   imageSrc={'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fs2.glbimg.com%2FPGJL0ln1QOVR2K2H6p4WGn70z8w%3D%2F1200x630%2Ffilters%3Amax_age(3600)%2Fs01.video.glbimg.com%2Fdeo%2Fvi%2F04%2F51%2F4525104&f=1&nofb=1&ipt=b2917524fc622904e511e47e944246fd60bb3ba137fd58482875129bc4eb6e93'}
//                   tape={{ position: 'top-right', angle: 45 }}
//                   caption={`https://g1.globo.com/distrito-federal/noticia/2015/10/ceilandia-no-df-recebe-2-expo-hip-hop-brasil-ate-domingo.html`}
//                 />
//               </div>
//             </div>

//             {/* Botão */}
//             <div className="mt-8 text-center">
//               <InteractiveHoverButton>Conheça</InteractiveHoverButton>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </>
//   );
// }

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { SpinningText } from '@/components/magicui/spinning-text';
import AnimatedButton from '@/components/AnimatedButton';
import { useEffect } from 'react';
import PolaroidCard from '@/components/PolaroidPhoto';
import { InteractiveHoverButton } from '@/components/magicui/interactive-hover-button';
import HeaderApp from '@/components/html/HeaderApp';

import { CartoonButton } from '@/components/ui/cartoon-button';
import { ClipPathLinks } from '@/components/ui/clip-path-links';

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
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('/fundo_base.jpg')`,
          backgroundColor: '#000',
        }}
        aria-hidden="true"
      />

      {/* Conteúdo principal */}
      <div className={`relative z-10 overflow-hidden ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        {/* Título ocupando toda a largura da tela - ACIMA DE TUDO */}
        <div className="w-full bg-transparent">
          <motion.h1
            className="font-dirty-stains text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shadow-lg text-black text-center py-4 md:py-6 lg:py-8 w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              letterSpacing: '0.05em',
              lineHeight: '0.9'
            }}
          >
            DISTRITO HIPHOP
          </motion.h1>
        </div>

        {/* Header - Espaço reservado para o header futuro */}
        <div className="w-full">
          <HeaderApp />
          {/* <div className="h-16 flex items-center justify-center">
            <h1>teste teste teste</h1>
          </div> */}
        </div>

        {/* Page Content with Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{
              type: 'tween',
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            className="w-full overflow-hidden max-w-screen-xl mx-auto px-4 md:px-8 py-8 border-solid border-black"
          >
            {/* Grid de conteúdo */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[70vh]">
              {/* Coluna esquerda (1/4) com duas imagens empilhadas */}
              <div className="md:col-span-5 gap-6">
                {/* Imagem superior - usando PolaroidCard */}

                <PolaroidCard
                  imageSrc={'https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww'}
                  tape={{ position: 'bottom-left', angle: 45 }}
                  caption={`Acervo pessoal DJ Fulano, em Guariroba - Ceilândia, DF`}
                />

                {/* <div className="h-64 mt-10">
                  <PolaroidCard
                    className="h-full"
                    imageSrc={'https://images.unsplash.com/photo-1641145927280-0af196517d03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D'} 
                    tape={{ position: 'top-left', angle: -45 }} 
                  />
                </div> */}
              </div>

              {/* Coluna direita (3/4) */}
              <div className="md:col-span-7 flex flex-col justify-center">
                {/* <PolaroidCard
                  imageSrc={'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fs2.glbimg.com%2FPGJL0ln1QOVR2K2H6p4WGn70z8w%3D%2F1200x630%2Ffilters%3Amax_age(3600)%2Fs01.video.glbimg.com%2Fdeo%2Fvi%2F04%2F51%2F4525104&f=1&nofb=1&ipt=b2917524fc622904e511e47e944246fd60bb3ba137fd58482875129bc4eb6e93'}
                  tape={{ position: 'top-right', angle: 45 }}
                  caption={`https://g1.globo.com/distrito-federal/noticia/2015/10/ceilandia-no-df-recebe-2-expo-hip-hop-brasil-ate-domingo.html`}
                /> */}

                <h3 className="font-sometype-mono text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-black text-center">Uma plataforma digital dedicada à preservação, documentação e difusão da cultura Hip Hop do Distrito Federal e Entorno. </h3>
                <div className="flex justify-center mt-4">
                  <div className="mr-4">
                    <CartoonButton className="mr-2" color="bg-[#fae523]" label="Visitar Acervo!" onClick={() => alert('Button clicked!')}/>
                  </div>
                  <div className="ml-4">
                    <CartoonButton className="ml-2" label="Mapa!" color="" onClick={() => alert('Button clicked!')}/>
                  </div>                  
                </div>
              </div>
            </div>
          </motion.div>

        </AnimatePresence>

        <div className="mt-8 mb-8">
          <ClipPathLinks className="" />
        </div>        
      </div>
      
    </>
  );
}
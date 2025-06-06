// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import AnimatedButton from "../components/AnimatedButton";
// import PolaroidCard from "../components/PolaroidPhoto";
// import { SpinningText } from "../components/magicui/spinning-text.jsx"
// import { InteractiveHoverButton } from "../components/magicui/interactive-hover-button.jsx";
// import HeroVideoDialog from "../components/magicui/hero-video-dialog.jsx";


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

//       {/* Imagem de fundo */}
//       <div
//         className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
//         style={{
//           backgroundImage: `url('/fundo_base.jpg')`,
//           backgroundColor: '#000',
//         }}
//         aria-hidden="true"
//       />



//       {/* Conteúdo principal */}
//       <div className={`overflow-hidden min-h-screen flex flex-col ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
//         {/* Header centralizado */}
//         <header className="w-full py-4 md:py-6 flex justify-center border-b-2 border-solid border-black">
//           <div className="absolute top-13 left-20">
//             <SpinningText>acervo • hip-hop • Distrito Federal •</SpinningText>;
//           </div>
//           <nav className="flex flex-wrap justify-center gap-2 md:gap-4 lg:gap-6 px-2">
//             <Link href="/acervo">
//               <AnimatedButton textSize="text-3xl" text="ACERVO" imagePath="teste.png" />
//             </Link>
//             <AnimatedButton textSize="text-3xl" text="AUDIOVISUAL" imagePath="teste2.png" />
//             <AnimatedButton textSize="text-3xl" text="MAPA" imagePath="teste2.png" />
//             <AnimatedButton textSize="text-3xl" text="REVISTA" imagePath="teste2.png" />            
//           </nav>          
//         </header>

//         <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 md:px-8 mb-8">
//           <div className="w-full text-center my-4 md:my-6 lg:my-8">
//             <motion.h1
//               className={`font-dirty-stains sm:text-6xl md:text-7xl lg:text-8xl text-shadow-lg`}
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, delay: 0.3 }}
//             >
//               DISTRITO HIPHOP
//             </motion.h1>
//             <motion.h3
//               className={`mt-8 font-sometype-mono sm:text-4xl md:text-5xl lg:text-4xl`}>
//                 Cultura, história e resistência no Distrito Federal
//             </motion.h3>
//             <div className="flex flex-col justify-center gap-4 mt-10">
//               <div><InteractiveHoverButton>Explorar acervo</InteractiveHoverButton></div>              
//               <div><InteractiveHoverButton>Ver mapa</InteractiveHoverButton></div>
//             </div>

//           </div>
//           {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[70vh]">
//             <div className="md:col-span-1 grid grid-rows-2 gap-6 h-full">
//               <div className="h-64">
//                 <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1641145927280-0af196517d03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D'} tape={{ position: 'top-left', angle: -45 }} />
//               </div>

//               <div className="h-64">
//                 <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww'}
//                   tape={{ position: 'bottom-left', angle: 45 }}
//                   // secondTape={{ position: 'bottom-right', angle: -45 }}
//                   caption={`teste`}
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-3 h-140">
//               <PolaroidCard
//                 imageSrc={'https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fs2.glbimg.com%2FPGJL0ln1QOVR2K2H6p4WGn70z8w%3D%2F1200x630%2Ffilters%3Amax_age(3600)%2Fs01.video.glbimg.com%2Fdeo%2Fvi%2F04%2F51%2F4525104&f=1&nofb=1&ipt=b2917524fc622904e511e47e944246fd60bb3ba137fd58482875129bc4eb6e93'}
//                 tape={{position: 'top-right', angle: 45}}
//                 caption={`https://g1.globo.com/distrito-federal/noticia/2015/10/ceilandia-no-df-recebe-2-expo-hip-hop-brasil-ate-domingo.html`}
//               />
//             </div>
//           </div> */}
//           {/* <InteractiveHoverButton>Conheça</InteractiveHoverButton> */}


//           {/* <HeroVideoDialog
//               className="block dark:hidden"
//               videoSrc="https://www.youtube.com/embed/situlcE28w0?si=OIrELMHTLQ2LaEQA"
//               thumbnailSrc="https://i.ytimg.com/an_webp/situlcE28w0/mqdefault_6s.webp?du=3000&sqp=CKTm-MAG&rs=AOn4CLAuwWbZ7iOZqlH8g5b_6lrEntEStw"
//               thumbnailAlt="Dummy Video Thumbnail"
//             /> */}

//         </main>

//         {/* Footer como uma faixa simples */}
//         <footer className="mt-8 w-full bg-black bg-opacity-70 text-white py-3">
//           <div className="container mx-auto flex justify-between items-center px-4">
//             <div className={`font-scratchy`}>
//               &copy; 2025 Distrito HipHop
//             </div>
//             <div className="flex space-x-4">
//               <Link href="#" className="hover:underline">Instagram</Link>
//               <Link href="#" className="hover:underline">YouTube</Link>
//               <Link href="#" className="hover:underline">Contato</Link>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// }

'use client';
import { useScroll, useTransform, motion } from "framer-motion";
import { SpinningText } from "../components/magicui/spinning-text.jsx"
import AnimatedButton from "../components/AnimatedButton";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Lenis from 'lenis';

import PolaroidCard from "../components/PolaroidPhoto";
import PolaroidCard2 from "../components/PolaroidPhoto2";
import HeroVideoDialog from "../components/magicui/hero-video-dialog.jsx";

export default function Home() {

  const container = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
  })

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <>
      {/* Imagem de fundo */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
        style={{
          backgroundImage: `url('/fundo_base.jpg')`,
          backgroundColor: '#000',
        }}
        aria-hidden="true"
      />
      <header className="w-full py-4 md:py-6 flex justify-center border-b-4 border-solid border-black">
        <div className="absolute top-13 left-20">
          <SpinningText>acervo • hip-hop • acervo • hip-hop •</SpinningText>;
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
      <main ref={container} className="relative h-[400vh]">
        <Section1 scrollYProgress={scrollYProgress} />
        <Section2 scrollYProgress={scrollYProgress} />
        <Section3 />
        <Section4 />
      </main>
    </>

  );
}

const Section1 = ({ scrollYProgress }) => {

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5])
  return (
    <motion.div style={{ scale, rotate }} className="sticky top-0 h-screen text-[3.5vw] flex flex-col items-center justify-center text-white pb-[10vh]">      
      <motion.h1
     className={`font-dirty-stains text-black text-center sm:text-6xl md:text-7xl lg:text-8xl text-shadow-lg`}
     initial={{ opacity: 0, y: -20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.8, delay: 0.3 }}
   >
     DISTRITO HIPHOP
   </motion.h1>
      <div className="flex gap-4">
        <motion.h3  className={`text-black mt-8 font-sometype-mono sm:text-4xl md:text-5xl lg:text-4xl`}>
          Cultura, história
        </motion.h3>
        <div className="relative text-black">
          {/* <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1605055510925-4c9626126167?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlwaG9wfGVufDB8fDB8fHww'}
            tape={{ position: 'bottom-left', angle: 45 }}
            caption={`teste`}
          /> */}
          &
        </div>
        <motion.h3 className={`text-black mt-8 font-sometype-mono sm:text-4xl md:text-5xl lg:text-4xl`}>
          resistência Distrito Federal
        </motion.h3>
      </div>
    </motion.div>
  )
}

const Section2 = ({ scrollYProgress }) => {

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0])

  return (
    <motion.div style={{ scale, rotate }} className="relative h-screen">
      
        <PolaroidCard imageSrc={'https://images.unsplash.com/photo-1641145927280-0af196517d03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGhpcGhvcHxlbnwwfHwwfHx8MA%3D%3D'} tape={{ position: 'top-left', angle: -45 }} />
      

    </motion.div>
  )
}

const Section3 = () => {
  return (
    <motion.section
      className="flex h-screen flex-col items-center justify-center gap-6"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <PolaroidCard2 caption="Distrito HipHop" />
      <motion.p className="font-sometype-mono text-2xl" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        Memórias que inspiram
      </motion.p>
    </motion.section>
  );
}

const Section4 = () => {
  return (
    <motion.section
      className="flex h-screen items-center justify-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <HeroVideoDialog
        videoSrc="https://www.youtube.com/embed/situlcE28w0?si=OIrELMHTLQ2LaEQA"
        thumbnailSrc="https://i.ytimg.com/an_webp/situlcE28w0/mqdefault_6s.webp?du=3000&sqp=CKTm-MAG&rs=AOn4CLAuwWbZ7iOZqlH8g5b_6lrEntEStw"
        className="max-w-xl w-full"
      />
    </motion.section>
  );
}

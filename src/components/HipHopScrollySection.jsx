'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';

const HipHopScrollySection = () => {
  const { theme } = useTheme();
  const scrollyRef = useRef(null);
  const figureRef = useRef(null);
  const articleRef = useRef(null);
  const stepRefs = useRef([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [scroller, setScroller] = useState(null);

  const steps = [
    { 
      id: 1, 
      text: "1985", 
      title: "CHEGADA",
      content: "O Hip Hop desembarca no DF através de jovens como X, Marquim do Trema e DJ Jamaika, que trouxeram a cultura das ruas de Nova York para Brasília.",
      image: "/images/hiphop/pioneiros-df.jpg"
    },
    { 
      id: 2, 
      text: "RODOVIÁRIA", 
      title: "BERÇO",
      content: "A Rodoviária do Plano Piloto vira o point oficial. Nas plataformas superiores, as primeiras rodas de break e encontros de rap tomam forma.",
      image: "/images/hiphop/rodoviaria-break.jpg"
    },
    { 
      id: 3, 
      text: "CÂMBIO", 
      title: "PRIMEIRA POSSE",
      content: "Nasce a Câmbio Negro, primeira posse do DF, fundada por DJ Jamaika e Fase Terminal. Marco histórico do movimento organizado.",
      image: "/images/hiphop/cambio-negro.jpg"
    },
    { 
      id: 4, 
      text: "CEILÂNDIA", 
      title: "EPICENTRO",
      content: "A Ceilândia explode como berço do rap nacional. Surgem grupos como Câmbio Negro, Base Comunitária e outros que definem o som brasiliense.",
      image: "/images/hiphop/ceilandia-90s.jpg"
    },
    { 
      id: 5, 
      text: "GOG", 
      title: "LENDA VIVA",
      content: "Genival Oliveira Gonçalves lança 'Que Nem Jiló' em 1994, colocando o rap do DF no mapa nacional com consciência social e identidade própria.",
      image: "/images/hiphop/gog-jiló.jpg"
    },
    { 
      id: 6, 
      text: "FEMININO", 
      title: "MULHERES NA LUTA",
      content: "Dina Di, Vera Verônika, Lady Braga e outras pioneiras quebram barreiras no rap e breaking, abrindo caminhos para futuras gerações.",
      image: "/images/hiphop/mulheres-rap.jpg"
    },
    { 
      id: 7, 
      text: "GRAFFITI", 
      title: "ARTE NOS MUROS",
      content: "Writers como Tinho, Robson Pilão e outros transformam pilotis e muros em galerias urbanas, criando identidade visual única.",
      image: "/images/hiphop/graffiti-pilotis.jpg"
    },
    { 
      id: 8, 
      text: "BATALHAS", 
      title: "DUELOS DE RIMA",
      content: "Batalhas de MCs na Rodoviária revelam talentos como Rappin' Hood, estabelecendo o freestyle como tradição local.",
      image: "/images/hiphop/batalhas-rodo.jpg"
    },
    { 
      id: 9, 
      text: "FACÇÃO", 
      title: "NOVA ESCOLA",
      content: "Facção Central e outros grupos dos anos 2000 levam o rap do DF para novo patamar com producões profissionais e letras contundentes.",
      image: "/images/hiphop/faccao-central.jpg"
    },
    { 
      id: 10, 
      text: "EVENTOS", 
      title: "CONSOLIDAÇÃO",
      content: "Duelo de MCs, Festival de Inverno de Bonito, Hutúz Festival e outros eventos consolidam o DF como capital nacional do Hip Hop.",
      image: "/images/hiphop/eventos-df.jpg"
    },
    { 
      id: 11, 
      text: "NOVA", 
      title: "GERAÇÃO",
      content: "Djonga, Sant, Menor do Chapa, BK' e nova geração mantêm viva a tradição, inovando e conquistando público nacional.",
      image: "/images/hiphop/nova-geracao.jpg"
    },
    { 
      id: 12, 
      text: "PATRIMÔNIO", 
      title: "LEGADO ETERNO",
      content: "O Hip Hop do DF é reconhecido como patrimônio cultural imaterial, inspirando jovens de todo Brasil e preservando a memória do movimento.",
      image: "/images/hiphop/patrimonio-cultural.jpg"
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('scrollama').then((scrollamaModule) => {
        const scrollerInstance = scrollamaModule.default();
        setScroller(scrollerInstance);

        const handleResize = () => {
          const stepH = Math.floor(window.innerHeight * 0.75);
          stepRefs.current.forEach(step => {
            if (step) step.style.height = stepH + 'px';
          });

          const figureHeight = window.innerHeight / 2;
          const figureMarginTop = (window.innerHeight - figureHeight) / 2;

          if (figureRef.current) {
            figureRef.current.style.height = figureHeight + 'px';
            figureRef.current.style.top = figureMarginTop + 'px';
          }

          scrollerInstance.resize();
        };

        const handleStepEnter = (response) => {
          setCurrentStep(response.index);
          
          // Update step classes
          stepRefs.current.forEach((step, i) => {
            if (step) {
              step.classList.toggle('is-active', i === response.index);
            }
          });
        };

        const init = () => {
          handleResize();
          
          scrollerInstance
            .setup({
              step: '.scrolly-step',
              offset: 0.33,
              debug: false
            })
            .onStepEnter(handleStepEnter);
        };

        init();

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          scrollerInstance.destroy();
        };
      });
    }
  }, []);

  return (
    <div 
      id="hiphop-scrolly"
      className="relative flex min-h-screen border-theme border-solid border-3"
      style={{
        backgroundColor: theme === 'light' ? '#FFFCF2' : '#252422'
      }}
      ref={scrollyRef}
    >
      {/* Article with steps */}
      <article 
        className="flex-1 relative p-6 max-w-xl"
        ref={articleRef}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="scrolly-step mb-8 last:mb-0 transition-all duration-500 border-3 border-theme"
            data-step={step.id}
            ref={el => stepRefs.current[index] = el}
            style={{
              backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
              color: theme === 'light' ? '#000' : '#fff'
            }}
          >
            <div className="p-6">
              <h3 className="font-dirty-stains text-xl mb-3 uppercase tracking-wider">
                {step.title}
              </h3>
              <p className="font-scratchy text-lg leading-relaxed">
                {step.content}
              </p>
            </div>
          </div>
        ))}
      </article>

      {/* Sticky figure with image and text */}
      <figure 
        className="flex-1 sticky w-full m-0 z-0 flex flex-col items-center justify-center border-3 border-theme relative overflow-hidden"
        ref={figureRef}
        style={{
          transform: 'translate3d(0, 0, 0)',
          top: '140px',
          height: '60vh',
          backgroundColor: theme === 'light' ? '#FFFCF2' : '#252422'
        }}
      >
        {/* Background Image */}
        {steps[currentStep]?.image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              fill
              className="object-cover opacity-40"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        
        {/* Text overlay */}
        <div className="relative z-10 text-center p-8">
          <h2 className="font-dirty-stains text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-wider mb-4"
              style={{ 
                color: theme === 'light' ? '#000' : '#fff',
                textShadow: theme === 'light' ? '2px 2px 4px rgba(0,0,0,0.3)' : '2px 2px 4px rgba(255,255,255,0.3)'
              }}>
            {steps[currentStep]?.text || '1985'}
          </h2>
          <h3 className="font-scratchy text-2xl md:text-3xl uppercase tracking-wide"
              style={{ color: theme === 'light' ? '#000' : '#fff' }}>
            {steps[currentStep]?.title || 'CHEGADA'}
          </h3>
        </div>
      </figure>

      <style jsx>{`
        .scrolly-step.is-active {
          background-color: ${theme === 'light' ? '#000' : '#fff'} !important;
          color: ${theme === 'light' ? '#fff' : '#000'} !important;
          transform: scale(1.02);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default HipHopScrollySection;
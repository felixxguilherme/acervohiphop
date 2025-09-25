'use client';

import React, { useEffect, useRef, useState } from 'react';

const HipHopScrollySection = () => {
  const scrollyRef = useRef(null);
  const figureRef = useRef(null);
  const articleRef = useRef(null);
  const stepRefs = useRef([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [scroller, setScroller] = useState(null);

  const steps = [
    { id: 1, text: "HIP", content: "O movimento Hip Hop chegou ao DF nos anos 80, trazido por jovens que descobriram a cultura em viagens ao Rio e São Paulo." },
    { id: 2, text: "HOP", content: "Quatro elementos fundamentais: Rap (MC), Breaking (B-boy/B-girl), Graffiti (Writer) e DJing (DJ)." },
    { id: 3, text: "RODA", content: "As primeiras rodas de break aconteciam na Rodoviária do Plano Piloto, reunindo os pioneiros do movimento." },
    { id: 4, text: "CEILÂNDIA", content: "A Ceilândia se tornou o epicentro do rap brasileiro nos anos 90, berço de grupos icônicos." },
    { id: 5, text: "GOG", content: "Genival Oliveira Gonçalves, o GOG, colocou o rap brasiliense no mapa nacional com letras conscientes." },
    { id: 6, text: "GRAFITE", content: "Muros e pilotis de Brasília ganharam cores com a arte urbana, transformando a cidade." },
    { id: 7, text: "BATALHAS", content: "Duelos de MCs na rodoviária revelaram talentos e estabeleceram o freestyle como tradição." },
    { id: 8, text: "MULHERES", content: "Dina Di, Vera Verônika e outras precursoras abriram caminhos no rap e breaking feminino." },
    { id: 9, text: "ESTÚDIOS", content: "Estúdios caseiros e independentes permitiram a produção e gravação dos primeiros álbuns." },
    { id: 10, text: "EVENTOS", content: "Festivais e encontros consolidaram o DF como referência nacional do Hip Hop." },
    { id: 11, text: "NOVA", content: "A nova geração mantém viva a tradição, inovando e expandindo os horizontes da cultura." },
    { id: 12, text: "LEGADO", content: "Hoje o Hip Hop do DF é patrimônio cultural, inspirando jovens de todo o Brasil." }
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
      className="relative flex bg-gray-100 p-4 min-h-screen border-theme border-solid border-3 pt-8"
      ref={scrollyRef}
    >
      {/* Article with steps */}
      <article 
        className="flex-1 relative p-4 max-w-80"
        ref={articleRef}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="scrolly-step mb-8 bg-gray-800 text-white last:mb-0 transition-colors duration-300"
            data-step={step.id}
            ref={el => stepRefs.current[index] = el}
          >
            <p className="text-center p-4 text-2xl font-sometype-mono">
              {step.content}
            </p>
          </div>
        ))}
      </article>

      {/* Sticky figure */}
      <figure 
        className="flex-1 sticky w-full m-0 bg-gray-600 z-0 flex items-center justify-center"
        ref={figureRef}
        style={{
          transform: 'translate3d(0, 0, 0)',
          top: '140px',
          height: '50vh'
        }}
      >
        <p className="text-center text-8xl font-black text-white font-dirty-stains">
          {steps[currentStep]?.text || 'HIP'}
        </p>
      </figure>

      <style jsx>{`
        .scrolly-step.is-active {
          background-color: #DAA520;
          color: #3b3b3b;
        }
      `}</style>
    </div>
  );
};

export default HipHopScrollySection;
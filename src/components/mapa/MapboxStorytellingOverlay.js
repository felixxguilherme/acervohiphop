'use client';

import { useEffect, useRef, useState } from 'react';
import scrollama from 'scrollama';
import Image from 'next/image';

// GUI-NOTE: Mapbox Storytelling overlay template implementation with Hip Hop styling
const MapboxStorytellingOverlay = ({ 
  selectedTour, 
  onMapMove,
  onChapterChange,
  isVisible = false 
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const scrollerRef = useRef(null);
  const scrollamaInstance = useRef(null);

  // GUI-NOTE: Initialize Scrollama - optimized to prevent multiple initializations
  useEffect(() => {
    if (!selectedTour || !isVisible) {
      // Cleanup if conditions not met
      if (scrollamaInstance.current) {
        scrollamaInstance.current.destroy();
        scrollamaInstance.current = null;
      }
      return;
    }
    
    // Add small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      scrollamaInstance.current = scrollama();

      let lastTriggeredIndex = -1; // GUI-NOTE: Prevent duplicate triggers
      
      scrollamaInstance.current
        .setup({
          step: '.story-step',
          offset: 0.5,
          progress: false
        })
        .onStepEnter(response => {
          const { index, direction } = response;
          
          // GUI-NOTE: Prevent duplicate triggers for same chapter
          if (index === lastTriggeredIndex) {
            console.log('Scrollama: Pulando gatilho duplicado para o capítulo', index);
            return;
          }
          
          lastTriggeredIndex = index;
          const chapter = selectedTour.chapters[index];
          
          setActiveChapter(index);
          
          // Trigger map flyTo with debouncing
          if (onMapMove && chapter && chapter.location) {
            onMapMove({
              longitude: chapter.location.center[0],
              latitude: chapter.location.center[1],
              zoom: chapter.location.zoom || 12,
              bearing: chapter.location.bearing || 0,
              pitch: chapter.location.pitch || 0,
              speed: chapter.location.speed || 1.2
            });
          }
          
          if (onChapterChange) {
            onChapterChange(index);
          }

          // Apply active class (Mapbox template pattern)
          response.element.classList.add('active');
        })
        .onStepExit(response => {
          response.element.classList.remove('active');
        });
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(initTimer);
      if (scrollamaInstance.current) {
        scrollamaInstance.current.destroy();
        scrollamaInstance.current = null;
      }
    };
  }, [selectedTour?.id, isVisible]); // GUI-NOTE: Reduced dependencies to prevent unnecessary re-runs

  if (!selectedTour || !isVisible) return null;

  return (
    <>
      {/* GUI-NOTE: Story overlay container following Mapbox template */}
      <div 
        id="story" 
        className="absolute inset-0 z-20 pointer-events-none"
      >
        {/* Story header */}
        <div className="absolute top-4 left-4 right-4 bg-black/90 backdrop-blur-md border-2 border-yellow-400 rounded-lg p-4 pointer-events-auto">
          <h1 className="font-dirty-stains text-2xl text-theme mb-2">
            {selectedTour.title}
          </h1>
          {selectedTour.subtitle && (
            <p className="font-sometype-mono text-sm text-theme/80">
              {selectedTour.subtitle}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="font-sometype-mono text-xs text-yellow-400 bg-white/10 px-2 py-1 rounded border border-theme/20">
              {activeChapter + 1} de {selectedTour.chapters.length}
            </span>
            {selectedTour.byline && (
              <span className="font-sometype-mono text-xs text-theme/60">
                {selectedTour.byline}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable story content */}
        <div 
          ref={scrollerRef}
          className="h-full overflow-y-auto pointer-events-auto"
          style={{ paddingTop: '140px' }} // Space for header
        >
          {selectedTour.chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className={`story-step transition-all duration-300 min-h-screen flex items-center ${getAlignmentClass(chapter.alignment)}`}
              data-step={index}
            >
              <div className={`max-w-md mx-4 bg-black/95 backdrop-blur-lg border-2 border-theme/20 rounded-lg p-6 shadow-2xl ${getPositionClass(chapter.alignment)}`}>
                {/* Chapter image */}
                {chapter.image && (
                  <div className="mb-4">
                    <Image
                      src={chapter.image}
                      alt={chapter.title || `Capítulo ${index + 1}`}
                      width={400}
                      height={240}
                      className="w-full h-48 object-cover rounded border-2 border-theme/20 shadow-md"
                    />
                  </div>
                )}

                {/* Chapter title */}
                {chapter.title && (
                  <h3 className="font-dirty-stains text-xl mb-4 text-theme">
                    {chapter.title}
                  </h3>
                )}

                {/* Chapter description */}
                {chapter.description && (
                  <div 
                    className="font-sometype-mono text-sm leading-relaxed text-theme/80 mb-4"
                    dangerouslySetInnerHTML={{ __html: chapter.description }}
                  />
                )}

                {/* Location info */}
                {chapter.location && chapter.location.name && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-theme/10 text-theme/60">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">
                      {chapter.location.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* End of story */}
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-black/95 backdrop-blur-lg border-2 border-yellow-400 rounded-lg p-8 mx-4 text-center max-w-md">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="text-yellow-400 text-2xl">🎉</span>
                <span className="text-yellow-400 font-dirty-stains text-xl">
                  Fim da Jornada
                </span>
              </div>
              <p className="text-theme/80 text-sm font-sometype-mono mb-4">
                {selectedTour.footer || 'Explore mais histórias do Hip Hop brasileiro'}
              </p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-yellow-400 text-theme px-4 py-2 rounded font-sometype-mono text-sm hover:bg-yellow-300 transition-colors"
              >
                ↑ Voltar ao início
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GUI-NOTE: Mapbox storytelling styles */}
      <style jsx global>{`
        .story-step {
          opacity: 0.4;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .story-step.active {
          opacity: 1;
        }
        
        .story-step.active > div {
          transform: scale(1.02);
          border-color: rgb(248 231 28 / 0.8);
          box-shadow: 0 0 30px rgb(248 231 28 / 0.3);
        }
        
        /* Hide scrollama debug info */
        .scrollama-debug-offset {
          display: none !important;
        }
      `}</style>
    </>
  );
};

// GUI-NOTE: Get alignment class following Mapbox template pattern
function getAlignmentClass(alignment) {
  switch (alignment) {
    case 'left':
    case 'lefty':
      return 'justify-start';
    case 'right': 
    case 'righty':
      return 'justify-end';
    case 'center':
    case 'centered':
      return 'justify-center';
    case 'full':
    case 'fully':
      return 'justify-center';
    default:
      return 'justify-start';
  }
}

// GUI-NOTE: Get position class for content box
function getPositionClass(alignment) {
  switch (alignment) {
    case 'left':
    case 'lefty':
      return 'mr-auto';
    case 'right': 
    case 'righty':
      return 'ml-auto';
    case 'center':
    case 'centered':
      return 'mx-auto';
    case 'full':
    case 'fully':
      return 'mx-auto w-full max-w-2xl';
    default:
      return 'mr-auto';
  }
}

export default MapboxStorytellingOverlay;
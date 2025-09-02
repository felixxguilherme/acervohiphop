'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import scrollama from 'scrollama';
import Image from 'next/image';

// AIDEV-NOTE: Tour panel using scrollama for Mapbox Storytelling approach with storiesMapboxFormat.js
const TourStoryPanel = ({ 
  isFullscreen, 
  selectedTour, 
  onMapMove,
  onChapterChange,
  currentChapter 
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const scrollerRef = useRef(null);
  const scrollamaInstance = useRef(null);

  // AIDEV-NOTE: Initialize Scrollama for story-driven map navigation - optimized
  useEffect(() => {
    if (!selectedTour || !isFullscreen) {
      // Cleanup if conditions not met
      if (scrollamaInstance.current) {
        console.log('🧹 TourPanel: Cleaning up (conditions not met)');
        scrollamaInstance.current.destroy();
        scrollamaInstance.current = null;
      }
      return;
    }

    // Prevent re-initialization if already exists for same tour
    if (scrollamaInstance.current) {
      console.log('⚠️ TourPanel: Already initialized for tour:', selectedTour.title);
      return;
    }

    console.log('🚀 TourPanel: Initializing for tour:', selectedTour.title);

    // Add small delay to ensure DOM is ready
    const initTimer = setTimeout(() => {
      scrollamaInstance.current = scrollama();

      let lastTriggeredIndex = -1; // AIDEV-NOTE: Prevent duplicate triggers

      scrollamaInstance.current
        .setup({
          step: '.story-step',
          offset: 0.5,
          progress: false
        })
        .onStepEnter(response => {
          const { index } = response;
          
          // AIDEV-NOTE: Prevent duplicate triggers for same chapter
          if (index === lastTriggeredIndex) {
            console.log('⏭️ TourPanel: Skipping duplicate trigger for chapter', index);
            return;
          }
          
          lastTriggeredIndex = index;
          const chapter = selectedTour.chapters[index];
          
          console.log('📍 TourPanel: onStepEnter (once)', {
            chapterIndex: index,
            chapterTitle: chapter?.title,
            timestamp: Date.now()
          });
          
          setActiveChapter(index);
          
          // Trigger map flyTo with Mapbox storytelling pattern
          if (onMapMove && chapter && chapter.location) {
            onMapMove({
              longitude: chapter.location.center[0],
              latitude: chapter.location.center[1],
              zoom: chapter.location.zoom || 12,
              bearing: chapter.location.bearing || 0,
              pitch: chapter.location.pitch || 0,
              speed: chapter.location.speed || 2
            });
          }
          
          if (onChapterChange) {
            onChapterChange(index);
          }

          // Apply active class
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
        console.log('🧹 TourPanel: Cleaning up');
        scrollamaInstance.current.destroy();
        scrollamaInstance.current = null;
      }
    };
  }, [selectedTour?.id, isFullscreen]); // AIDEV-NOTE: Reduced dependencies to prevent unnecessary re-runs

  if (!isFullscreen || !selectedTour) return null;

  return (
    <>
      {/* AIDEV-NOTE: Story panel container */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed right-4 top-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] z-20"
      >
        <div className="h-full bg-black/95 backdrop-blur-lg border-2 border-yellow-400 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/20 flex-shrink-0">
            <h2 className="font-dirty-stains text-xl text-white mb-2">
              {selectedTour.title}
            </h2>
            {selectedTour.subtitle && (
              <p className="text-white/70 text-sm mb-3">
                {selectedTour.subtitle}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-yellow-400 text-xs font-mono bg-white/10 px-2 py-1 rounded border border-white/20">
                {activeChapter + 1} de {selectedTour.chapters.length}
              </span>
              {selectedTour.byline && (
                <span className="text-white/60 text-xs">
                  {selectedTour.byline}
                </span>
              )}
            </div>
          </div>

          {/* Scrollable chapters */}
          <div 
            ref={scrollerRef}
            className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth"
          >
            {selectedTour.chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`story-step transition-all duration-300 ${getAlignmentClass(chapter.alignment)}`}
                data-step={index}
              >
                <div className="p-6">
                  {/* Chapter image */}
                  {chapter.image && (
                    <div className="mb-4">
                      <Image
                        src={chapter.image}
                        alt={chapter.title || `Capítulo ${index + 1}`}
                        width={320}
                        height={200}
                        className="w-full h-40 object-cover rounded border-2 border-white/20 shadow-md"
                      />
                    </div>
                  )}

                  {/* Chapter title */}
                  {chapter.title && (
                    <h3 className="font-dirty-stains text-xl mb-4 text-white">
                      {chapter.title}
                    </h3>
                  )}

                  {/* Chapter description */}
                  {chapter.description && (
                    <div 
                      className="font-sometype-mono text-sm leading-relaxed text-white/80 mb-4"
                      dangerouslySetInnerHTML={{ __html: chapter.description }}
                    />
                  )}

                  {/* Location info */}
                  {chapter.location && chapter.location.name && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-white/60">
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

            {/* End of tour */}
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-6 py-3">
                <span className="text-yellow-400 text-lg">🎉</span>
                <span className="text-yellow-400 font-mono text-sm">
                  Fim da Jornada
                </span>
              </div>
              <p className="text-white/60 text-xs mt-2">
                {selectedTour.footer || 'Explore mais histórias do Hip Hop'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AIDEV-NOTE: Scroll hint */}
      <div className="fixed bottom-8 right-1/2 transform translate-x-1/2 z-30">
        <div className="bg-yellow-400/90 border border-black rounded-lg px-4 py-2 shadow-lg animate-bounce">
          <div className="flex items-center gap-2 text-black">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="font-sometype-mono text-sm font-bold">
              Role para navegar pela história
            </span>
          </div>
        </div>
      </div>

      {/* AIDEV-NOTE: Story step styles */}
      <style jsx global>{`
        .story-step {
          min-height: 400px;
          opacity: 0.6;
          transition: opacity 0.3s ease, background-color 0.3s ease;
        }
        
        .story-step.active {
          opacity: 1;
          background-color: rgba(248, 231, 28, 0.1);
          border-left: 4px solid #f8e71c;
        }
        
        .story-step.centered {
          text-align: center;
        }
        
        .story-step.lefty {
          /* Default left alignment */
        }
        
        .story-step.righty {
          text-align: right;
        }
        
        .story-step.fully {
          width: 100%;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(248, 231, 28, 0.8);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(248, 231, 28, 1);
        }
      `}</style>
    </>
  );
};

// AIDEV-NOTE: Get alignment class following Mapbox template pattern
function getAlignmentClass(alignment) {
  switch (alignment) {
    case 'left':
    case 'lefty':
      return 'lefty';
    case 'right': 
    case 'righty':
      return 'righty';
    case 'center':
    case 'centered':
      return 'centered';
    case 'full':
    case 'fully':
      return 'fully';
    default:
      return 'lefty';
  }
}

export default TourStoryPanel;
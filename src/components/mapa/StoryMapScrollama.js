'use client';

import { useEffect, useRef, useState } from 'react';
import scrollama from 'scrollama';
import Image from 'next/image';

// GUI-NOTE: ScrollyTelling StoryMap using Scrollama library
const StoryMapScrollama = ({ 
  story, 
  onMapMove, 
  onChapterChange, 
  isVisible = false 
}) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const scrollerRef = useRef(null);
  const stepRefs = useRef([]);
  const scrollamaInstance = useRef(null);

  // GUI-NOTE: Initialize Scrollama
  useEffect(() => {
    if (!story || !isVisible) return;

    // Initialize Scrollama
    scrollamaInstance.current = scrollama();

    scrollamaInstance.current
      .setup({
        step: '.scroll-step',
        container: '.scroll-container', 
        graphic: '.scroll-graphic',
        text: '.scroll-text',
        offset: 0.5, // Trigger when step is in middle of viewport
        debug: false
      })
      .onStepEnter(response => {
        const { index, element } = response;
        
        // Update active chapter
        setActiveChapter(index);
        
        // Move map to chapter location
        const chapter = story.chapters[index];
        if (onMapMove && chapter && chapter.location) {
          onMapMove({
            longitude: chapter.location.center[0],
            latitude: chapter.location.center[1],
            zoom: chapter.location.zoom || 12,
            bearing: chapter.location.bearing || 0,
            pitch: chapter.location.pitch || 0
          });
        }
        
        // Notify parent component
        if (onChapterChange) {
          onChapterChange(index);
        }
        
        // Update visual state
        element.classList.add('is-active');
      })
      .onStepExit(response => {
        const { element } = response;
        element.classList.remove('is-active');
      });

    // Cleanup
    return () => {
      if (scrollamaInstance.current) {
        scrollamaInstance.current.destroy();
      }
    };
  }, [story, isVisible, onMapMove, onChapterChange]);

  if (!story || !isVisible) return null;

  return (
    <div className="scroll-container absolute left-4 top-4 bottom-4 w-96 bg-white/95 backdrop-blur-sm border-3 border-theme rounded-lg shadow-xl z-20 overflow-hidden">
      {/* Story Header - Fixed */}
      <div className="p-4 border-b-2 border-theme bg-[#fae523]">
        <h2 className="font-dirty-stains text-2xl text-theme mb-2">
          {story.title}
        </h2>
        {story.subtitle && (
          <p className="font-sometype-mono text-sm text-theme/80">
            {story.subtitle}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-sometype-mono text-xs text-theme bg-white px-2 py-1 rounded border border-theme">
            {activeChapter + 1} de {story.chapters.length}
          </span>
          {story.author && (
            <span className="font-sometype-mono text-xs text-theme/60">
              por {story.author}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        className="scroll-text flex-1 overflow-y-auto scrollbar-thin scrollbar-track-white scrollbar-thumb-[#fae523] scroll-smooth"
        ref={scrollerRef}
      >
        {/* Introduction spacing */}
        <div className="h-32"></div>
        
        {story.chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="scroll-step min-h-[400px] p-6 transition-all duration-300"
            ref={el => stepRefs.current[index] = el}
            data-step={index}
          >
            {/* Chapter Number */}
            <div className="flex items-center mb-4 text-theme/40">
              <div className="chapter-number w-8 h-8 rounded-full border-2 border-theme/20 flex items-center justify-center mr-3 font-sometype-mono text-sm font-bold text-theme/40">
                {index + 1}
              </div>
              <span className="font-sometype-mono text-xs uppercase tracking-wider">
                Capítulo {index + 1}
              </span>
            </div>

            {/* Chapter Image */}
            {chapter.image && (
              <div className="mb-4">
                <Image
                  src={chapter.image}
                  alt={chapter.title || `Capítulo ${index + 1}`}
                  width={320}
                  height={200}
                  className="w-full h-40 object-cover rounded border-2 border-theme shadow-md"
                />
              </div>
            )}

            {/* Chapter Title */}
            {chapter.title && (
              <h3 className="chapter-title font-dirty-stains text-xl mb-4 text-theme/60">
                {chapter.title}
              </h3>
            )}

            {/* Chapter Description */}
            {chapter.description && (
              <div 
                className="chapter-description font-sometype-mono text-sm leading-relaxed mb-4 text-theme/50"
                dangerouslySetInnerHTML={{ __html: chapter.description }}
              />
            )}

            {/* Location Info */}
            {chapter.location && chapter.location.name && (
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-theme/10 text-theme/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-sometype-mono text-xs">
                  {chapter.location.name}
                </span>
              </div>
            )}
          </div>
        ))}
        
        {/* End spacing */}
        <div className="h-32"></div>
      </div>

      {/* Progress Indicator - Fixed at Bottom */}
      <div className="p-3 border-t-2 border-theme bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="font-sometype-mono text-xs text-theme/60">
            Progresso
          </span>
          <span className="font-sometype-mono text-xs text-theme/60">
            {Math.round(((activeChapter + 1) / story.chapters.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-black/10 rounded-full h-1.5">
          <div 
            className="bg-[#fae523] h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((activeChapter + 1) / story.chapters.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-center gap-1 mt-2">
          {story.chapters.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeChapter === index ? 'bg-[#fae523] scale-125' : 'bg-black/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* GUI-NOTE: CSS for active states */}
      <style jsx>{`
        .scroll-step.is-active .chapter-number {
          background-color: #fae523;
          border-color: #000;
          color: #000;
        }
        .scroll-step.is-active .chapter-title {
          color: #000;
        }
        .scroll-step.is-active .chapter-description {
          color: #000;
        }
        .scroll-step.is-active {
          background-color: rgba(250, 229, 35, 0.1);
          border-left: 4px solid #fae523;
        }
      `}</style>
    </div>
  );
};

export default StoryMapScrollama;
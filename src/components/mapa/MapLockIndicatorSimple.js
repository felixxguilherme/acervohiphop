'use client';

import { useState, useEffect } from 'react';

// AIDEV-NOTE: Simple map lock indicator without Framer Motion
const MapLockIndicatorSimple = ({ isVisible = false }) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowIndicator(true);
      setIsAnimating(true);
      
      // Hide after 3 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setShowIndicator(false), 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!showIndicator) return null;

  return (
    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none transition-all duration-300 ${
      isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
    }`}>
      <div className="bg-black/20 backdrop-blur-sm rounded-full p-8">
        <div className="bg-[#fae523] border-2 border-theme rounded-full p-4 shadow-xl animate-pulse">
          <svg className="w-8 h-8 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      
      <div className={`mt-4 text-center transition-all duration-300 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}>
        <div className="bg-black/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-theme/20">
          <p className="font-sometype-mono text-sm text-theme font-bold">
            🔒 Mapa Travado
          </p>
          <p className="font-sometype-mono text-xs text-theme/80">
            Controlado pela história ativa
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapLockIndicatorSimple;
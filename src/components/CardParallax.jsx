'use client'
import Image from 'next/image';
import '../app/parallaxstyle.css'
import { useTransform, motion, useScroll, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import PolaroidCard from './PolaroidPhoto';
import PreloadedBackground from './PreloadedBackground';
import { useTheme } from '@/contexts/ThemeContext';

const CardParallax = ({i, title, description, src, url, link, color, progress, range, targetScale, reference_code, creation_dates, place_access_points, itemTitle, itemDate}) => {

  const { theme } = useTheme();
  const container = useRef(null);
  const [position, setPosition] = useState('sticky');
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale]);
  
  // Detectar quando o efeito parallax terminou e mudar para relative
  useEffect(() => {
    const unsubscribe = progress.on("change", (latest) => {
      // Mudar para relative mais cedo para evitar sobreposição
      if (latest > 0.7) {
        setPosition('relative');
      } else {
        setPosition('sticky');
      }
    });
    
    return () => unsubscribe();
  }, [progress]);
 
  return (
    <motion.div 
      ref={container} 
      className="cardContainer border-solid border-l-3 border-r-3 border-theme"
      style={{
        position: position,
      }}
    >
      <div
        className="card"
        style={{backgroundColor: color, top:`calc(-5vh + ${i * 25}px)`}}
      >
        <h2 className="font-dirty-stains text-theme-primary">{title}</h2>
        <div className="body">
          <div 
            className={`description h-90 pt-6 -mt-6 relative border-2 border-theme ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}
            style={{
              transform: `rotate(${-1 + (i * 0.5)}deg)`,
              transformOrigin: 'center center',
              position: 'relative',
              zIndex: 10 + i,
              boxShadow: `${3 + i}px ${3 + i}px 0px ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'}`,
              willChange: 'transform'
            }}
          >
            <div className="p-6 space-y-4">
              {/* Título do item */}
              {itemTitle && (
                <h3 className={`font-dirty-stains font-bold text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-black'} leading-tight`} style={{ fontFamily: 'var(--font-dirty-stains)' }}>
                  {itemTitle.length > 45 ? `${itemTitle.substring(0, 45)}...` : itemTitle}
                </h3>
              )}
              
              {/* Descrição principal */}
              <p className={`border-theme border-b-3 pb-2 font-sometype-mono text-base md:text-lg leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                {description}
              </p>
              
              {/* Metadados */}
              <div className="space-y-2">
                {place_access_points && place_access_points.length > 0 && (
                  <div className={`font-sometype-mono text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                    <span>{place_access_points[0]}</span>
                  </div>
                )}
                
                {itemDate && (
                  <div className={`font-sometype-mono text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center gap-2`}>
                    <span>{itemDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="imageContainer">
            <motion.div
              className="inner"
              style={{scale: imageScale}}
            >
              <PolaroidCard 
                imageSrc={src.startsWith('http') ? src : (src.startsWith('/') ? src : `/images/${src}`)}
                caption={itemTitle || title}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default CardParallax;
'use client'
import Image from 'next/image';
import '../app/parallaxstyle.css'
import { useTransform, motion, useScroll, useMotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import PolaroidCard from './PolaroidPhoto';
import PreloadedBackground from './PreloadedBackground';

const CardParallax = ({i, title, description, src, url, link, color, progress, range, targetScale, reference_code, creation_dates, place_access_points, itemTitle, itemDate}) => {

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
        position: position
      }}
    >
      <div
        className="card border-black border-3"
        style={{backgroundColor: color, scale, top:`calc(-5vh + ${i * 25}px)`}}
      >
        <h2 className="font-dirty-stains">{title}</h2>
        <div className="body">
          <div className="description">
            <p className="font-sometype-mono">{description}</p>
            
            {/* Metadados específicos da API */}
            {(reference_code || creation_dates || place_access_points || itemTitle || itemDate) && (
              <div className="mt-3 space-y-1 text-sm">
                {itemTitle && (
                  <p className="font-sometype-mono opacity-90 text-sm">
                    <strong className="marca-texto-vermelho">Destaque:</strong> {itemTitle.length > 60 ? `${itemTitle.substring(0, 60)}...` : itemTitle}
                  </p>
                )}
                
                {place_access_points && place_access_points.length > 0 && (
                  <p className="font-sometype-mono opacity-80">
                    <strong>Local:</strong> {place_access_points[0]}
                  </p>
                )}
              </div>
            )}
            
            <span className="mt-4 font-sometype-mono flex items-center gap-2 text-3xl">
              <a href={url || link} target={url ? "_blank" : "_self"}>Explorar</a>
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z" fill="black"/>
              </svg>
            </span>
          </div>

          <div className="imageContainer">
            <motion.div
              className="inner"
              style={{scale: imageScale}}
            >
              <PolaroidCard 
                imageSrc={src.startsWith('http') ? src : (src.startsWith('/') ? src : `/images/${src}`)}
                caption={itemTitle ? (itemTitle.length > 30 ? `${itemTitle.substring(0, 30)}...` : itemTitle) : title}
                tape={{ position: 'top-right', angle: 15 }}
                secondTape={{ position: 'bottom-left', angle: -10 }}
              />
            </motion.div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}

export default CardParallax;
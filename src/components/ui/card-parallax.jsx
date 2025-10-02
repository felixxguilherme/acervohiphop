'use client'
import Image from 'next/image';
import '../app/parallaxstyle.css'
import { useTransform, motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import PolaroidCard from '../PolaroidPhoto';

const CardParallax = ({i, title, description, src, url, link, color, progress, range, targetScale}) => {

  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale]);
 
  return (
    <div ref={container} className="cardContainer border-solid border-l-3 border-b-3 border-r-3 border-theme">
      <motion.div 
        style={{backgroundColor: color, scale, top:`calc(-5vh + ${i * 25}px)`}} 
        className="card"
      >
        <h2 className="font-dirty-stains">{title}</h2>
        <div className="body">
          <div className="description">
            <p className="font-sometype-mono">{description}</p>
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
                imageSrc={src.startsWith('http') ? src : `/images/${src}`}
                caption={title}
                tape={{ position: 'top-right', angle: 15 }}
                secondTape={{ position: 'bottom-left', angle: -10 }}
              />
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}

export default CardParallax;
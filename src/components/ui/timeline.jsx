"use client";;
import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({
  data
}) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full border-t-4 border-b-4 border-theme font-sans md:px-10"
      ref={containerRef}>
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="border-4 border-theme p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-dirty-stains text-2xl md:text-5xl mb-4 text-theme max-w-4xl font-black uppercase tracking-wide">
            TIMELINE DO HIP HOP DF
          </h2>
          <div className="bg-yellow-200 border-2 border-theme p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-sometype-mono text-theme text-sm md:text-base max-w-2xl font-bold leading-tight">
              A EVOLUÇÃO DA CULTURA HIP HOP NO DISTRITO FEDERAL AO LONGO DAS DÉCADAS
            </p>
          </div>
        </div>
      </div>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-40 md:gap-10">
            <div
              className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div
                className="h-12 absolute left-2 md:left-2 w-12 border-4 border-theme flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="h-6 w-6 bg-black border-2 border-theme" />
              </div>
              <h3
                className="hidden md:block text-2xl md:pl-20 md:text-6xl font-black text-theme bg-white/90 border-4 border-theme px-6 py-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3
                className="md:hidden block text-3xl mb-6 text-left font-black text-theme bg-yellow-400 border-4 border-theme px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
                {item.title}
              </h3>
              <div className="bg-white/80 border-4 border-theme p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-1 bg-black border-2 border-theme shadow-[2px_0px_0px_0px_rgba(0,0,0,1)]">
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-1 bg-yellow-400 border border-theme" />
        </div>
      </div>
    </div>
  );
};

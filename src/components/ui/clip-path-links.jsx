import React from "react";
import { MapPinPlus, Contrast, BookOpenText, Film, BookType } from "lucide-react";
import { useAnimate } from "motion/react";
import { NumberTicker } from "../magicui/number-ticker";

export const ClipPathLinks = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6 p-4">
      <LinkBox
        Icon={MapPinPlus}
        description={
          <div className="flex flex-col">

            <span className="font-scratchy text-2xl text-black">
              + de
              <NumberTicker className="font-scratchy text-4xl" value={50} />
              batalhas mapeadas
            </span>
          </div>
        }
      />
      <LinkBox 
        Icon={BookOpenText}
        description={
          <div className="flex flex-col">
            <span className="font-scratchy text-2xl text-black">
              + de
              <NumberTicker className="font-scratchy text-4xl" value={100} />
              histórias catalogadas
            </span>
          </div>
        }
      />
      <LinkBox 
        Icon={Film}
        description={
          <div className="flex flex-col">
            <span className="font-scratchy text-2xl text-black">
              Acervo multimídia
            </span>
          </div>
        }
      />
      <LinkBox 
        Icon={BookType}
        description={
           <div className="flex flex-col">
            <span className="font-scratchy text-2xl text-black">
              Revista, entrevistas e mais
            </span>
          </div>
        }
      />
    </div>
  );
};

const NO_CLIP = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

const ENTRANCE_KEYFRAMES = {
  left: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right: [TOP_LEFT_CLIP, NO_CLIP],
};

const EXIT_KEYFRAMES = {
  left: [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top: [NO_CLIP, TOP_RIGHT_CLIP],
  right: [NO_CLIP, BOTTOM_LEFT_CLIP],
};

const LinkBox = ({ Icon, href, imgSrc, className, title, description }) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e) => {
    const box = e.target.getBoundingClientRect();
    const proximityToLeft = {
      proximity: Math.abs(box.left - e.clientX),
      side: "left",
    };
    const proximityToRight = {
      proximity: Math.abs(box.right - e.clientX),
      side: "right",
    };
    const proximityToTop = {
      proximity: Math.abs(box.top - e.clientY),
      side: "top",
    };
    const proximityToBottom = {
      proximity: Math.abs(box.bottom - e.clientY),
      side: "bottom",
    };
    const sortedProximity = [
      proximityToLeft,
      proximityToRight,
      proximityToTop,
      proximityToBottom,
    ].sort((a, b) => a.proximity - b.proximity);
    return sortedProximity[0].side;
  };

  const handleMouseEnter = (e) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: ENTRANCE_KEYFRAMES[side],
    });
  };

  const handleMouseLeave = (e) => {
    const side = getNearestSide(e);
    animate(scope.current, {
      clipPath: EXIT_KEYFRAMES[side],
    });
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer grid w-full h-64 place-content-center bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 p-6 overflow-hidden group">
      
      {/* Conteúdo principal - Brutalista */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 relative z-10">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="custom icon"
            className={className ?? "max-h-16 object-contain border-2 border-black"} 
          />
        ) : (
          <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Icon className="text-2xl text-black" />
          </div>
        )}
        
        {/* Texto - Brutalista */}
        {title && (
          <h3 className="text-sm font-black break-words text-black bg-yellow-400 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
            {title}
          </h3>
        )}
        {description && (
          <div className="text-xs text-black break-words font-bold bg-white/80 p-2 border-2 border-black max-w-[200px]">
            {description}
          </div>
        )}
      </div>

      {/* Overlay de hover - Brutalista */}
      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-black text-white transition-colors duration-300 p-6 border-4 border-white">
        
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="custom icon hover"
              className={className ?? "max-h-16 object-contain filter brightness-0 invert border-2 border-white"} 
            />
          ) : (
            <div className="w-16 h-16 bg-yellow-400 border-4 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <Icon className="text-2xl text-black" />
            </div>
          )}
          
          {/* Texto no hover - Brutalista */}
          {title && (
            <h3 className="text-sm font-black break-words bg-yellow-400 text-black px-3 py-1 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] uppercase">
              {title}
            </h3>
          )}
          {description && (
            <div className="text-xs font-bold break-words text-white bg-white/20 p-2 border-2 border-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] max-w-[200px]">
              {description}
            </div>
          )}
        </div>
      </div>
    </a>
  );
};
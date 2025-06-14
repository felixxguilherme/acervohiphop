import React from "react";
import { MapPinPlus, Contrast, BookOpenText, Film, BookType } from "lucide-react";
import { useAnimate } from "motion/react";
import { NumberTicker } from "../magicui/number-ticker";

export const ClipPathLinks = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      <LinkBox
        Icon={MapPinPlus}
        description={
          <div className="flex flex-col">
            <div>
              <span className="font-scratchy text-7xl text-black">+ de </span>
              <NumberTicker className="font-scratchy text-8xl" value={50} />
            </div>
              <span className="font-scratchy text-4xl text-black">batalhas mapeadas</span>
          </div>
        }
      />
      <LinkBox 
        Icon={BookOpenText}
        description={
          <div className="flex flex-col">
            <div>
              <span className="font-scratchy text-7xl text-black">+ de </span>
              <NumberTicker className="font-scratchy text-8xl" value={100} />
            </div>
              <span className="font-scratchy text-4xl text-black">histórias</span>
          </div>
        }
      />
      <LinkBox 
        Icon={Film}
        description={
          <div className="flex flex-col">
            <div>
              <span className="font-scratchy text-5xl text-black">Acervo</span>
            </div>
              <span className="font-scratchy text-4xl text-black">multi-media</span>
          </div>
        }
      />
      <LinkBox 
        Icon={BookType} 
        title="Marketing" 
        description={
          <div className="flex flex-col">
            <div>
              <span className="font-scratchy text-5xl text-black">Revista</span>
            </div>
              <span className="font-scratchy text-4xl text-black">entrevistas e mais</span>
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
      className="h-64 relative cursor-pointer grid h-32 w-full place-content-center border-2 border-black rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 overflow-hidden group">
      
      {/* Conteúdo principal */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 relative z-10">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="custom icon"
            className={className ?? "max-h-20 sm:max-h-20 md:max-h-20 object-contain"} 
          />
        ) : (
          <Icon className="text-lg sm:text-xl md:text-2xl text-gray-700" />
        )}
        
        {/* Texto */}
        {title && (
          <h3 className="text-xs sm:text-sm md:text-base font-semibold break-words text-gray-900">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-xs sm:text-xs md:text-sm text-gray-600 break-words">
            {description}
          </p>
        )}
      </div>

      {/* Overlay de hover */}
      <div
        ref={scope}
        style={{ clipPath: BOTTOM_RIGHT_CLIP }}
        className="absolute inset-0 grid place-content-center bg-gradient-to-br from-[#FAF9F6] to-black-100  text-white transition-colors duration-300 p-4">
        
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt="custom icon hover"
              className={className ?? "max-h-6 sm:max-h-8 md:max-h-10 object-contain filter brightness-0 invert"} 
            />
          ) : (
            <Icon className="text-lg sm:text-xl md:text-2xl text-white" />
          )}
          
          {/* Texto no hover */}
          {title && (
            <h3 className="text-xs sm:text-sm md:text-base font-semibold break-words text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-xs sm:text-xs md:text-sm opacity-90 break-words text-white">
              {description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
};
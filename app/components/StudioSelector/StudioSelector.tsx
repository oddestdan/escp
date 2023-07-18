import { useEffect, useRef, useState } from "react";
import type { StudioInfo } from "../BookingStep/Steps/StudioStep";

export interface StudioSelectorProps {
  studiosData: StudioInfo[];
  selectedStudioIndex: number;
  onSaveStudio: (i: number) => void;
  highlightable?: boolean;
}

const fadeInOutAnimation = "fadeInOut 4000ms ease-in-out infinite";

export const StudioSelector: React.FC<StudioSelectorProps> = ({
  studiosData,
  selectedStudioIndex,
  onSaveStudio,
  highlightable = false,
}) => {
  const [isAltImage, setIsAltImage] = useState(false);
  const overlayRef1 = useRef<HTMLDivElement>(null);
  const overlayRef2 = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<Date>();

  useEffect(() => {
    setStart(new Date());
  }, []);

  useEffect(() => {
    if (!overlayRef1.current || !overlayRef2.current) return;

    setTimeout(() => {
      if (!overlayRef1.current || !overlayRef2.current) return;

      overlayRef1.current.style.animation = fadeInOutAnimation;
      overlayRef2.current.style.animation = fadeInOutAnimation;
    }, 0);
    const intervalId = setInterval(() => {
      // console.log(`${new Date().getSeconds() - (start?.getSeconds() || 0)}`);

      setIsAltImage((prev) => !prev);
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, [start]);

  return (
    <div className="my-4 flex flex-col">
      <div className="flex w-full flex-col justify-between lg:flex-row lg:gap-4">
        {studiosData.map((studio, i) => {
          const isSelected = selectedStudioIndex === i;
          return (
            <div
              key={studio.name}
              onClick={() => onSaveStudio(i)}
              className={`flex w-full flex-1 flex-col items-center text-stone-900 ${
                isSelected ? "opacity-100" : ""
              }`}
            >
              <div
                className={`relative flex w-full items-center justify-center text-transparent transition-all duration-200 ease-in-out ${
                  isSelected && !highlightable
                    ? ""
                    : "hover:text-white hover:[text-shadow:0px_0px_10px_rgba(0,0,0,0.5)]"
                }`}
              >
                <span className="relative w-full">
                  <img
                    className={`mb-1 aspect-[3/2] w-full border-b-2 border-transparent ${
                      isSelected || highlightable
                        ? "border-stone-900 bg-stone-400"
                        : "bg-stone-200 opacity-30 hover:opacity-80"
                    } ${highlightable || !isSelected ? "cursor-pointer" : ""}`}
                    src={isAltImage ? studio.altImg : studio.img}
                    alt={`Studio ${i}: ${studio.name}`}
                  />
                  <div
                    ref={i === 0 ? overlayRef1 : overlayRef2}
                    className={`pointer-events-none absolute top-0 left-0 h-full w-full bg-white`}
                  >
                    {/* White overlapping layer */}
                  </div>
                </span>
                <p
                  className={`pointer-events-none absolute cursor-pointer text-9xl font-light `}
                >
                  {studio.name[studio.name.length - 1]}
                </p>
              </div>
              <span
                className={`mx-auto mb-4 text-center ${
                  isSelected ? "underline underline-offset-2" : ""
                }`}
              >
                {studio.name}
                <br />
                {studio.area} м²
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

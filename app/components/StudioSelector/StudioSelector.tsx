import { useEffect, useState } from "react";
import type { StudioInfo } from "../BookingStep/Steps/StudioStep";
// import Slider from "react-slick";

export interface StudioSelectorProps {
  studiosData: StudioInfo[];
  selectedStudioIndex: number;
  onSaveStudio: (i: number) => void;
  highlightable?: boolean;
  vertical?: boolean;
}

// const sliderSettings = {
//   dots: true,
//   arrows: false,
//   infinite: false,
//   slidesToShow: 1.25,
//   slidesToScroll: 1.25,
//   focusOnSelect: true,
// };

// const fadeInOutAnimation = "fadeInOut 4000ms ease-in-out infinite";

export const StudioSelector: React.FC<StudioSelectorProps> = ({
  studiosData,
  selectedStudioIndex,
  onSaveStudio,
  highlightable = false,
  vertical = false,
}) => {
  const [isAltImage, setIsAltImage] = useState(false);
  const [start, setStart] = useState<Date>();
  const [animationClasses, setAnimationClasses] = useState("");

  useEffect(() => {
    setStart(new Date());
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimationClasses("animate-fadeInOut"), 0);
    const intervalId = setInterval(() => setIsAltImage((prev) => !prev), 4000);
    return () => {
      clearInterval(intervalId);
    };
  }, [start]);

  return (
    <div className="mt-4 mb-12 flex flex-col">
      <div
        className={`flex w-full justify-between ${
          vertical ? "flex-col lg:flex-row lg:gap-4" : "flex-row gap-2"
        }`}
      >
        {/* <Slider
        className={`studio-selector-slider`}
        {...sliderSettings}
        initialSlide={0}
      > */}
        {studiosData.map((studio, i) => {
          const isSelected = selectedStudioIndex === i;
          return (
            <div
              key={studio.name}
              onClick={() => onSaveStudio(i)}
              className={`flex flex-1 flex-col items-center text-stone-900 ${
                isSelected ? "opacity-100" : ""
              } ${vertical ? "mb-4" : ""}`}
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
                    className={`aspect-[3/2] w-full border-b-2 border-transparent object-cover lg:aspect-[3/2] ${
                      isSelected || highlightable
                        ? "border-b-stone-800 bg-stone-400"
                        : "bg-stone-200 opacity-30 hover:border-b-stone-800 hover:opacity-80"
                    } ${highlightable || !isSelected ? "cursor-pointer" : ""}`}
                    src={isAltImage ? studio.lowres.altImg : studio.lowres.img}
                    alt={`Studio ${i}: ${studio.name}`}
                  />
                  <div
                    className={`pointer-events-none absolute top-[-1px] left-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] bg-white ${animationClasses}`}
                  >
                    {/* White overlapping layer */}
                  </div>
                </span>
                <p
                  className={`pointer-events-none absolute cursor-pointer text-6xl font-light lg:text-9xl `}
                >
                  {studio.name[studio.name.length - 1]}
                </p>
              </div>
              <span
                className={`mx-auto mt-2 inline-flex justify-center text-center ${
                  isSelected ? "underline underline-offset-2" : ""
                }`}
              >
                {studio.name} | {studio.area} м²
              </span>
            </div>
          );
        })}
        {/* </Slider> */}
      </div>
    </div>
  );
};

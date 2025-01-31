import { useEffect, useState } from "react";
import type { StudioInfo } from "../BookingStep/Steps/StudioStep";
import ReactImageGallery from "react-image-gallery";
import { studiosImages } from "~/utils/studiosData";
// import Slider from "react-slick";

export interface StudioSelectorProps {
  studiosData: StudioInfo[];
  selectedStudioIndex: number;
  onSaveStudio: (i: number) => void;
  highlightable?: boolean;
  tileOnly?: boolean;
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
  tileOnly = false,
}) => {
  const [isAltImage, setIsAltImage] = useState(false);
  const [start, setStart] = useState<Date>();
  const [animationClasses, setAnimationClasses] = useState("");

  const selectedStudioImages = studiosImages[selectedStudioIndex];

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
    <div className="mb-4 flex flex-col md:mb-12">
      <div
        className={`w-full ${
          tileOnly
            ? "flex flex-col xl:flex-row xl:gap-4"
            : "grid grid-cols-3 gap-4"
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
              className={`mb-4 flex flex-1 flex-col items-center text-stone-900 ${
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
                <div className="relative w-full">
                  <img
                    className={`aspect-[3/2] w-full bg-transparent object-cover outline outline-offset-2 xl:aspect-[3/2] ${
                      highlightable ? "" : "opacity-30  hover:opacity-80"
                    } ${
                      isSelected
                        ? "outline-stone-800"
                        : "outline-transparent hover:outline-stone-800"
                    } ${highlightable || !isSelected ? "cursor-pointer" : ""}`}
                    src={isAltImage ? studio.lowres.altImg : studio.lowres.img}
                    alt={`Studio ${i}: ${studio.name}`}
                  />
                  {/* White overlapping layer */}
                  <div
                    className={`pointer-events-none absolute top-[-1px] left-[-1px] h-[calc(100%+2px)] w-[calc(100%+2px)] bg-white ${animationClasses}`}
                  />
                </div>
                <p
                  className={`pointer-events-none absolute cursor-pointer text-6xl font-light xl:text-9xl `}
                >
                  {studio.name[studio.name.length - 1]}
                </p>
              </div>
              <span
                className={`mx-auto mt-1 inline-flex justify-center text-center md:mt-2 ${
                  isSelected ? "font-semibold" : ""
                  // isSelected ? "underline underline-offset-2" : ""
                } ${tileOnly ? "text-base" : "text-sm"}`}
              >
                {tileOnly ? studio.name : studio.shortName}
                {tileOnly ? " | " : " "}
                {studio.area}м²
              </span>
            </div>
          );
        })}
        {/* </Slider> */}
      </div>
      {selectedStudioImages && !tileOnly && (
        <div className="w-full xl:w-2/3 xl:pl-4">
          <ReactImageGallery
            items={selectedStudioImages.map(([high /*, low*/]) => ({
              original: high,
              // thumbnail: low,
            }))}
            lazyLoad
            showPlayButton={false}
            slideDuration={200}
          />
          {/* <img
            className={`aspect-[3/2] w-full bg-transparent object-cover xl:aspect-[3/2]`}
            src={
              isAltImage
                ? selectedStudio.lowres.altImg
                : selectedStudio.lowres.img
            }
            alt={`Studio ${selectedStudioIndex}: ${selectedStudio.name}`}
          /> */}
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from "react";
import type { StudioInfo } from "../BookingStep/Steps/StudioStep";

export interface StudioSelectorProps {
  studiosData: StudioInfo[];
  selectedStudioIndex: number;
  onSaveStudio: (i: number) => void;
  highlightable?: boolean;
}

export const StudioSelector: React.FC<StudioSelectorProps> = ({
  studiosData,
  selectedStudioIndex,
  onSaveStudio,
  highlightable = true,
}) => {
  const [isAltImage, setIsAltImage] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsAltImage((prev) => !prev);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="my-4 flex flex-col">
      <div className="flex flex-col justify-between lg:flex-row lg:gap-4">
        {studiosData.map((studio, i) => {
          const isSelected = selectedStudioIndex === i && highlightable;
          return (
            <div
              key={studio.name}
              onClick={() => onSaveStudio(i)}
              className={`flex w-full flex-1 flex-col items-center text-stone-900 ${
                isSelected ? "opacity-100" : ""
              }`}
            >
              <div
                className={`relative flex items-center justify-center text-transparent transition-all duration-200 ease-in-out ${
                  isSelected
                    ? ""
                    : "hover:text-white hover:[text-shadow:0px_0px_10px_rgba(0,0,0,0.15)]"
                }`}
              >
                <img
                  className={`mb-1 aspect-[3/2] w-full border-b-2 border-transparent transition-opacity duration-200 ${
                    isSelected
                      ? "border-stone-900 bg-stone-400"
                      : "cursor-pointer bg-stone-200 opacity-30 hover:opacity-70"
                  }`}
                  src={isAltImage ? studio.altImg : studio.img}
                  alt={`Studio ${i}: ${studio.name}`}
                />
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

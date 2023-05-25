import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveCurrentStep, saveStudio } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

import imageSrcStudio1 from "../../../../public/images/highq/4.jpg";
import imageSrcStudio2 from "../../../../public/images/highq/7.jpg";

import type { StoreBooking } from "~/store/bookingSlice";
import { useSearchParams } from "@remix-run/react";
import { STUDIO_ID_QS } from "~/utils/constants";

export interface StudioInfo {
  img: string;
  name: string;
  area: number;
}

export const studiosData: StudioInfo[] = [
  { img: imageSrcStudio1, name: "room 1", area: 90 },
  { img: imageSrcStudio2, name: "room 2", area: 90 },
];

export const StudioStep: React.FC<{ isMobile?: boolean }> = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const studioIdQS = searchParams.get(STUDIO_ID_QS);

  useEffect(() => {
    if (studioIdQS) {
      dispatch(saveStudio(+studioIdQS));
    }
  }, [dispatch, studioIdQS]);

  const { currentStep, studio } = useSelector(
    (store: StoreBooking) => store.booking
  );

  const selectedStudioIndex = studiosData.findIndex(
    (st) => st.name === studio.name
  );

  const onSaveStudio = useCallback(
    (studioIndex: number) => {
      if (
        studiosData.findIndex((s) => s.name === studio.name) === studioIndex
      ) {
        return;
      }

      searchParams.set(STUDIO_ID_QS, `${studioIndex}`);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams, studio]
  );
  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);

  return (
    <>
      <h4 className="mb-2 text-center font-mono font-medium">
        зал: {studio.name}
      </h4>

      <div className="my-4 flex flex-col">
        <div className="flex flex-col justify-between lg:flex-row lg:gap-4">
          {studiosData.map((studio, i) => {
            const isSelected = selectedStudioIndex === i;
            return (
              <div
                key={studio.img}
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
                    src={studio.img}
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
      <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
    </>
  );
};

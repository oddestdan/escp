import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initialState,
  saveCurrentStep,
  saveDate,
  saveStudio,
  saveTime,
} from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import { useSearchParams } from "@remix-run/react";
import { STUDIO_ID_QS } from "~/utils/constants";

import type { StoreBooking } from "~/store/bookingSlice";
import { StudioSelector } from "~/components/StudioSelector/StudioSelector";
import { studiosData } from "~/utils/studiosData";

type imageSet = {
  img: string;
  altImg: string;
};

export interface StudioInfo {
  img: string;
  name: string;
  shortName: string;
  area: number;
  altImg: string;
  lowres: imageSet;
}

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
    (st) => st.name === studio?.name
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

      dispatch(saveDate(initialState.dateTime.date));
      dispatch(saveTime(initialState.dateTime.time));
    },
    [searchParams, setSearchParams, studio, dispatch]
  );
  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);

  return (
    <>
      <h4 className="mb-4 text-center font-medium md:mb-6">
        зал: {studio.name}
      </h4>

      <StudioSelector
        studiosData={studiosData}
        selectedStudioIndex={selectedStudioIndex}
        onSaveStudio={onSaveStudio}
      />
      <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
    </>
  );
};

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveCurrentStep, saveStudio } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import { useSearchParams } from "@remix-run/react";
import { STUDIO_ID_QS } from "~/utils/constants";

import imageSrcStudio1Front from "../../../../public/images/highq/r1/1.jpg";
import imageSrcStudio1Back from "../../../../public/images/highq/r1/2.jpg";
import imageSrcStudio2Front from "../../../../public/images/highq/r2/1.jpg";
import imageSrcStudio2Back from "../../../../public/images/highq/r2/2.jpg";

import imageSrcStudio1FrontLowres from "../../../../public/images/lowres/r1 (1).jpg";
import imageSrcStudio1BackLowres from "../../../../public/images/lowres/r1 (2).jpg";
import imageSrcStudio2FrontLowres from "../../../../public/images/lowres/r2 (1).jpg";
import imageSrcStudio2BackLowres from "../../../../public/images/lowres/r2 (2).jpg";

import type { StoreBooking } from "~/store/bookingSlice";
import { StudioSelector } from "~/components/StudioSelector/StudioSelector";

type imageSet = {
  img: string;
  altImg: string;
};

export interface StudioInfo {
  img: string;
  name: string;
  area: number;
  altImg: string;
  lowres: imageSet;
}

export const studiosData: StudioInfo[] = [
  {
    img: imageSrcStudio1Front,
    name: "room 1",
    area: 90,
    altImg: imageSrcStudio1Back,
    lowres: {
      img: imageSrcStudio1FrontLowres,
      altImg: imageSrcStudio1BackLowres,
    },
  },
  {
    img: imageSrcStudio2Front,
    name: "room 2",
    area: 90,
    altImg: imageSrcStudio2Back,
    lowres: {
      img: imageSrcStudio2FrontLowres,
      altImg: imageSrcStudio2BackLowres,
    },
  },
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

      <StudioSelector
        studiosData={studiosData}
        selectedStudioIndex={selectedStudioIndex}
        onSaveStudio={onSaveStudio}
      />
      <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
    </>
  );
};

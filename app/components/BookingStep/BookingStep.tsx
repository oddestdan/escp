import { useDispatch, useSelector } from "react-redux";
import {
  BookingStep,
  saveDate,
  saveTime,
  saveTotalPrice,
} from "~/store/bookingSlice";
import { DateTimeStep } from "./Steps/DateTimeStep";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ServicesStep } from "./Steps/ServicesStep";
import { ContactInfoStep } from "./Steps/ContactInfoStep";
import { getIsMobile } from "~/utils/breakpoints";
import { PaymentStep } from "./Steps/PaymentStep";
import { BOOKING_HOURLY_PRICE } from "~/utils/constants";

import type { StoreBooking } from "~/store/bookingSlice";
import { StudioStep } from "./Steps/StudioStep";

export function WithActiveStepHOC<T>(
  Component: React.ComponentType<T>,
  [activeStep, validStep]: [BookingStep, BookingStep]
): React.FC<T> {
  return function WithActiveStepInner(props: T): React.ReactElement | null {
    // @ts-ignore
    return activeStep === validStep ? <Component {...props} /> : null;
  };
}

const ActiveBookingStep: React.FC = () => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((store: StoreBooking) => store.booking);

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  const onChangeDate = useCallback(
    (date: string) => {
      dispatch(saveDate(date));
    },
    [dispatch]
  );

  const onChangeTime = useCallback(
    (start: string, end: string, diff: number) => {
      dispatch(saveTime({ start, end, diff }));
      dispatch(
        saveTotalPrice({
          booking: Math.abs(diff) * BOOKING_HOURLY_PRICE,
        })
      );
    },
    [dispatch]
  );

  const MemoedStudioStep = useMemo(
    () => WithActiveStepHOC(StudioStep, [currentStep, BookingStep.Studio]),
    [currentStep]
  );
  const MemoedDateTimeStep = useMemo(
    () => WithActiveStepHOC(DateTimeStep, [currentStep, BookingStep.DateTime]),
    [currentStep]
  );
  const MemoedServicesStep = useMemo(
    () => WithActiveStepHOC(ServicesStep, [currentStep, BookingStep.Services]),
    [currentStep]
  );
  const MemoedContactInfoStep = useMemo(
    () =>
      WithActiveStepHOC(ContactInfoStep, [
        currentStep,
        BookingStep.ContactInfo,
      ]),
    [currentStep]
  );
  const MemoedPaymentStep = useMemo(
    () => WithActiveStepHOC(PaymentStep, [currentStep, BookingStep.Payment]),
    [currentStep]
  );

  return (
    <>
      <MemoedStudioStep isMobile={isMobile} />
      <MemoedDateTimeStep
        onChangeDate={onChangeDate}
        onChangeTime={onChangeTime}
        isMobile={isMobile}
      />
      <MemoedServicesStep isMobile={isMobile} />
      <MemoedContactInfoStep isMobile={isMobile} />
      <MemoedPaymentStep isMobile={isMobile} />
    </>
  );
};

export default ActiveBookingStep;

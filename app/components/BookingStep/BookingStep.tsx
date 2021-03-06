import { useDispatch, useSelector } from "react-redux";
import { BookingStep, saveDate, saveTime } from "~/store/bookingSlice";
import type { StoreBooking } from "~/store/bookingSlice";
import { DateTimeStep } from "./Steps/DateTimeStep";
import type { Appointment } from "~/models/appointment.server";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ServicesStep } from "./Steps/ServicesStep";
import { ContactInfoStep } from "./Steps/ContactInfoStep";
import { getIsMobile } from "~/utils/breakpoints";
import { PaymentStep } from "./Steps/PaymentStep";

export function WithActiveStepHOC<T>(
  Component: React.ComponentType<T>,
  [activeStep, validStep]: [BookingStep, BookingStep]
): React.FC<T> {
  return function WithActiveStepInner(props: T): React.ReactElement | null {
    return activeStep === validStep ? <Component {...props} /> : null;
  };
}

export interface ActiveBookingStepProps {
  appointments: Appointment[];
}

const ActiveBookingStep: React.FC<ActiveBookingStepProps> = ({
  appointments,
}) => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((store: StoreBooking) => store.booking);

  const [isMobile, setIsMobile] = useState(false);
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
    },
    [dispatch]
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
      <MemoedDateTimeStep
        appointments={appointments}
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

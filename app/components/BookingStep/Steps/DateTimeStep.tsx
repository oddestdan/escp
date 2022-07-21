import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "~/components/DatePicker/DatePicker";
import TimePicker from "~/components/TimePicker/TimePicker";
import type { DateSlot, StoreBooking } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";

export interface DateTimeStepProps {
  selectedDate: string;
  slots: DateSlot[];
  memoedTimeSlots: string[];
  onChangeDate: (date: string) => void;
  onChangeTime: (start: string, end: string, diff: number) => void;
  isMobile?: boolean;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  selectedDate,
  slots,
  memoedTimeSlots,
  onChangeDate,
  onChangeTime,
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const { currentStep } = useSelector((store: StoreBooking) => store.booking);

  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);

  return (
    <>
      <DatePicker
        selectedDate={selectedDate}
        dateTimeSlots={slots}
        onChangeDate={onChangeDate}
      />
      <TimePicker
        selectedDate={selectedDate}
        timeSlots={memoedTimeSlots}
        onChangeTime={onChangeTime}
        isMobile={isMobile}
      />
      <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
    </>
  );
};

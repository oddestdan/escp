import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "~/components/DatePicker/DatePicker";
import TimePicker from "~/components/TimePicker/TimePicker";
import type { Appointment } from "~/models/appointment.server";
import type { StoreBooking } from "~/store/bookingSlice";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import { generateTimeSlots } from "~/utils/slots";

export interface DateTimeStepProps {
  appointments: Appointment[];
  onChangeDate: (date: string) => void;
  onChangeTime: (start: string, end: string, diff: number) => void;
  isMobile?: boolean;
}

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  appointments,
  onChangeDate,
  onChangeTime,
  isMobile = false,
}) => {
  const dispatch = useDispatch();
  const {
    currentStep,
    dateTime: { date: selectedDate, time: selectedTime, slots },
  } = useSelector((store: StoreBooking) => store.booking);

  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);

  const memoedTimeSlots = useMemo(() => {
    const todaysSlots =
      slots.find(({ date }) => date === selectedDate)?.availableTimeSlots || [];
    const todaysAppointments =
      appointments.filter(({ date }) => date === selectedDate) || [];

    const takenSlots = todaysAppointments.map((app) => {
      const timeFromArr = app.timeFrom.split("T")[1].split(":");
      const timeToArr = app.timeTo.split("T")[1].split(":");
      return generateTimeSlots(
        new Date(selectedDate),
        Number(timeFromArr[0]) + (timeFromArr[1] == "30" ? 0.5 : 0),
        Number(timeToArr[0]) + (timeToArr[1] == "30" ? 0.5 : 0)
      );
    });

    return todaysSlots.filter(
      (slot) => !takenSlots.flat().find((taken) => taken === slot)
    );
  }, [slots, selectedDate, appointments]);

  return (
    <>
      <DatePicker
        selectedDate={selectedDate}
        dateTimeSlots={slots}
        onChangeDate={onChangeDate}
      />
      <TimePicker
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        timeSlots={memoedTimeSlots}
        onChangeTime={onChangeTime}
        isMobile={isMobile}
      />
      <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
    </>
  );
};

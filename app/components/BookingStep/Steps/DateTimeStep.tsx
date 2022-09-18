import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "~/components/DatePicker/DatePicker";
import TimePicker from "~/components/TimePicker/TimePicker";
import { saveCurrentStep } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import { generateTimeSlots } from "~/utils/slots";

import type { DateSlot, StoreBooking } from "~/store/bookingSlice";
import type { Appointment } from "~/models/appointment.server";

export interface DateTimeStepProps {
  appointments: Appointment[];
  onChangeDate: (date: string) => void;
  onChangeTime: (start: string, end: string, diff: number) => void;
  isMobile?: boolean;
}

export interface BookableTimeSlot {
  slot: string;
  isBooked: boolean;
  isConfirmed: boolean;
}

const mapAppointmentsToSlots = (
  appointments: Appointment[],
  date: string
): BookableTimeSlot[][] => {
  return appointments.map((app) => {
    const timeFromArr = app.timeFrom.split("T")[1].split(":");
    const timeToArr = app.timeTo.split("T")[1].split(":");
    return generateTimeSlots(
      new Date(date),
      Number(timeFromArr[0]) + (timeFromArr[1] == "30" ? 0.5 : 0),
      Number(timeToArr[0]) + (timeToArr[1] == "30" ? 0.5 : 0)
    ).map((slot) => ({ slot, isConfirmed: app.confirmed, isBooked: true }));
  });
};

const formAvailableSlots = (
  slots: DateSlot[],
  appointments: Appointment[],
  selectedDate: string
): BookableTimeSlot[] => {
  // all appointments for a day
  const todaysAppointments =
    appointments.filter(
      ({ date, timeFrom, timeTo }) =>
        timeFrom && timeTo && date === selectedDate
    ) || [];

  // all appointments' time slots for a day
  const bookedSlots = mapAppointmentsToSlots(
    todaysAppointments,
    selectedDate
  ).flat();

  // all slots for a day
  const selectedDateSlots =
    slots.find(({ date }) => date === selectedDate)?.availableTimeSlots || [];

  return selectedDateSlots
    .map((slot) => ({
      slot,
      isBooked: Boolean(
        bookedSlots.find((bookedSlot) => bookedSlot.slot === slot)?.isBooked
      ),
      isConfirmed: Boolean(
        bookedSlots.find((bookedSlot) => bookedSlot.slot === slot)?.isConfirmed
      ),
    }))
    .filter((slot) => !slot.isConfirmed);
};

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
    price,
  } = useSelector((store: StoreBooking) => store.booking);

  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);

  const memoedTimeSlots = useMemo(() => {
    return formAvailableSlots(slots, appointments, selectedDate);
  }, [slots, appointments, selectedDate]);

  return (
    <>
      <DatePicker
        selectedDate={selectedDate}
        dateTimeSlots={slots}
        onChangeDate={onChangeDate}
      />
      <TimePicker
        selectedTime={selectedTime}
        timeSlots={memoedTimeSlots}
        total={price.booking}
        onChangeTime={onChangeTime}
        isMobile={isMobile}
      />
      <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
    </>
  );
};

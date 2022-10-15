import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import DatePicker from "~/components/DatePicker/DatePicker";
import { saveCurrentStep, saveDate } from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import { generateTimeSlots } from "~/utils/slots";

import type { DateSlot, StoreBooking, TimeState } from "~/store/bookingSlice";
import type { Appointment } from "~/models/appointment.server";
import TimePickerTable from "~/components/TimePickerTable/TimePickerTable";
import type { DayOfWeek } from "~/utils/date";
import { getNextWeekFromToday } from "~/utils/date";
import { formatLocaleDate } from "~/utils/date";
import { formatCalculatedTimePeriod, formatTimeSlot } from "~/utils/date";
import {
  getDateFormat,
  getDayOfWeekNumbered,
  getWeekDates,
} from "~/utils/date";
import { BOOKING_HOURLY_PRICE, START_FROM_MONDAY } from "~/utils/constants";

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
  isValid: boolean;
}

const renderTimeSlotsRange = (
  selectedTime: TimeState,
  total: number,
  isMobile = false
) => {
  const { start, end, diff } = selectedTime;
  const duration = `${start && formatTimeSlot(start)} - ${
    end && formatTimeSlot(end)
  }`;

  return (
    <span>
      {duration} | {formatCalculatedTimePeriod(diff, isMobile)} ({total} грн)
    </span>
  );
};

const mapAppointmentsToSlots = (
  appointments: Appointment[],
  date: Date,
  isValid = false
): BookableTimeSlot[][] => {
  return appointments.map((app) => {
    const timeFromArr = app.timeFrom.split("T")[1].split(":");
    const timeToArr = app.timeTo.split("T")[1].split(":");
    return generateTimeSlots(
      date,
      Number(timeFromArr[0]) + (timeFromArr[1] == "30" ? 0.5 : 0),
      Number(timeToArr[0]) + (timeToArr[1] == "30" ? 0.5 : 0)
    ).map((slot) => ({
      slot,
      isConfirmed: app.confirmed,
      isBooked: true,
      isValid,
    }));
  });
};

const formAvailableWeeklySlots = (
  slots: DateSlot[],
  appointments: Appointment[],
  selectedDate: string
): BookableTimeSlot[][] => {
  const weeks = START_FROM_MONDAY
    ? getWeekDates(selectedDate)
    : getNextWeekFromToday();
  return weeks.map((weekDate) => {
    // all slots for a day
    const selectedDateSlots = slots.find(
      ({ date }) => date === getDateFormat(weekDate)
    );
    const isValid = Boolean(
      slots.find(({ date }) => date === getDateFormat(weekDate))?.isValid
    );

    const todaysAppointments =
      appointments.filter(
        ({ date, timeFrom, timeTo }) =>
          timeFrom && timeTo && date === getDateFormat(weekDate)
      ) || [];

    // all appointments' time slots for a day
    const bookedSlots = mapAppointmentsToSlots(
      todaysAppointments,
      weekDate
    ).flat();

    return (selectedDateSlots?.availableTimeSlots || []).map((slot) => ({
      slot,
      isBooked: Boolean(
        bookedSlots.find((bookedSlot) => bookedSlot.slot === slot)?.isBooked
      ),
      isConfirmed: Boolean(
        bookedSlots.find((bookedSlot) => bookedSlot.slot === slot)?.isConfirmed
      ),
      isValid,
    }));
  });
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
    dateTime: { date: selectedDate, time: selectedTime, slots, hasWeekChanged },
    price,
  } = useSelector((store: StoreBooking) => store.booking);

  // Mounted check for React Tooltip
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []);

  // Keep track of day of week (0 to 6)
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(
    getDayOfWeekNumbered(new Date(selectedDate))
  );

  // Memoed values for rendering
  const memoedTimeSlots = useMemo(() => {
    return formAvailableWeeklySlots(slots, appointments, selectedDate);
  }, [slots, appointments, selectedDate]);
  const timeSlots = memoedTimeSlots[dayOfWeek];

  const memoedDateSummary = useMemo(() => {
    return formatLocaleDate("uk", selectedDate || slots[0]?.date);
  }, [selectedDate, slots]);
  const memoedTimeSlotSummary = useMemo(() => {
    return timeSlots?.length > 0 && timeSlots.some((slot) => !slot.isBooked)
      ? renderTimeSlotsRange(selectedTime, price.booking, isMobile)
      : "Немає вільних слотів";
  }, [isMobile, price.booking, selectedTime, timeSlots]);

  // Callbacks passed inside components
  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);
  const onChangeDayOfWeek = useCallback(
    (newDayOfWeek: DayOfWeek) => {
      setDayOfWeek(newDayOfWeek);
      dispatch(
        saveDate(getDateFormat(new Date(memoedTimeSlots[newDayOfWeek][0].slot)))
      );
    },
    [dispatch, memoedTimeSlots]
  );
  const onChangeDateWeekday = useCallback(
    (dateString: string) => {
      setDayOfWeek(getDayOfWeekNumbered(new Date(dateString)));
      onChangeDate(dateString);
    },
    [onChangeDate]
  );

  return (
    <div className="w-full w-screen -translate-x-4 sm:w-[calc(100vw-10%)] sm:-translate-x-[calc(20%-2px)] md:w-[calc(100vw-30%)] md:-translate-x-[calc(15%-2px)] lg:w-full lg:translate-x-0 lg:px-4">
      {/* Standalone Tooltip */}
      {hasMounted && (
        <ReactTooltip
          backgroundColor="#2b2b2b"
          textColor="#ffffff"
          place="top"
          effect="solid"
          multiline
        />
      )}

      <h4 className={`mb-2 text-center font-mono font-medium`}>
        {memoedDateSummary}, {memoedTimeSlotSummary}
      </h4>
      <legend className="mx-auto mb-4 block text-center font-mono text-sm italic sm:mb-8">
        Свайпайте тижні, обирайте слоти ({BOOKING_HOURLY_PRICE} грн/год){" "}
        <span
          className="radius inline-block h-[3ch] w-[3ch] cursor-pointer rounded-full bg-stone-300 text-center font-mono not-italic text-stone-100 hover:bg-stone-400"
          data-tip="Білі слоти - доступні до бронювання <br />Сірі слоти - зарезервовані"
        >
          i
        </span>
      </legend>

      <div className="w-full px-4 md:px-0">
        <DatePicker
          selectedDate={selectedDate}
          dateTimeSlots={slots}
          onChangeDate={onChangeDateWeekday}
        />
      </div>
      <div className="w-full border-t-[2px] border-stone-800 px-0 sm:px-4 md:px-0">
        <TimePickerTable
          hasWeekChanged={hasWeekChanged}
          dayOfWeek={dayOfWeek}
          selectedDate={selectedDate}
          timeSlotsMatrix={memoedTimeSlots}
          onChangeDayOfWeek={onChangeDayOfWeek}
          onChangeTime={onChangeTime}
        />
        <div className="w-full px-4">
          <BookingStepActions hasPrimary={true} onPrimaryClick={stepNext} />
        </div>
      </div>
    </div>
  );
};

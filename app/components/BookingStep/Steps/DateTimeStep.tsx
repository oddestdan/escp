import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import DatePicker from "~/components/DatePicker/DatePicker";
import {
  ENABLE_OVERLAPS,
  saveCurrentStep,
  saveDate,
} from "~/store/bookingSlice";
import { BookingStepActions } from "../BookingStepActions";
import { generateTimeSlots } from "~/utils/slots";
import TimePickerTable from "~/components/TimePickerTable/TimePickerTable";
import {
  getNextWeekFromToday,
  formatLocaleDate,
  formatCalculatedTimePeriod,
  formatTimeSlot,
  addHoursToDate,
  getCleanDate,
  getDateFormat,
  getDayOfWeekNumbered,
  getWeekDates,
} from "~/utils/date";
import {
  BOOKING_HOURLY_PRICE,
  KYIV_LOCALE,
  MIN_HOURS_PRIOR_NOTICE,
  START_FROM_MONDAY,
  businessHoursStart,
} from "~/utils/constants";
import { useLoaderData } from "@remix-run/react";

import type { DayOfWeek } from "~/utils/date";
import type { StoreBooking, TimeState } from "~/store/bookingSlice";
import type { GoogleAppointment } from "~/models/googleApi.lib";
import type { Appointment } from "@prisma/client";

const NO_SLOTS_MSG = "Немає вільних слотів";

type DateTimeLoaderData = {
  appointments: GoogleAppointment[];
  prismaAppointments: Appointment[];
};

export interface DateTimeStepProps {
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

const validateSlot = (slot: string) => {
  const minTime = addHoursToDate(
    getCleanDate(),
    Number(businessHoursStart.split(":")[0]) + MIN_HOURS_PRIOR_NOTICE
  );
  const bookingTime = new Date(slot);
  const isValid =
    bookingTime >= minTime &&
    bookingTime >= addHoursToDate(new Date(), MIN_HOURS_PRIOR_NOTICE);

  return isValid;
};

const mapAppointmentsToSlots = (
  appointments: GoogleAppointment[],
  date: Date
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
      isBooked: true, // unused prop with new Table booking view
      isValid: false,
    }));
  });
};

export const DateTimeStep: React.FC<DateTimeStepProps> = ({
  onChangeDate,
  onChangeTime,
  isMobile = false,
}) => {
  const { appointments, prismaAppointments } =
    useLoaderData<DateTimeLoaderData>();
  const dispatch = useDispatch();
  const {
    currentStep,
    studio,
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

  const weeks: Date[] = useMemo(
    () =>
      START_FROM_MONDAY
        ? getWeekDates(selectedDate)
        : getNextWeekFromToday(selectedDate),
    [selectedDate]
  );

  // Memoed values for rendering
  const timeSlotsMatrix: BookableTimeSlot[][] = useMemo(() => {
    const bookableSlots: BookableTimeSlot[][] = weeks.map(
      (weekDate): BookableTimeSlot[] => {
        // all slots for a day
        const selectedDateSlots = slots.find(
          ({ date }) => date === getDateFormat(weekDate)
        );
        const dateValid = Boolean(
          slots.find(({ date }) => date === getDateFormat(weekDate))?.isValid
        );

        const todaysAppointments =
          appointments.filter(
            ({ date, timeFrom, timeTo }) =>
              timeFrom && timeTo && date === getDateFormat(weekDate)
          ) || [];

        // Shows temporary prisma appointments
        const todaysPrismaAppointments = ENABLE_OVERLAPS
          ? prismaAppointments.filter(
              ({ date, timeFrom, timeTo }) =>
                timeFrom && timeTo && date === getDateFormat(weekDate)
            ) || []
          : ([] as Appointment[]);

        // all appointments' time slots for a day
        const bookedSlots = mapAppointmentsToSlots(
          [...todaysAppointments, ...todaysPrismaAppointments],
          weekDate
        ).flat();

        const currentDate = new Date();
        currentDate.setHours(12, 0, 0, 0);

        return (selectedDateSlots?.availableTimeSlots || []).map((slot) => ({
          slot,
          isBooked: Boolean(
            bookedSlots.find((bookedSlot) => bookedSlot.slot === slot)?.isBooked
          ),
          isConfirmed: Boolean(
            bookedSlots.find((bookedSlot) => bookedSlot.slot === slot)
              ?.isConfirmed
          ),
          isValid:
            currentDate.getTime() === weekDate.getTime()
              ? validateSlot(slot)
              : dateValid,
        }));
      }
    );
    return bookableSlots;
  }, [slots, weeks, appointments, prismaAppointments]);

  const timeSlots = timeSlotsMatrix[dayOfWeek];
  const firstValidIndex = useMemo(() => {
    return timeSlots
      ? timeSlots.findIndex(
          (timeSlot) => !timeSlot.isBooked && timeSlot.isValid
        )
      : -1;
  }, [timeSlots]);

  const memoedDateSummary = useMemo(() => {
    return formatLocaleDate(KYIV_LOCALE, selectedDate || slots[0]?.date);
  }, [selectedDate, slots]);
  const memoedTimeSlotSummary = useMemo(() => {
    return timeSlots?.length > 0 && timeSlots.some((slot) => !slot.isBooked)
      ? renderTimeSlotsRange(selectedTime, price.booking, isMobile)
      : NO_SLOTS_MSG;
  }, [isMobile, price.booking, selectedTime, timeSlots]);

  const memoedAppointmentMonth = useMemo(() => {
    if (!weeks.length) {
      return "--";
    }

    const startMonth = new Date(weeks[0]).toLocaleString(KYIV_LOCALE, {
      month: "long",
    });
    const endMonth = new Date(weeks[weeks.length - 1]).toLocaleString(
      KYIV_LOCALE,
      {
        month: "long",
      }
    );

    const monthWording =
      startMonth === endMonth ? startMonth : `${startMonth} / ${endMonth}`;
    return monthWording;
  }, [weeks]);

  // Callbacks passed inside components
  const stepNext = useCallback(() => {
    dispatch(saveCurrentStep(currentStep + 1));
  }, [dispatch, currentStep]);
  const stepBack = useCallback(() => {
    dispatch(saveCurrentStep(currentStep - 1));
  }, [dispatch, currentStep]);
  const onChangeDayOfWeek = useCallback(
    (newDayOfWeek: DayOfWeek) => {
      // console.log("> onChangeDayOfWeek");
      // console.log({
      //   newDayOfWeek,
      //   timeSlotsMatrix,
      //   savedDate: getDateFormat(
      //     new Date(timeSlotsMatrix[newDayOfWeek][0].slot)
      //   ),
      // });
      setDayOfWeek(newDayOfWeek);
      dispatch(
        saveDate(getDateFormat(new Date(timeSlotsMatrix[newDayOfWeek][0].slot)))
      );
    },
    [dispatch, timeSlotsMatrix]
  );
  const onChangeDateWeekday = useCallback(
    (dateString: string) => {
      // console.log("> onChangeDateWeekday");
      // console.log({
      //   dayOfWeekNumbered: getDayOfWeekNumbered(new Date(dateString)),
      //   dateString,
      // });
      setDayOfWeek(getDayOfWeekNumbered(new Date(dateString)));
      onChangeDate(dateString);
    },
    [onChangeDate]
  );

  // make it a client-only component by only rendering if mounted
  // https://github.com/remix-run/remix/discussions/1023
  // https://github.com/ashikmeerankutty/client-test/pull/1/files
  return hasMounted ? (
    <div className="w-screen -translate-x-4 sm:w-[calc(100vw-10%)] sm:-translate-x-[calc(20%-2px)] md:w-[calc(100vw-30%)] md:-translate-x-[calc(15%-2px)] lg:w-full lg:translate-x-0 lg:px-4">
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

      <h4 className={`mb-2 px-4 text-center font-medium`}>
        {studio.name} | {memoedDateSummary}, {memoedTimeSlotSummary}{" "}
        <span
          className="radius inline-block h-[1.5rem] w-[1.5rem] cursor-pointer rounded-full bg-stone-300 text-center not-italic text-stone-100 hover:bg-stone-400"
          data-tip={`${BOOKING_HOURLY_PRICE} грн/год<br />Свайпайте тижні, обирайте слоти<br />Білі слоти - доступні до бронювання<br />Сірі слоти - зарезервовані`}
        >
          i
        </span>
      </h4>

      <h4 className={`mb-2 px-4 text-center font-medium`}>
        {memoedAppointmentMonth}
      </h4>

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
          timeSlotsMatrix={timeSlotsMatrix}
          onChangeDayOfWeek={onChangeDayOfWeek}
          onChangeTime={onChangeTime}
          firstValidIndex={firstValidIndex}
        />
        <div className="w-full px-4">
          <BookingStepActions
            hasPrimary={true}
            onPrimaryClick={stepNext}
            hasSecondary={true}
            onSecondaryClick={stepBack}
            disabled={
              memoedTimeSlotSummary === NO_SLOTS_MSG || firstValidIndex === -1
            }
          />
        </div>
      </div>
    </div>
  ) : (
    <span></span>
  );
};

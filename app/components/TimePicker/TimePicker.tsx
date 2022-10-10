import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BOOKING_HOURLY_PRICE,
  TIMESLOT_OFFSET_MINUTES,
} from "~/utils/constants";
import {
  addMinutes,
  formatCalculatedTimePeriod,
  formatTimeSlot,
} from "~/utils/date";

import type { StoreBooking } from "~/store/bookingSlice";
import type { BookableTimeSlot } from "../BookingStep/Steps/DateTimeStep";
import ReactTooltip from "react-tooltip";

export interface TimePickerProps {
  selectedTime: { start: string; end: string };
  timeSlots: BookableTimeSlot[];
  total: number;
  onChangeTime: (start: string, end: string, diff: number) => void;
  isMobile?: boolean;
}

const renderTimeSlotsRange = (
  timeSlots: Array<string>,
  start: number,
  end: number,
  diff: number,
  total: number,
  isMobile = false
) => {
  const duration = `${
    timeSlots[start >= end ? end : start] &&
    formatTimeSlot(timeSlots[start >= end ? end : start])
  }${
    timeSlots[start] &&
    timeSlots[end] &&
    start !== end &&
    addMinutes(timeSlots[start], TIMESLOT_OFFSET_MINUTES) !== timeSlots[end] &&
    addMinutes(timeSlots[end], TIMESLOT_OFFSET_MINUTES) !== timeSlots[start]
      ? " - ... - "
      : " - "
  }${
    timeSlots[start <= end ? end : start] &&
    formatTimeSlot(
      addMinutes(timeSlots[start <= end ? end : start], TIMESLOT_OFFSET_MINUTES)
    )
  }`;

  return (
    <span>
      {duration} | {formatCalculatedTimePeriod(diff, isMobile)} ({total} грн)
    </span>
  );
};

const TimePicker: React.FC<TimePickerProps> = ({
  timeSlots,
  selectedTime,
  total,
  onChangeTime,
  isMobile = false,
}) => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []);

  const nonBookedIndexes = timeSlots.reduce<number[]>(
    (arr, slot, i) => (slot.isBooked ? arr : [...arr, i]),
    []
  );
  const nonBookedIndexesBool = timeSlots.map((slot) => !slot.isBooked);
  const timeDiff = useSelector((store: StoreBooking) => store.booking).dateTime
    .time.diff;

  const [start, setStart] = useState(
    timeSlots.findIndex(({ slot }) => slot === selectedTime.start) !== -1
      ? timeSlots.findIndex(({ slot }) => slot === selectedTime.start)
      : nonBookedIndexes[0]
  );
  const [end, setEnd] = useState(
    timeSlots.findIndex(
      ({ slot }) =>
        slot === addMinutes(selectedTime.end, -TIMESLOT_OFFSET_MINUTES)
    ) !== -1
      ? timeSlots.findIndex(
          ({ slot }) =>
            slot === addMinutes(selectedTime.end, -TIMESLOT_OFFSET_MINUTES)
        )
      : nonBookedIndexes[0]
  );

  useEffect(() => {
    setStart(
      timeSlots.findIndex(({ slot }) => slot === selectedTime.start) !== -1
        ? timeSlots.findIndex(({ slot }) => slot === selectedTime.start)
        : nonBookedIndexes[0]
    );

    setEnd(
      timeSlots.findIndex(({ slot }) => slot === selectedTime.start) !== -1
        ? timeSlots.findIndex(({ slot }) => slot === selectedTime.start)
        : nonBookedIndexes[0]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeSlots]);

  const [selecting, setSelecting] = useState(false);

  const mouseDownHandler = (i: number) => {
    if (i > end) {
      if (nonBookedIndexesBool.slice(end, i + 1).some((x) => !x)) {
        setStart(i);
      }
      setEnd(i);
    } else if (i < start) {
      if (nonBookedIndexesBool.slice(i, start + 1).some((x) => !x)) {
        setEnd(i);
      }
      setStart(i);
    } else if (
      (i === start && i === end - 1) ||
      (i === end && i === start + 1)
    ) {
      setStart(i);
      setEnd(i);
    } else {
      selecting ? setEnd(i) : setStart(i);
      setSelecting(!selecting);
    }
  };

  const mouseUpHandler = (i = end) => {
    // if (isMobile) {
    //   return;
    // } else {
    //   setSelecting(false);
    //   mouseMoveHandler(i);
    // }
  };

  const mouseMoveHandler = (i: number) => {
    // if (isMobile) {
    //   return;
    // } else {
    //   if (selecting) {
    //     setEnd(i);
    //   }
    // }
  };

  useEffect(() => {
    if (!timeSlots[start] || !timeSlots[end]) {
      return;
    }

    const diff = nonBookedIndexesBool
      .slice(start, end + 1)
      .filter(Boolean).length;

    onChangeTime(
      timeSlots[start >= end ? end : start].slot,
      addMinutes(
        timeSlots[start <= end ? end : start].slot,
        TIMESLOT_OFFSET_MINUTES
      ),
      diff
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, onChangeTime, timeSlots]);

  return (
    <div className={`XXX-aoa-date-picker`}>
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
        {timeSlots?.length > 0 && timeSlots.some((slot) => !slot.isBooked)
          ? renderTimeSlotsRange(
              timeSlots.map(({ slot }) => slot),
              start,
              end,
              timeDiff,
              total,
              isMobile
            )
          : "Немає вільних слотів"}
      </h4>
      <legend className="mx-auto mb-8 block text-center font-mono text-sm italic">
        Клікайте та обирайте тайм-слоти ({BOOKING_HOURLY_PRICE} грн/год){" "}
        <span
          className="radius inline-block h-[3ch] w-[3ch] cursor-pointer rounded-full bg-stone-300 text-center font-mono not-italic text-stone-100 hover:bg-stone-400"
          data-tip="Білі слоти - доступні до бронювання <br />Сірі слоти - зарезервовані"
        >
          i
        </span>
      </legend>
      <ul className={`justify-star flex w-full flex-wrap font-mono`}>
        {timeSlots?.length > 0 &&
          timeSlots.map(({ slot, isBooked }, i) => {
            const isActive =
              (end <= i && i <= start) || (start <= i && i <= end);
            return (
              <li key={`${i}-${slot}`} className="flex">
                {/* actual time slot */}
                <div
                  className={`my-2 inline-flex border-b-[1px] px-1 ${
                    isActive
                      ? "bg-stone-800 text-stone-100 hover:bg-stone-700 active:bg-stone-600 active:text-stone-200"
                      : "hover:bg-stone-100 active:bg-stone-200 active:text-stone-800"
                  } ${
                    isBooked
                      ? "cursor-not-allowed border-transparent bg-stone-200 text-stone-600"
                      : "cursor-pointer border-stone-800"
                  }`}
                  onMouseDown={() => !isBooked && mouseDownHandler(i)}
                  onMouseUp={() => !isBooked && mouseUpHandler(i)}
                  onMouseMove={() => !isBooked && mouseMoveHandler(i)}
                  aria-disabled={isBooked}
                >
                  <div className={`select-none px-1 py-1`}>
                    {formatTimeSlot(slot)}
                    <span className="px-1">-</span>
                    {formatTimeSlot(addMinutes(slot, TIMESLOT_OFFSET_MINUTES))}
                  </div>
                </div>

                {/* connector placeholder */}
                <div
                  className={`h-[2px] self-center bg-stone-800 px-2 ${
                    (end <= i && i < start) || (start <= i && i < end)
                      ? ""
                      : "invisible"
                  }`}
                ></div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default TimePicker;

// eslint-disable-next-line no-lone-blocks
{
  /* <label
  htmlFor="mode"
  className="relative inline-flex cursor-pointer items-center hover:text-stone-500"
  onClick={() => setIsDragMode(!isDragMode)}
>
</label>
<input
  name="mode"
  className="peer sr-only"
  role="switch"
  type="checkbox"
  checked={isDragMode}
  readOnly={true}
/>
{!isMobile && (
  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
)} */
}

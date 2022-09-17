import React, { useEffect, useState } from "react";
import {
  BOOKING_HOURLY_PRICE,
  TIMESLOT_OFFSET_MINUTES,
} from "~/utils/constants";
import {
  addMinutes,
  formatCalculatedTimePeriod,
  formatTimeSlot,
} from "~/utils/date";

export interface TimePickerProps {
  selectedTime: { start: string; end: string };
  timeSlots: Array<string>;
  total: number;
  onChangeTime: (start: string, end: string, diff: number) => void;
  isMobile?: boolean;
}

const renderTimeSlotsRange = (
  timeSlots: Array<string>,
  start: number,
  end: number,
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
      {duration} |{" "}
      {formatCalculatedTimePeriod(
        start <= end ? [start, end] : [end, start],
        isMobile
      )}
      , {total} грн
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
  const [start, setStart] = useState(
    timeSlots.findIndex((slot) => slot === selectedTime.start) !== -1
      ? timeSlots.findIndex((slot) => slot === selectedTime.start)
      : 0
  );
  const [end, setEnd] = useState(
    timeSlots.findIndex(
      (slot) => slot === addMinutes(selectedTime.end, -TIMESLOT_OFFSET_MINUTES)
    ) !== -1
      ? timeSlots.findIndex(
          (slot) =>
            slot === addMinutes(selectedTime.end, -TIMESLOT_OFFSET_MINUTES)
        )
      : 0
  );
  const [selecting, setSelecting] = useState(false);

  const mouseDownHandler = (i: number) => {
    // if (isMobile) {
    if (i > end) {
      setEnd(i);
    } else if (i < start) {
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
    // } else {
    //   setSelecting(true);
    //   setStart(i);
    //   mouseMoveHandler(i);
    // }
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
    onChangeTime(
      timeSlots[start >= end ? end : start],
      addMinutes(
        timeSlots[start <= end ? end : start],
        TIMESLOT_OFFSET_MINUTES
      ),
      Math.abs(end - start) + 1
    );
  }, [start, end, onChangeTime, timeSlots]);

  return (
    <div className={`XXX-aoa-date-picker`}>
      <h4 className={`mb-2 text-center font-mono font-medium`}>
        {timeSlots?.length > 0
          ? renderTimeSlotsRange(timeSlots, start, end, total, isMobile)
          : "Немає вільних слотів"}
      </h4>
      <legend className="mx-auto mb-8 block text-center font-mono text-sm italic">
        {/* <label
          htmlFor="mode"
          className="relative inline-flex cursor-pointer items-center hover:text-stone-500"
          onClick={() => setIsDragMode(!isDragMode)}
        > */}
        {/* Saved Switcher Toggle for possible later usage */}
        {/* <input
            name="mode"
            className="peer sr-only"
            role="switch"
            type="checkbox"
            checked={isDragMode}
            readOnly={true}
          />
          {!isMobile && (
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          )} */}
        {/* {isDragMode ? "Зажміть" : "Клікайте"} та обирайте тайм-слоти */}
        Клікайте та обирайте тайм-слоти ({BOOKING_HOURLY_PRICE} грн/год)
      </legend>
      <ul className={`justify-star flex w-full flex-wrap font-mono`}>
        {timeSlots?.length > 0 &&
          timeSlots.map((slot, i) => {
            const isActive =
              (end <= i && i <= start) || (start <= i && i <= end);
            return (
              <li key={`${i}-${slot}`} className="flex">
                {/* actual time slot */}
                <div
                  className={`my-2 inline-flex cursor-pointer border-b-[1px] border-stone-800 px-1 ${
                    isActive ? "bg-stone-800 text-stone-100" : ""
                  }`}
                  onMouseDown={() => mouseDownHandler(i)}
                  onMouseUp={() => mouseUpHandler(i)}
                  onMouseMove={() => mouseMoveHandler(i)}
                >
                  {/* actual time slot start */}
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

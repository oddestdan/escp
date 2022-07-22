import React, { useEffect, useState } from "react";
import {
  addMinutes,
  formatCalculatedTimePeriod,
  formatTimeSlot,
} from "~/utils/date";

export interface TimePickerProps {
  selectedTime: { start: string; end: string };
  timeSlots: Array<string>;
  onChangeTime: (start: string, end: string, diff: number) => void;
  isMobile?: boolean;
}

const renderTimeSlotsRange = (
  timeSlots: Array<string>,
  start: number,
  end: number,
  isMobile = false
) => {
  return (
    <>
      <span>
        {timeSlots[start >= end ? end : start] &&
          formatTimeSlot(timeSlots[start >= end ? end : start])}
        {timeSlots[start] &&
        timeSlots[end] &&
        start !== end &&
        addMinutes(timeSlots[start], 30) !== timeSlots[end] &&
        addMinutes(timeSlots[end], 30) !== timeSlots[start]
          ? " - ... - "
          : " - "}
        {timeSlots[start <= end ? end : start] &&
          formatTimeSlot(addMinutes(timeSlots[start <= end ? end : start], 30))}
      </span>{" "}
      <span>
        |{" "}
        {formatCalculatedTimePeriod(
          start <= end ? [start, end] : [end, start],
          isMobile
        )}
      </span>
    </>
  );
};

const TimePicker: React.FC<TimePickerProps> = ({
  timeSlots,
  selectedTime,
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
      (slot) => slot === addMinutes(selectedTime.end, -30)
    ) !== -1
      ? timeSlots.findIndex(
          (slot) => slot === addMinutes(selectedTime.end, -30)
        )
      : 0
  );
  const [selecting, setSelecting] = useState(false);
  const [isDragMode, setIsDragMode] = useState(true);

  const mouseDownHandler = (i: number) => {
    if (isMobile || !isDragMode) {
      if (i > end) {
        setEnd(i);
      } else if (i < start) {
        setStart(i);
      } else {
        selecting ? setEnd(i) : setStart(i);
        setSelecting(!selecting);
      }
    } else {
      setSelecting(true);
      setStart(i);
      mouseMoveHandler(i);
    }
  };

  const mouseUpHandler = (i = end) => {
    if (isMobile || !isDragMode) {
      return;
    } else {
      setSelecting(false);
      mouseMoveHandler(i);
    }
  };

  const mouseMoveHandler = (i: number) => {
    if (isMobile || !isDragMode) {
      return;
    } else {
      if (selecting) {
        setEnd(i);
      }
    }
  };

  useEffect(() => {
    if (!timeSlots[start] || !timeSlots[end]) {
      return;
    }
    onChangeTime(
      timeSlots[start >= end ? end : start],
      addMinutes(timeSlots[start <= end ? end : start], 30),
      Math.abs((end - start) / 2) + 0.5
    );
  }, [start, end, onChangeTime, timeSlots]);

  return (
    <div className={`XXX-aoa-date-picker`}>
      <h4 className={`mb-4 text-center font-medium`}>
        {timeSlots?.length > 0
          ? renderTimeSlotsRange(timeSlots, start, end, isMobile)
          : "Немає вільних слотів"}
      </h4>
      <div className="mb-4 text-center text-sm italic">
        <label
          htmlFor="mode"
          className="relative inline-flex cursor-pointer items-center hover:text-stone-500"
          onClick={() => setIsDragMode(!isDragMode)}
        >
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
          )}
          <span className="ml-3">
            {isDragMode ? "Зажміть" : "Клікайте"} та обирайте слоти
          </span>
        </label>
      </div>
      <ul className={`flex w-full flex-wrap justify-start`}>
        {timeSlots?.length > 0 &&
          timeSlots.map((slot, i) => (
            <li
              key={`${i}-${slot}`}
              className={`cursor-pointer`}
              onMouseDown={() => mouseDownHandler(i)}
              onMouseUp={() => mouseUpHandler(i)}
              onMouseMove={() => mouseMoveHandler(i)}
            >
              <div
                className={`${
                  (end <= i && i <= start) || (start <= i && i <= end)
                    ? "bg-stone-800 text-stone-100"
                    : ""
                } my-2 mr-2 select-none px-2`}
              >
                {formatTimeSlot(slot)}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TimePicker;

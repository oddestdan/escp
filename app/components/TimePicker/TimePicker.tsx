import React, { useEffect, useState } from "react";
import { getIsMobile } from "../DatePicker/DatePicker";

export interface TimeSlot {
  startTime: string;
  isTaken: boolean;
}

export interface TimePickerProps {
  selectedDate: string;
  timeSlots: Array<TimeSlot>;
  onChangeTime: (start: string, end: string) => void;
}

const getUnpaddedTimeFormat = (time: string): string => {
  return time.charAt(0) === "0" ? time.slice(1) : time;
};

const formatTimeSlot = (time: string) => {
  return getUnpaddedTimeFormat(
    new Date(time).toLocaleTimeString("uk", {
      hour: "numeric",
      minute: "numeric",
    })
  );
};

const tzOffset = new Date().getTimezoneOffset() * 60000;
const add30Minutes = (time: string) => {
  const minutesOffset = 30 * 60000;
  return new Date(new Date(time).getTime() - tzOffset + minutesOffset)
    .toISOString()
    .slice(0, -5);
};

const renderTimeSlotsRange = (
  timeSlots: Array<TimeSlot>,
  start: number,
  end: number
) => {
  return (
    <>
      {timeSlots[start >= end ? end : start] &&
        formatTimeSlot(timeSlots[start >= end ? end : start].startTime)}
      {timeSlots[start] &&
      timeSlots[end] &&
      start !== end &&
      add30Minutes(timeSlots[start].startTime) !== timeSlots[end].startTime &&
      add30Minutes(timeSlots[end].startTime) !== timeSlots[start].startTime
        ? " - ... - "
        : " - "}
      {timeSlots[start <= end ? end : start] &&
        formatTimeSlot(
          add30Minutes(timeSlots[start <= end ? end : start].startTime)
        )}
    </>
  );
};

const TimePicker: React.FC<TimePickerProps> = ({
  timeSlots,
  selectedDate,
  onChangeTime,
}) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [selecting, setSelecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mouseDownHandler = (i: number) => {
    if (isMobile) {
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
    if (isMobile) {
      return;
    } else {
      setSelecting(false);
      mouseMoveHandler(i);
    }
  };

  const mouseMoveHandler = (i: number) => {
    if (isMobile) {
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
      timeSlots[start >= end ? end : start].startTime,
      timeSlots[start <= end ? end : start].startTime
    );
  }, [start, end, onChangeTime, timeSlots]);

  useEffect(() => [setStart, setEnd].forEach((f) => f(0)), [selectedDate]);

  useEffect(() => {
    setIsMobile(getIsMobile());
  }, []);

  return (
    <div className={`XXX-aoa-date-picker`}>
      <h4 className={`mb-4 text-center font-medium`}>
        {renderTimeSlotsRange(timeSlots, start, end)}
      </h4>
      <ul className={`flex w-full flex-wrap justify-start`}>
        {timeSlots?.length > 0 &&
          timeSlots.map((slot, i) => (
            <li
              key={`${i}-${slot.startTime}`}
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
                {formatTimeSlot(slot.startTime)}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TimePicker;

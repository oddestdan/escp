import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setHasWeekChanged } from "~/store/bookingSlice";
import { TIMESLOT_OFFSET_MINUTES } from "~/utils/constants";
import { addMinutes, formatShortTimeSlot } from "~/utils/date";

import type { DayOfWeek } from "~/utils/date";
import type { BookableTimeSlot } from "../BookingStep/Steps/DateTimeStep";

export interface TimePickerTableProps {
  hasWeekChanged: boolean;
  dayOfWeek: DayOfWeek;
  selectedDate: string;
  timeSlotsMatrix: BookableTimeSlot[][];
  onChangeDayOfWeek: (dayOfWeek: DayOfWeek) => void;
  onChangeTime: (start: string, end: string, diff: number) => void;
}

const mapNonBookedIndexes = (timeSlots: BookableTimeSlot[]): boolean[] =>
  timeSlots.map((slot) => !slot.isBooked);

const TimePickerTable: React.FC<TimePickerTableProps> = ({
  hasWeekChanged,
  dayOfWeek,
  selectedDate,
  timeSlotsMatrix,
  onChangeDayOfWeek,
  onChangeTime,
}) => {
  const dispatch = useDispatch();
  const timeSlots = useMemo(() => {
    return timeSlotsMatrix[dayOfWeek];
  }, [timeSlotsMatrix, dayOfWeek]);

  const firstValidIndex = useMemo(
    () =>
      timeSlots.findIndex((timeSlot) => !timeSlot.isBooked && timeSlot.isValid),
    [timeSlots]
  );

  const [start, setStart] = useState(firstValidIndex);
  const [end, setEnd] = useState(firstValidIndex);

  useEffect(() => {
    if (!hasWeekChanged) {
      return;
    }
    setStart(firstValidIndex);
    setEnd(firstValidIndex);
  }, [selectedDate, firstValidIndex, hasWeekChanged]);

  const [selecting, setSelecting] = useState(false);
  const mouseDownHandler = useCallback(
    (newDayOfWeek: DayOfWeek, i: number) => {
      const nonBookedIndexesBool = mapNonBookedIndexes(timeSlots);

      if (dayOfWeek !== newDayOfWeek) {
        onChangeDayOfWeek(newDayOfWeek);
        dispatch(setHasWeekChanged(false));
        setStart(i);
        setEnd(i);
        return;
      }

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
    },
    [dayOfWeek, dispatch, end, timeSlots, onChangeDayOfWeek, selecting, start]
  );

  useEffect(() => {
    if (!timeSlots[start] || !timeSlots[end]) {
      return;
    }

    const nonBookedIndexesBool = mapNonBookedIndexes(timeSlots);
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
  }, [start, end, onChangeTime, timeSlots]);

  return (
    <div className={`XXX-aoa-date-picker`}>
      <ul
        className={`mb-8 mt-2 flex w-full flex-row justify-around font-mono text-xs sm:text-sm`}
      >
        {timeSlotsMatrix.map(
          (timeSlots, dayOfWeekIndex) =>
            timeSlots?.length > 0 && (
              <div
                key={`timeSlotRow-${dayOfWeekIndex}`}
                className="flex w-fit flex-grow basis-0 flex-col items-center"
              >
                {timeSlots.filter((slot) => slot.isValid).length === 0 ? (
                  <div className="flex h-full w-[7ch] max-w-full items-center">
                    it was a good day :)
                  </div>
                ) : (
                  timeSlots.map(({ slot, isBooked, isValid }, i) => {
                    const isCurrentDay = dayOfWeekIndex === dayOfWeek;
                    const isActive =
                      (end <= i && i <= start) || (start <= i && i <= end);
                    const timeSlotStart = formatShortTimeSlot(slot);
                    const timeSlotEnd = formatShortTimeSlot(
                      addMinutes(slot, TIMESLOT_OFFSET_MINUTES)
                    );

                    return (
                      <li key={`${i}-${slot}`} className="flex w-fit flex-col">
                        {/* actual time slot */}
                        {isBooked || !isValid ? (
                          <div
                            className={`inline-flex cursor-not-allowed border-b-[1px] border-transparent bg-stone-300 px-1 text-stone-700 ${
                              // !isValid
                              //   ? "border-[1px] border-stone-300 bg-transparent"
                              //   : ""
                              !isValid ? "invisible" : ""
                              // !isValid ? "text-transparent" : ""
                            }`}
                            aria-disabled={isBooked}
                            data-tip={`Пусті слоти - недоступні<br />Білі слоти - доступні до бронювання<br />Сірі слоти - зарезервовані`}
                          >
                            <div
                              className={`w-full select-none px-[1px] py-[2px] text-center sm:px-1 sm:py-1 ${
                                !isValid ? "" : ""
                              }`}
                            >
                              {isValid ? (
                                <>
                                  {timeSlotStart}
                                  <span className="inline-block py-[3px]">
                                    -
                                  </span>
                                  {timeSlotEnd}
                                </>
                              ) : (
                                <span className="inline-block py-[3px]">
                                  нема
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`inline-flex cursor-pointer border-b-[1px] border-stone-800 px-1 ${
                              isActive && isCurrentDay
                                ? "bg-stone-800 text-stone-100 hover:bg-stone-600 active:bg-stone-500 active:text-stone-200"
                                : "hover:bg-stone-200 active:bg-stone-300 active:text-stone-800"
                            }`}
                            onMouseDown={() =>
                              mouseDownHandler(dayOfWeekIndex, i)
                            }
                          >
                            <div className="select-none px-[1px] py-[2px] sm:px-1 sm:py-1">
                              {timeSlotStart}
                              <span className=" inline-block py-[3px]">-</span>
                              {timeSlotEnd}
                            </div>
                          </div>
                        )}

                        {/* connector placeholder */}
                        <div
                          className={`h-[6px] w-[3px] self-center bg-stone-800 ${
                            ((end <= i && i < start) ||
                              (start <= i && i < end)) &&
                            isCurrentDay
                              ? ""
                              : "invisible"
                          }`}
                        ></div>
                      </li>
                    );
                  })
                )}
              </div>
            )
        )}
      </ul>
    </div>
  );
};

export default TimePickerTable;

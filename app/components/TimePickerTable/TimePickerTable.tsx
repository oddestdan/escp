import React, { useCallback, useEffect, useMemo, useReducer } from "react";
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
  firstValidIndex: number;
  onChangeDayOfWeek: (dayOfWeek: DayOfWeek) => void;
  onChangeTime: (start: string, end: string, diff: number) => void;
}

const mapNonBookedIndexes = (timeSlots: BookableTimeSlot[]): boolean[] =>
  timeSlots.map((slot) => !slot.isBooked);

interface State {
  start: number;
  end: number;
  selecting: boolean;
}

const initialState: State = {
  start: 0,
  end: 0,
  selecting: false,
};

interface Action {
  type: "SET_START" | "SET_END" | "SET_SELECTING";
  payload: number | boolean;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_START":
      return { ...state, start: action.payload as number };
    case "SET_END":
      return { ...state, end: action.payload as number };
    case "SET_SELECTING":
      return { ...state, selecting: action.payload as boolean };
    default:
      return state;
  }
};

const TimePickerTable: React.FC<TimePickerTableProps> = ({
  hasWeekChanged,
  dayOfWeek,
  selectedDate,
  timeSlotsMatrix,
  firstValidIndex,
  onChangeDayOfWeek,
  onChangeTime,
}) => {
  const dispatch = useDispatch();
  const timeSlots = useMemo(() => {
    return timeSlotsMatrix[dayOfWeek];
  }, [timeSlotsMatrix, dayOfWeek]);

  const [state, localDispatch] = useReducer(reducer, {
    ...initialState,
    start: firstValidIndex,
    end: firstValidIndex,
  });

  useEffect(() => {
    if (!hasWeekChanged) {
      return;
    }
    localDispatch({ type: "SET_START", payload: firstValidIndex });
    localDispatch({ type: "SET_END", payload: firstValidIndex });
  }, [selectedDate, firstValidIndex, hasWeekChanged]);

  const mouseDownHandler = useCallback(
    (newDayOfWeek: DayOfWeek, i: number) => {
      const nonBookedIndexesBool = mapNonBookedIndexes(timeSlots);

      if (dayOfWeek !== newDayOfWeek) {
        onChangeDayOfWeek(newDayOfWeek);
        dispatch(setHasWeekChanged(false));
        localDispatch({ type: "SET_START", payload: i });
        localDispatch({ type: "SET_END", payload: i });
        return;
      }

      if (i > state.end) {
        if (nonBookedIndexesBool.slice(state.end, i + 1).some((x) => !x)) {
          localDispatch({ type: "SET_START", payload: i });
        }
        localDispatch({ type: "SET_END", payload: i });
      } else if (i < state.start) {
        if (nonBookedIndexesBool.slice(i, state.start + 1).some((x) => !x)) {
          localDispatch({ type: "SET_END", payload: i });
        }
        localDispatch({ type: "SET_START", payload: i });
      } else if (
        (i === state.start && i === state.end - 1) ||
        (i === state.end && i === state.start + 1)
      ) {
        localDispatch({ type: "SET_START", payload: i });
        localDispatch({ type: "SET_END", payload: i });
      } else {
        state.selecting
          ? localDispatch({ type: "SET_END", payload: i })
          : localDispatch({ type: "SET_START", payload: i });
        localDispatch({ type: "SET_SELECTING", payload: !state.selecting });
      }
    },
    [
      dayOfWeek,
      dispatch,
      state.end,
      timeSlots,
      onChangeDayOfWeek,
      state.selecting,
      state.start,
    ]
  );

  useEffect(() => {
    if (
      !timeSlots ||
      timeSlots.length === 0 ||
      !timeSlots[state.start] ||
      !timeSlots[state.end]
    ) {
      return;
    }

    const nonBookedIndexesBool = mapNonBookedIndexes(timeSlots);
    const diff = nonBookedIndexesBool
      .slice(state.start, state.end + 1)
      .filter(Boolean).length;

    onChangeTime(
      timeSlots[state.start >= state.end ? state.end : state.start].slot,
      addMinutes(
        timeSlots[state.start <= state.end ? state.end : state.start].slot,
        TIMESLOT_OFFSET_MINUTES
      ),
      diff
    );
  }, [state.start, state.end, onChangeTime, timeSlots]);

  const renderTimeSlots = useMemo(() => {
    return timeSlotsMatrix.map((timeSlots, dayOfWeekIndex) => {
      return (
        timeSlots?.length > 0 && (
          <div
            key={`timeSlotRow-${dayOfWeekIndex}`}
            className="flex w-fit flex-grow basis-0 flex-col items-center"
          >
            {timeSlots.map(({ slot, isBooked, isValid }, i) => {
              const isCurrentDay = dayOfWeekIndex === dayOfWeek;
              const isActive =
                (state.end <= i && i <= state.start) ||
                (state.start <= i && i <= state.end);
              const invalid = isBooked || !isValid;
              const timeSlotStart = formatShortTimeSlot(slot);
              const timeSlotEnd = formatShortTimeSlot(
                addMinutes(slot, TIMESLOT_OFFSET_MINUTES)
              );

              return (
                <li key={`${i}-${slot}`} className="flex w-fit flex-col">
                  {/* actual time slot */}
                  {invalid ? (
                    <div
                      className={`inline-flex cursor-not-allowed border-b-[1px] border-transparent bg-stone-300 px-1 text-stone-700`}
                      aria-disabled={invalid}
                      data-tip={`Білі слоти - доступні до бронювання<br />Сірі слоти - зарезервовані`}
                    >
                      <div
                        className={`w-full select-none px-[1px] py-[2px] text-center sm:px-1 sm:py-1`}
                      >
                        {timeSlotStart}
                        <span className="inline-block py-[3px]">-</span>
                        {timeSlotEnd}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`inline-flex cursor-pointer border-b-[1px] border-stone-800 px-1 ${
                        isActive && isCurrentDay
                          ? "bg-stone-800 text-stone-100 hover:bg-stone-600 active:bg-stone-500 active:text-stone-200"
                          : "hover:bg-stone-200 active:bg-stone-300 active:text-stone-800"
                      }`}
                      onMouseDown={() => mouseDownHandler(dayOfWeekIndex, i)}
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
                      ((state.end <= i && i < state.start) ||
                        (state.start <= i && i < state.end)) &&
                      isCurrentDay
                        ? ""
                        : "invisible"
                    }`}
                  ></div>
                </li>
              );
            })}
          </div>
        )
      );
    });
  }, [timeSlotsMatrix, dayOfWeek, state.start, state.end, mouseDownHandler]);

  return (
    <div className={`XXX-aoa-date-picker`}>
      <ul
        className={`mb-8 mt-2 flex w-full flex-row justify-around font-mono text-xs sm:text-sm`}
      >
        {renderTimeSlots}
      </ul>
    </div>
  );
};

export default React.memo(TimePickerTable);

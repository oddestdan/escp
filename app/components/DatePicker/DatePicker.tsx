import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import type { DateSlot } from "~/store/bookingSlice";
import { setHasWeekChanged } from "~/store/bookingSlice";
import { START_FROM_MONDAY } from "~/utils/constants";
import {
  addDays,
  defaultTime,
  getDateFormat,
  getDateNumber,
  getPrevMonday,
  getTomorrow,
  getWeekDayFormat,
} from "~/utils/date";

export interface DatePickerProps {
  className?: string;
  selectedDate: string;
  dateTimeSlots: Array<DateSlot>;
  onChangeDate: (date: string) => void;
}

// Gets the difference between two dates
export const dateDiffInDays = (date1: Date, date2: Date): number => {
  const PER_DAY = 1000 * 60 * 60 * 24;
  const requiredDateDifference = Math.ceil(
    Math.abs(Number(date2) - Number(date1)) / PER_DAY
  );
  return requiredDateDifference - (requiredDateDifference % 7);
};

// Calculates the index of active slide in date picker slider
export const getActiveSlideIndex = (
  dateTimeSlots: Array<DateSlot>,
  selectedDate: string
): number => {
  if (dateTimeSlots?.length && selectedDate?.length) {
    return dateDiffInDays(
      new Date(`${dateTimeSlots[0].date}${defaultTime}`),
      new Date(`${selectedDate}${defaultTime}`)
    );
  }
  return 0;
};

const sliderSettings = {
  dots: false,
  arrows: true,
  infinite: false,
  slidesToShow: 7,
  slidesToScroll: 7,
};

export const DatePicker: React.FC<DatePickerProps> = ({
  className,
  selectedDate,
  dateTimeSlots,
  onChangeDate,
}) => {
  const dispatch = useDispatch();
  const [today, setToday] = useState<string>("");

  const activeSlideIndex = useMemo(() => {
    return getActiveSlideIndex(dateTimeSlots, selectedDate);
  }, [dateTimeSlots, selectedDate]);

  useEffect(() => setToday(getDateFormat()), []);

  // const onDateChangeHandler = (date: DateSlot) => {
  //   if (getIsDateValid(date) && date.date !== selectedDate) {
  //     onChangeDate(date.date);
  //   }
  // };

  const getIsDateValid = (date: DateSlot) =>
    date.isValid &&
    date.availableTimeSlots &&
    date.availableTimeSlots?.length > 0;

  const onWeekChange = useCallback(
    (newIndex: number) => {
      const nextWeekDay = addDays(new Date(today), newIndex);
      const nextStartingDay = START_FROM_MONDAY
        ? getPrevMonday(nextWeekDay)
        : nextWeekDay;
      const tomorrow = getTomorrow();
      const payloadDay =
        nextStartingDay < tomorrow ? tomorrow : nextStartingDay;

      dispatch(setHasWeekChanged(true));
      onChangeDate(getDateFormat(payloadDay));
    },
    [onChangeDate, today, dispatch]
  );

  return (
    <div className="cursor-grabbing">
      <Slider
        className={`date-carousel XXX-carousel XXX-date-carousel`}
        {...sliderSettings}
        initialSlide={activeSlideIndex}
        afterChange={onWeekChange} // TODO: maybe beforeChange is better
      >
        {dateTimeSlots.map((date, i) => (
          <label aria-label={`${date.dayOfWeek} ${date.date}`} key={i}>
            <input
              type="radio"
              name="date"
              disabled={!getIsDateValid(date)}
              checked={date.date === selectedDate}
              readOnly={true}
            />
            <button
              className={`XXX-date__box cursor-grabbing ${
                className ? className : ""
              }`}
              // onClick={() => onDateChangeHandler(date)}
            >
              <div className={`XXX-week-date cursor-grabbing`}>
                {getWeekDayFormat(date.date)}
              </div>
              <div
                className={`XXX-numeral-date cursor-grabbing ${
                  date.date === today ? "underline underline-offset-4" : ""
                }`}
              >
                <span>{getDateNumber(date.date)}</span>
              </div>
            </button>
          </label>
        ))}
      </Slider>
    </div>
  );
};

export default DatePicker;

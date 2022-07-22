import React, { useMemo } from "react";
import Slider from "react-slick";
import type { DateSlot } from "~/store/bookingSlice";
import { getDateFormat } from "~/utils/date";

import {
  getActiveSlideIndex,
  getDate,
  getFormattedMonthAndYear,
  getWeekDayFormat,
} from "./DatePicker.helper";

export interface DatePickerProps {
  className?: string;
  selectedDate: string;
  dateTimeSlots: Array<DateSlot>;
  onChangeDate: (date: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  const { className, selectedDate, dateTimeSlots, onChangeDate } = props;

  const activeSlideIndex = useMemo(() => {
    return getActiveSlideIndex(dateTimeSlots, selectedDate);
  }, [dateTimeSlots, selectedDate]);

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 7,
    slidesToScroll: 7,
    initialSlide: activeSlideIndex,
  };

  const today = getDateFormat();

  const onDateChangeHandler = (date: DateSlot) => {
    if (getIsDateValid(date) && date.date !== selectedDate) {
      onChangeDate(date.date);
    }
  };

  const getIsDateValid = (date: DateSlot) =>
    date.isValid &&
    date.availableTimeSlots &&
    date.availableTimeSlots?.length > 0;

  return (
    <>
      <Slider
        className={`date-carousel XXX-carousel XXX-date-carousel`}
        {...settings}
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
              className={`XXX-date__box ${className ? className : ""}`}
              onClick={() => onDateChangeHandler(date)}
            >
              <div className={`XXX-week-date`}>
                {getWeekDayFormat(date.date)}
              </div>
              <div
                className={`XXX-numeral-date ${
                  date.date === today ? "underline underline-offset-4" : ""
                }`}
              >
                <span>{getDate(date.date)}</span>
              </div>
            </button>
          </label>
        ))}
      </Slider>
    </>
  );
};

export interface AOADatePickerProps {
  selectedDate: string;
  dateTimeSlots: Array<DateSlot>;
  onChangeDate: (date: string) => void;
}

const TitledDatePicker: React.FC<AOADatePickerProps> = ({ ...props }) => {
  const { selectedDate, dateTimeSlots, onChangeDate } = props;

  const [selectedMonth, selectedYear] = useMemo(() => {
    return getFormattedMonthAndYear(
      (selectedDate || dateTimeSlots[0]?.date) ??
        new Date().toLocaleDateString("uk")
    );
  }, [selectedDate, dateTimeSlots]);

  return (
    <div className={`XXX-aoa-date-picker mb-8`}>
      <h4
        className={`mb-4 text-center font-medium`}
      >{`${selectedMonth} ${selectedYear}`}</h4>
      <DatePicker
        selectedDate={selectedDate}
        dateTimeSlots={dateTimeSlots}
        onChangeDate={onChangeDate}
      />
    </div>
  );
};

export default TitledDatePicker;

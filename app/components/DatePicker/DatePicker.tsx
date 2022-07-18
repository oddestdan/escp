import React, { useMemo, useEffect, useState } from "react";
import Slider from "react-slick";

import {
  getActiveSlideIndex,
  getDate,
  getWeekDayFormat,
} from "./DatePicker.helper";

export interface DateSlot {
  date: string;
  dayOfWeek: string;
  isOpen: boolean;
  availableTimeSlotList?: Array<unknown>;
}

export interface DatePickerProps {
  className?: string;
  selectedDate: string;
  dateTimeSlots: Array<DateSlot>;
  onChangeDate: (date: string) => void;
}

export const BREAKPOINTS = {
  mobileMaxWidth: 767, // anything above 768 will be treated as tablet
  tabletMaxWidth: 1279, // anything above 1279 will be treated as desktop,
  mobilePortrait: 414,
  mobileLandscape: 667,
  tabletPortrait: 768,
  tabletLandscape: 1025,
  desktopMin: 1200,
};

export const getIsMobile = (): boolean => {
  return window.innerWidth < BREAKPOINTS.mobileMaxWidth;
};

const DatePicker: React.FC<DatePickerProps> = ({ ...props }) => {
  const { className, selectedDate, dateTimeSlots, onChangeDate } = props;

  const activeSlideIndex = useMemo(() => {
    return getActiveSlideIndex(dateTimeSlots, selectedDate);
  }, [dateTimeSlots, selectedDate]);

  // Create state to keep track of window width
  const [isMobile, setIsMobile] = useState(false);

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 7,
    slidesToScroll: 7,
    // prevArrow: <span className="bg-black">prev</span>,
    // nextArrow: <span className="bg-black">next</span>,
    initialSlide: activeSlideIndex,
  };

  useEffect(() => {
    // Setting state to keep track of device type
    setIsMobile(getIsMobile());
  }, []);

  const onDateChangeHandler = (date: DateSlot) => {
    if (
      date.isOpen &&
      date.availableTimeSlotList?.length &&
      date.date !== selectedDate
    ) {
      onChangeDate(date.date);
    }
  };

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
              disabled={
                !(
                  date.isOpen &&
                  date.availableTimeSlotList &&
                  date.availableTimeSlotList.length > 0
                )
              }
              checked={date.date === selectedDate}
              readOnly={true}
            />
            <button
              className={`XXX-date__box ${className ? className : ""}`}
              onClick={() => onDateChangeHandler(date)}
            >
              <div className={`XXX-week-date`}>
                {getWeekDayFormat(date.date)}
                {/* {isMobile */}
                {/* ? getWeekDayMobileFormat(date.date) */}
                {/* : getWeekDayFormat(date.date)} */}
              </div>
              <div className={`XXX-numeral-date`}>
                <span>{getDate(date.date)}</span>
              </div>
            </button>
          </label>
        ))}
      </Slider>
    </>
  );
};

export const getFormattedMonthAndYear = (
  selectedDate: string | undefined
): [string, number] => {
  if (selectedDate && selectedDate.length) {
    const formattedSelectedDate = new Date(`${selectedDate}T00:00:00`);
    return [
      formattedSelectedDate.toLocaleString("uk", {
        month: "long",
      }),
      formattedSelectedDate.getFullYear(),
    ];
  }

  return ["", 0];
};

export interface AOATimeSlot {
  startTime: string;
  endTime: string; // TODO: remove
}
export interface AOADateSlot {
  date: string;
  dayOfWeek: string;
  isOpen: boolean;
  availableTimeSlotList?: Array<AOATimeSlot>;
}

export interface AOADatePickerProps {
  selectedDate: string;
  dateTimeSlots: Array<AOADateSlot>;
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
    <div className={`XXX-aoa-date-picker`}>
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
